import React from 'react'
import { Input } from '@/components/ui/input'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'

const WebsiteTabContent = () => {
  return (
    <main className='flex flex-col space-y-8 mt-8'>
        <div className='flex flex-col gap-2'>
            <label htmlFor="website-url">Website URL</label>
            <Input type="text" id="website-url" placeholder="Enter Website URL" />
        </div>

        <div>
            <SelectFolder />
        </div>

        <div>
            <p className='text-sm text-muted-foreground'>*It’ll be imported only the visible text of the website</p>
            <p className='text-sm text-muted-foreground'>*Paid articles may not be compatible</p>
        </div>
        
        <div>
            <Button className='w-full h-12'>
                Summarize website link
            </Button>
        </div>
    </main>
  )
}

export default WebsiteTabContent