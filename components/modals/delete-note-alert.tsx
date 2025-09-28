"use client"

import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import type { NoteDoc } from '@/hooks/use-notes'
import { getFirebase } from '@/lib/firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { IconTrash } from '@tabler/icons-react'

type Props = { note: NoteDoc; open: boolean; onOpenChange: (open: boolean) => void }

const DeleteNoteAlert: React.FC<Props> = ({ note, open, onOpenChange }) => {
  const { db } = getFirebase()
  const [deleting, setDeleting] = React.useState(false)

  const onDelete = async () => {
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'notes', note.id))
      onOpenChange(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className='bg-destructive/10 rounded-full p-2 w-fit mb-2'>
            <IconTrash className='size-6 text-destructive' />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-xl font-semibold'>Delete note</AlertDialogTitle>
          <AlertDialogDescription className='text-md'>
            Are you sure you want to delete this note? Warning, this action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='mt-8'>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={deleting} className='bg-destructive text-background-primary hover:bg-destructive/80'>
            {deleting ? 'Deleting…' : 'Delete note'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteNoteAlert