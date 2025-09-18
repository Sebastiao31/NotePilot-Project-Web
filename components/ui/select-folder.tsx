"use client"
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFolders } from '@/hooks/use-folders'

type Props = {
  value: string | undefined
  onChange: (folderId: string) => void
  disabled?: boolean
}

const SelectFolder = ({ value, onChange, disabled }: Props) => {
  const { folders, loading } = useFolders()

  return (
    <main>
        <div className='flex flex-col gap-2'>
            <label htmlFor="folder" className='text-start'>Folder</label>
            <Select value={value} onValueChange={onChange} disabled={disabled || loading}>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder={loading ? 'Loading folders…' : 'Select a folder'} />
                </SelectTrigger>
                <SelectContent>
                    {folders.map((f) => (
                      <SelectItem key={f.id} value={f.id!}>{f.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </main>
  )
}

export default SelectFolder