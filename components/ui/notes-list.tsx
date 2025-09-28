"use client"
import React from 'react'
import NoteItem from './note-item'
import { useNotes } from '@/hooks/use-notes'
import { useNoteSidebar } from '../note-provider'

export default function NotesList() {
  const { notes, loading } = useNotes()
  const { selectedFolder, searchQuery } = useNoteSidebar()
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
        <div className='text-sm text-muted-foreground px-4 py-6'>No notes found.</div>
      ) : (
        <ul>
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