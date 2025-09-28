import React from 'react'
import { Input } from './ui/input'
import { useNoteSidebar } from './note-provider'
import { IconSearch } from '@tabler/icons-react'

const searchNote = () => {
  const { searchQuery, setSearchQuery } = useNoteSidebar()
  return (
    <div className="relative">
        <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input
          type='text'
          placeholder='Search notes'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-9'
        />
    </div>
  )
}

export default searchNote