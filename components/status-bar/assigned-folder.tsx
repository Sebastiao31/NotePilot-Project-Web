import { IconFolder } from '@tabler/icons-react'
import React from 'react'

const assignedFolder = () => {
  return (
    <main>
        <div className='flex items-center gap-2 bg-sidebar py-2 px-3 rounded-md'>
            <div>
                <IconFolder className="size-5" />
            </div>

            <div>
                <p className='text-[16px] text-muted-foreground font-semibold'>No folder</p>
            </div>
        </div>
    </main>
  )
}

export default assignedFolder