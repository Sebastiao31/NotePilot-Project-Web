import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const selectFolder = () => {
  return (
    <main>
        <div className='flex flex-col gap-2'>
            <label htmlFor="folder" className='text-start'>Folder</label>
            <Select>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">Folder 1</SelectItem>
                    <SelectItem value="2">Folder 2</SelectItem>
                    <SelectItem value="3">Folder 3</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </main>
  )
}

export default selectFolder