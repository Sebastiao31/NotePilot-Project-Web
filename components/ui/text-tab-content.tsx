import React from 'react'
import PasteText from '@/components/ui/paste-text'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'
import { Separator } from './separator'

const TextTabContent = () => {
  return (
    <main className='flex flex-col space-y-8 mt-8'>
        <div className='flex flex-col gap-2'>
            <label htmlFor="text">Text</label>
            <PasteText />
        </div>

        <div>
            <SelectFolder />
        </div>


        <div>
            <Button className='w-full h-12'>
                Summarize text
            </Button>
        </div>

        
    </main>
  )
}

export default TextTabContent