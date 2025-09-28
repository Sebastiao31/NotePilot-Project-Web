"use client"
import React from 'react'
import PasteText from '@/components/ui/paste-text'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'
import { Separator } from './separator'
import { getFirebase, serverTimestamp } from '@/lib/firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useUserData } from '@/hooks/use-user-data'

const TextTabContent = () => {
  const { authUser } = useUserData()
  const [text, setText] = React.useState('')
  const [folderId, setFolderId] = React.useState<string | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)

  const handleSummarize = async () => {
    if (loading) return
    const clean = text.trim()
    if (!authUser || !clean) return
    setLoading(true)
    const { db } = getFirebase()
    try {
      const placeholder = {
        userId: authUser.uid,
        title: clean.slice(0, 80) || 'New Note',
        note: 'Generating summary…',
        transcript: clean,
        date: serverTimestamp(),
        folder: folderId ?? null,
        satisfied: null,
        status: 'generating',
        type: 'Text',
      }
      const ref = await addDoc(collection(db, 'notes'), placeholder)

      const res = await fetch('/api/notes/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean }),
      })
      if (!res.ok) throw new Error('Summarization failed')
      const data = await res.json()
      const summary: string = data.summary || ''
      const title: string = (data.title || '').slice(0, 80)

      // Generate plain-text overview from original input (not markdown summary)
      const overRes = await fetch('/api/notes/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean })
      })
      const overData = await overRes.json()
      const overview: string = overData.overview || ''

      await updateDoc(doc(db, 'notes', ref.id), {
        note: summary,
        title: title || placeholder.title,
        overview: overview,
        status: 'ready',
        // keep satisfied as null until the user reacts
      })
      setText('')
      setFolderId(undefined)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex flex-col space-y-8 mt-8'>
        <div className='flex flex-col gap-2'>
            <label htmlFor="text" className='text-start'>Text</label>
            <PasteText value={text} onChange={setText} disabled={loading} />
        </div>

        <div>
            <SelectFolder value={folderId} onChange={setFolderId} disabled={loading} />
        </div>


        <div>
            <Button className='w-full h-12' onClick={handleSummarize} disabled={!text.trim() || !authUser || loading}>
                {loading ? 'Summarizing…' : 'Summarize text'}
            </Button>
        </div>

        
    </main>
  )
}

export default TextTabContent