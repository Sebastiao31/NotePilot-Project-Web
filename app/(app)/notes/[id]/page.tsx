"use client"
import React from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import MarkdownViewer from '@/components/ui/markdown-viewer'
import { useParams } from 'next/navigation'

const Page = () => {
  const { db } = getFirebase()
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  React.useEffect(() => {
    if (!id) return
    const ref = doc(db, 'notes', id)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      setTitle(data?.title || '')
      setContent(data?.note || '')
    })
    return () => unsub()
  }, [db, id])

  return (
    <div className='p-8 bg-background-primary h-full'>
      <h1 className='text-2xl font-semibold mb-6'>{title || 'Untitled note'}</h1>
      <MarkdownViewer content={content || ''} />
    </div>
  )
}

export default Page