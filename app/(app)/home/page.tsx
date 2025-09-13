import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NoteFilter from '@/components/note-filter'
import SearchNote from '@/components/search-note'
import NotesList from '@/components/ui/notes-list'


const page = () => {
  return (
    <main>
      <div className='mb-8'>
        <h1 className='text-2xl font-semibold'>My Notes</h1>
      </div>

      <div className='flex items-center justify-between'>
        <div>
          <NoteFilter />
        </div>
        <div>
          <SearchNote />
        </div>
        
      </div>

      <div>
        <NotesList />
      </div>
     
    </main>
  )
}

export default page