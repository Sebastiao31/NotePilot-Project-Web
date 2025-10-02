import React from 'react'
import UploadFile from '@/components/ui/upload-file'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'
import { useFolders } from '@/hooks/use-folders'

const UploadTabContent = () => {
  const [folderId, setFolderId] = React.useState<string | undefined>(undefined)
  const { folders } = useFolders()
  const [loading, setLoading] = React.useState(false)
  
  return (
    <main className='flex flex-col space-y-8 mt-8'>
        <div className='flex flex-col gap-2'>
            <label htmlFor="upload-file" className='text-start'>Upload File</label>
            <UploadFile />
        </div>
        <div>
          <input type="file" accept='.pdf '/>
        </div>

        <div>
            <SelectFolder value={folderId} onChange={setFolderId} disabled={loading} />
        </div>

        <div>
            <Button className='w-full h-12' onClick={() => {
              try {
                const closeBtn = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement | null
                closeBtn?.click()
              } catch {}
            }} >
              
                Summarize file
            </Button>
        </div>

        
    </main>
  )
}

export default UploadTabContent