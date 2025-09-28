"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { NoteDoc } from '@/hooks/use-notes'
import { getFirebase } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

type Props = {
  note: NoteDoc
  open: boolean
  onOpenChange: (open: boolean) => void
}

const RenameNote: React.FC<Props> = ({ note, open, onOpenChange }) => {
  const [title, setTitle] = React.useState<string>(note.title || '')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (open) setTitle(note.title || '')
  }, [open, note.title])

  const onSave = async () => {
    const trimmed = title.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      const { db } = getFirebase()
      await updateDoc(doc(db, 'notes', note.id), { title: trimmed })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Rename note</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Note title' autoFocus />
        </div>
        <DialogFooter>
          <Button variant='ghost' onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={onSave} disabled={saving || title.trim().length === 0}>{saving ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RenameNote