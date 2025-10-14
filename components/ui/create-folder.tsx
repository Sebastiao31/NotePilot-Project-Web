import { IconFolderPlus } from '@tabler/icons-react'
import React from 'react'
import { Button } from './button'

type Props = React.ComponentProps<typeof Button>

const createFolder = (props: Props) => {
  return (
    <Button variant="ghost" className='w-full justify-start text-lg' {...props}>
        <IconFolderPlus className="size-5" />
        Create Folder
    </Button>
  )
}


export default createFolder