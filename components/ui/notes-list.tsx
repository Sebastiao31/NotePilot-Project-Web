"use client"
import React from 'react'
import NoteItem from './note-item'
import { useNotes } from '@/hooks/use-notes'
import { useNoteSidebar } from '../note-provider'
import { Button } from './button'
import { IconPlus } from '@tabler/icons-react'
import { Dialog, DialogContent } from './dialog'
import MoreOptions from '../modals/more-options'

export default function NotesList() {
  const { notes, loading } = useNotes()
  const { selectedFolder, searchQuery } = useNoteSidebar()
  const [open, setOpen] = React.useState(false)
  const q = searchQuery.trim().toLowerCase()
  const items = (notes ?? []).filter((n) => {
    if (!selectedFolder) return true
    return (n.folder ?? null) === selectedFolder
  }).filter((n) => {
    if (!q) return true
    const title = (n.title ?? '').toLowerCase()
    const overview = (n.overview ?? '').toLowerCase()
    return title.includes(q) || overview.includes(q)
  })

  return (
    <div className='mt-2'>
      {loading && items.length === 0 ? (
        <div className='text-sm text-muted-foreground px-4 py-6'>Loading notes…</div>
      ) : items.length === 0 ? (
        <div className='text-center items-center justify-center mt-48 flex h-full px-4 py-6 flex-col gap-3'>
          <div className='text-md text-muted-foreground'>No notes found… Yet! <br /> Create one now.</div>
          <Button className='gap-2 mt-2' onClick={() => setOpen(true)}>
            <IconPlus className='size-5' />
            Create note
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <MoreOptions />
            </DialogContent>
          </Dialog>
        </div>
      
      ) : (
        <div>
          {items.map((note) => (
            <div key={note.id}>
              <NoteItem note={note} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}