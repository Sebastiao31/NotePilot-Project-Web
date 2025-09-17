import { IconEdit } from '@tabler/icons-react'
import React from 'react'
import { Button } from './button'

const editFolder = () => {
  return (
    <Button variant="ghost" className='w-full justify-start'>
        <IconEdit className="size-5" />
        Edit Folders
    </Button>
  )
}

export default editFolder