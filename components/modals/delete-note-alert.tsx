"use client"

import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import type { NoteDoc } from '@/hooks/use-notes'
import { getFirebase } from '@/lib/firebase'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { IconTrash } from '@tabler/icons-react'

type Props = { note: NoteDoc; open: boolean; onOpenChange: (open: boolean) => void }

const DeleteNoteAlert: React.FC<Props> = ({ note, open, onOpenChange }) => {
  const { db } = getFirebase()
  const [deleting, setDeleting] = React.useState(false)

  const onDelete = async () => {
    setDeleting(true)
    try {
      const noteRef = doc(db, 'notes', note.id)
      // Delete nested subcollections (suggestions, chats and chat messages)
      // suggestions
      try {
        const suggSnap = await getDocs(collection(db, 'notes', note.id, 'suggestions'))
        await Promise.all(suggSnap.docs.map(d => deleteDoc(d.ref)))
      } catch {}
      // chats -> messages
      try {
        const chatsSnap = await getDocs(collection(db, 'notes', note.id, 'chats'))
        for (const chat of chatsSnap.docs) {
          const msgsSnap = await getDocs(collection(db, 'notes', note.id, 'chats', chat.id, 'messages'))
          await Promise.all(msgsSnap.docs.map(m => deleteDoc(m.ref)))
          await deleteDoc(chat.ref)
        }
      } catch {}
      // finally delete the note itself
      await deleteDoc(noteRef)
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