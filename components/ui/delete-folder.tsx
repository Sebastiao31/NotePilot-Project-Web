"use client"

import React from 'react'
import { Button } from './button'
import { IconTrash } from '@tabler/icons-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog'
import { getFirebase } from '@/lib/firebase'
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useUserData } from '@/hooks/use-user-data'

type Props = { id: string; name?: string; onDeleted?: (id: string) => void }

const deleteFolder = ({ id, name, onDeleted }: Props) => {
  const { db } = getFirebase()
  const { authUser } = useUserData()
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const onDelete = async () => {
    setDeleting(true)
    try {
      if (!authUser) throw new Error('Not authenticated')
      // Resolve the latest persisted folder name (in case the local name is unsaved)
      const folderSnap = await getDoc(doc(db, 'folders', id))
      const persistedName = (folderSnap.exists() ? (folderSnap.data() as any)?.name : undefined) as string | undefined
      const namesToClear = Array.from(new Set([name, persistedName].filter((v): v is string => !!v)))
      // Clear folder from any notes referencing this folder name(s)
      for (const nm of namesToClear) {
        const notesQ = query(
          collection(db, 'notes'),
          where('userId', '==', authUser.uid),
          where('folder', '==', nm)
        )
        const snap = await getDocs(notesQ)
        await Promise.all(snap.docs.map(d => updateDoc(doc(db, 'notes', d.id), { folder: null })))
      }
      // Delete folder document
      await deleteDoc(doc(db, 'folders', id))
      onDeleted?.(id)
      setOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen} >
      <Button variant="destructive" size="chat" onClick={() => setOpen(true)}>
        <IconTrash className="size-6"/>
      </Button>
      <AlertDialogContent>
        <div className='bg-destructive/10 rounded-full p-2 w-fit mb-2'>
          <IconTrash className='size-6 text-destructive' />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl font-semibold'>Delete folder</AlertDialogTitle>
          <AlertDialogDescription className='text-md'>
            {`Are you sure you want to delete${name ? ` "${name}"` : ''}? This action cannot be undone.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-6'>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={deleting} className='bg-destructive text-background-primary hover:bg-destructive/80'>
            {deleting ? 'Deleting…' : 'Delete folder'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default deleteFolder