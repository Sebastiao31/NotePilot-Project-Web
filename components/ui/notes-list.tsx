import React from 'react'
import NoteItem from './note-item'
import { NOTES } from '@/constants/notes'

export default function NotesList() {
  return (
    <div className='mt-6'>
      <ul className='divide-y'>
        {NOTES.map((note) => (
          <li key={note.id}>
            <NoteItem note={note} />
          </li>
        ))}
      </ul>
    </div>
  )
}