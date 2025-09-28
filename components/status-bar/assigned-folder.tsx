import { IconFolder } from '@tabler/icons-react'
import React from 'react'
import type { NoteDoc } from '@/hooks/use-notes'
import { useFolders } from '@/hooks/use-folders'

type Props = { note?: NoteDoc }

const AssignedFolder = ({ note }: Props) => {
  const { folders } = useFolders()
  const found = note?.folder ? folders.find((f) => f.name === note.folder) : undefined
  const label = found ? found.name : 'No folder'
  const color = found?.color
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