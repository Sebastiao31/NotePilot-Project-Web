import React from 'react'
import NoteItem from './note-item'
import { NOTES } from '@/constants/notes'

export default function NotesList() {
  return (
    <div className='flex flex-col gap-3 mt-6'>
      {NOTES.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  )
}