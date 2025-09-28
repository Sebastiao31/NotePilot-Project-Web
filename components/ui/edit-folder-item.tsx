import React from 'react'
import { Button } from './button'
import { IconGripVertical } from '@tabler/icons-react'
import { Separator } from './separator'
import ChangeFolderColor from './change-folder-color'
import { Input } from './input'
import DeleteFolder from './delete-folder'
 

type Props = { id: string; name: string; color: string; onChange: (id: string, patch: { name?: string; color?: string }) => void }

const editFolderItem = ({ id, name, color, onChange }: Props) => {
  return (
    <main>
        <div className='flex items-center'>
            <div className='flex items-center gap-3 w-full py-2'>
 
                <div>
                    <ChangeFolderColor color={color} onChange={(hex) => { onChange(id, { color: hex }) }} />
                </div>

                <div className='w-full'>
                    <Input placeholder='Change name' className='w-full' value={name} onChange={(e) => { onChange(id, { name: e.target.value }) }} />
                </div>
                <div className='ml-auto flex items-center gap-2 overflow-show'>
                    <DeleteFolder id={id} name={name} />
                </div>
            </div>
        </div>
    </main>
  )
}

export default editFolderItem