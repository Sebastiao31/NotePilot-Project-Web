import React from 'react'
import { Input } from './input'

type Props = {
  value: string
  onChange: (v: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const FolderNameInput = ({ value, onChange, onKeyDown }: Props) => {
  return (
    <div className='flex flex-col gap-2'>
        <label htmlFor="folderName" className='text-start'>Folder Name</label>
        <Input
          id="folderName"
          placeholder="Enter folder name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
    </div>
  )
}

export default FolderNameInput