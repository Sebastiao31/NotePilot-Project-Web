import React from 'react'
import { Button } from './button'
import { IconFolderPlus } from '@tabler/icons-react'

type Props = React.ComponentProps<typeof Button>

const CreateFolderBtn = ({ children, ...props }: Props) => {
  return (
    <Button className='w-full h-12' {...props}>
        <IconFolderPlus className="size-5" />
        {children ?? 'Create Folder'}
    </Button>

  )
}

export default CreateFolderBtn