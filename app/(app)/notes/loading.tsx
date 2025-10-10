import React from 'react'
import { IconLoader2 } from '@tabler/icons-react'

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (

        <div className='flex items-center justify-center h-full'>
            <IconLoader2 className='size-4 animate-spin' />
        </div>
    )
  }