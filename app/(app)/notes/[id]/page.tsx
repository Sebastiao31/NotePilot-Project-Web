"use client"
import React from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import MarkdownViewer from '@/components/ui/markdown-viewer'
import { useParams } from 'next/navigation'
import Satisfied from '@/components/satisfied'
import { Separator } from '@/components/ui/separator'
import { IconLoader2 } from '@tabler/icons-react'

const Page = () => {
  const { db } = getFirebase()
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [status, setStatus] = React.useState<'generating' | 'ready' | 'error' | undefined>('ready')
  const params = useParams()
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
      <MarkdownViewer content={content || ''} />

      

      <div>
        {status === 'generating' ? (
          <div className='flex items-center gap-2 text-muted-foreground mt-6'>
            <IconLoader2 className='size-4 animate-spin' />
            <span>We are generating your note…</span>
          </div>
        ) : (
          <Satisfied />
        )}
      </div>
    </div>
  )
}

export default Page