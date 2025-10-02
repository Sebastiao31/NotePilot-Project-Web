"use client"
import React from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import MarkdownViewer from '@/components/ui/markdown-viewer'
import { useParams } from 'next/navigation'
import Satisfied from '@/components/satisfied'
import { Separator } from '@/components/ui/separator'
import { IconLoader2, IconMoodEmpty, IconPlus } from '@tabler/icons-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import MoreOptions from '@/components/modals/more-options'
import { Button } from '@/components/ui/button'
import RichText from '@/components/rich-text'

const Page = () => {
  const { db } = getFirebase()
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [status, setStatus] = React.useState<'generating' | 'ready' | 'error' | undefined>('ready')
  const params = useParams()
  const [open, setOpen] = React.useState(false)
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  React.useEffect(() => {
    if (!id) return
    const ref = doc(db, 'notes', id)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      setTitle(data?.title || '')
      setContent(data?.note || '')
      setStatus((data?.status as any) || 'ready')
    })
    return () => unsub()
  }, [db, id])

  return (
    <div className='p-6 bg-background-primary h-full'>

      <div>
        <RichText />
      </div>
      <MarkdownViewer content={content || ''} />

      {content ? 
      <div>
        <div>
          <Satisfied />
          </div>
      </div>
        : status != 'generating' && (
      <div className='flex mt-34 flex-col items-center justify-center gap-2'> 

        <div className='gap-2 flex flex-col items-center justify-center'>
          <IconMoodEmpty className='size-10 text-destructive' />
          <h1 className='text-2xl font-bold'>Well this is awkward...</h1>
          <p className='text-muted-foreground'>we could not find any content for this note.</p>
        </div>
        <div>
        <Button className='gap-2 mt-2' onClick={() => setOpen(true)}>
            <IconPlus className='size-5' />
            Create note
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <MoreOptions />
            </DialogContent>
          </Dialog>


        </div>

        
        </div>)}

      

      <div>
        {status === 'generating' && (
          <div className='flex items-center gap-2 text-muted-foreground mt-6'>
            <IconLoader2 className='size-4 animate-spin' />
            <span>We are generating your note…</span>
          </div>
        )}
          
      </div>
    </div>
  )
}

export default Page