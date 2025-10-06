import React from 'react'
import { getFirebase } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import RichText from '@/components/rich-text'

type Props = {
  noteId: string
}

const Preview = ({ noteId }: Props) => {
  const { db } = getFirebase()
  const [content, setContent] = React.useState<string>("")
  const [noteDoc, setNoteDoc] = React.useState<any | null>(null)

  React.useEffect(() => {
    if (!noteId) return
    const ref = doc(db, 'notes', noteId)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      setContent((data?.note || '').toString())
      try {
        const raw = data?.noteDoc
        setNoteDoc(typeof raw === 'string' ? JSON.parse(raw) : raw || null)
      } catch {
        setNoteDoc(null)
      }
    })
    return () => unsub()
  }, [db, noteId])

  return (
    <main className='min-w-0'>
      <div className='mb-4 text-lg font-semibold'>
        Current Note
      </div>
      <div className='overflow-y-auto max-h-[60vh] pr-2'>
        <RichText initialDoc={noteDoc} fallbackMarkdown={content} editable={false} />
      </div>
    </main>
  )
}

export default Preview