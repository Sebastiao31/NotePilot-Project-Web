import { IconCloudUpload, IconUpload } from '@tabler/icons-react'
import React from 'react'
import { Button } from './button'

const uploadFile = () => {
  return (
    <main className="bg-upload-file-bg rounded-lg p-4 border  py-8">
        <div className='flex flex-col gap-2 items-center justify-center'>
            <IconCloudUpload className='!size-10 text-muted-foreground'/>
            <div className='flex flex-col items-center justify-center gap-1 mt-2'>
                <h1>Choose or drag and drop a file here</h1>
                <p className='text-sm text-muted-foreground'>PDF, DocX, Mp4, Mp3, TXT and more</p>
            </div>
            <div className="mt-4">
                <Button>
                    <IconUpload/>
                    Choose File
                </Button>
            </div>
        </div>
    </main>
  )
}

export default uploadFile