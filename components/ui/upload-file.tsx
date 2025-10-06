"use client"
import { IconCloudUpload, IconUpload, IconTrash, IconCircleCheck } from '@tabler/icons-react'
import React from 'react'
import { Button } from './button'
import Image from 'next/image'

type Props = {
  onParsed?: (text: string) => void
}

const uploadFile = ({ onParsed }: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [fileName, setFileName] = React.useState<string | null>(null)
  const [completed, setCompleted] = React.useState(false)

  const onPickFile = () => {
    inputRef.current?.click()
  }

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setError('Only PDF files are supported')
      return
    }

    // Enforce max size: 10 MB
    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      setError('PDF exceeds 10 MB limit')
      e.target.value = ''
      return
    }

    try {
      setError(null)
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/notes/parse-pdf', {
        method: 'POST',
        body: form,
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed to parse PDF')
        return
      }

      // Log parsed text and number of pages to verify parsing works
      console.log('Parsed PDF pages:', data?.numpages)
      console.log('Parsed PDF text:', data?.text)
      onParsed?.(data?.text || '')
      setFileName(file.name)
      setCompleted(true)
    } catch (err) {
      setError('Unexpected error parsing PDF')
    } finally {
      // allow selecting the same file again
      e.target.value = ''
    }
  }

  const clearSelection = () => {
    setFileName(null)
    setCompleted(false)
    setError(null)
  }

  return (
    <>
      {fileName ? (
        <div className="rounded-lg border p-3 bg-background">
          <div className="flex items-stretch">
            <div className="flex items-center justify-center pl-2">
              <Image src="/PdfICon.svg" alt="PDF" width={50} height={50} />
            </div>
            <div className="flex-1 px-3 py-1">
              <div className="font-semibold truncate" title={fileName}>{fileName}</div>
              <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                <IconCircleCheck className="size-4" />
                <span>{completed ? 'Completed' : 'Processing…'}</span>
              </div>
            </div>
            <div className="flex items-center justify-center w-12">
              <button aria-label="Remove" onClick={clearSelection} className="text-muted-foreground hover:text-foreground">
                <IconTrash className="size-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <main className="bg-upload-file-bg rounded-lg p-4 border  py-8">
            <div className='flex flex-col gap-2 items-center justify-center'>
                <IconCloudUpload className='!size-10 text-muted-foreground'/>
                <div className='flex flex-col items-center justify-center gap-1 mt-2'>
                    <h3 className=' font-semibold'>Choose or drag and drop the file here</h3>
                    <p className='text-sm text-muted-foreground'>Max size: 10 MB</p>
                </div>
                <div className="mt-4">
                    <input
                      ref={inputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={onFileChange}
                      style={{ display: 'none' }}
                    />
                    <Button onClick={onPickFile}>
                        <IconUpload/>
                        Choose File
                    </Button>
                </div>
            </div>
        </main>
      )}
      {error && (
        <p className='text-sm text-destructive mt-2'>{error}</p>
      )}
    </>
  )
}

export default uploadFile