"use client"
import React from 'react'
import NoteItem from './note-item'
import { useNotes } from '@/hooks/use-notes'
import { useNoteSidebar } from '../note-provider'

export default function NotesList() {
  const { notes, loading } = useNotes()
  const { selectedFolder } = useNoteSidebar()
  const items = (notes ?? []).filter((n) => {
    if (!selectedFolder) return true
    return (n.folder ?? null) === selectedFolder
  })

  return (
    <div className='mt-2'>
      {loading && items.length === 0 ? (
        <div className='text-sm text-muted-foreground px-4 py-6'>Loading notes…</div>
      ) : (
        <ul >
          {items.map((note) => (
            <li key={note.id}>
              <NoteItem note={note} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}