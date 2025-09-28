import React from 'react'
import AssignedFolder from './assigned-folder'
import DataInfo from './data-info'
import HourInfo from './hour-info'
import type { NoteDoc } from '@/hooks/use-notes'
import { IconPointFilled } from '@tabler/icons-react'
type StatusBarProps = {
  note?: NoteDoc
}

const StatusBar = ({ note }: StatusBarProps) => {
  return (
    <main>
        <div className='flex items-center gap-2'>
            <AssignedFolder note={note} />
            <IconPointFilled className="size-3 text-muted-foreground"/>
            <DataInfo note={note} />
        </div>
    </main>
  )
}

export default StatusBar