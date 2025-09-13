import React from 'react'
import { Button } from './ui/button'
import { IconFolderPlus } from '@tabler/icons-react'

const createFolder = () => {
  return (
    <Button>
        <IconFolderPlus className='!size-5'/>
        <span>Create Folder</span>
    </Button>
  )
}

export default createFolder