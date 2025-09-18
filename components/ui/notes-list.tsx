"use client"
import React from 'react'
import NoteItem from './note-item'
import { useNotes } from '@/hooks/use-notes'

export default function NotesList() {
  const { notes, loading } = useNotes()
  const items = notes ?? []

  return (
    <div className='mt-6'>
      {loading && items.length === 0 ? (
        <div className='text-sm text-muted-foreground px-4 py-6'>Loading notes…</div>
      ) : (
        <ul className='divide-y'>
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