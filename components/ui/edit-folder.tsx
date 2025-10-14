import { IconEdit } from '@tabler/icons-react'
import React from 'react'
import { Button } from './button'

type Props = React.ComponentProps<typeof Button>

const editFolder = (props: Props) => {
  return (
    <Button variant="ghost" className='w-full justify-start text-lg' {...props}>
        <IconEdit className="size-5" />
        Edit Folders
    </Button>
  )
}

export default editFolder