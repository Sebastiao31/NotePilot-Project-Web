import React from 'react'
import { Input } from '@/components/ui/input'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'

const YoutubeTabContent = () => {
  return (
    <main className='flex flex-col space-y-8 mt-8'>
        <div className='flex flex-col gap-2'>
            <label htmlFor="youtube-url">YouTube URL</label>
            <Input type="text" id="youtube-url" placeholder="Enter YouTube URL" />
        </div>

        <div>
            <SelectFolder />
        </div>

        <div>
            <p className='text-sm text-muted-foreground'>*Only public Youtube videos are supported</p>
            <p className='text-sm text-muted-foreground'>*Recent uploaded videos can’t be availble for import yet</p>
        </div>

        <div>
            <Button className='w-full h-12'>
                Summarize YT link
            </Button>
        </div>
    </main>
  )
}

export default YoutubeTabContent