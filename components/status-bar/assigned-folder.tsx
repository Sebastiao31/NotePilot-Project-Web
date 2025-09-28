import { IconFolder } from '@tabler/icons-react'
import React from 'react'
import type { NoteDoc } from '@/hooks/use-notes'
import { useFolders } from '@/hooks/use-folders'

type Props = { note?: NoteDoc }

const AssignedFolder = ({ note }: Props) => {
  const label = note?.folder ? note.folder : 'No folder'
  const { folders } = useFolders()
  const color = note?.folder ? (folders.find((f) => f.name === note.folder)?.color ?? undefined) : undefined
  return (
    <main>
        <div className='flex items-end  gap-2'>
            <div>
                <IconFolder className="size-5" style={color ? { color } : undefined} />
            </div>

            <div className='min-w-0'>
                <span className='block text-[16px] font-medium truncate max-w-[100px] sm:max-w-[140px]' title={label}>{label}</span>
            </div>
        </div>
    </main>
  )
}

export default AssignedFolder