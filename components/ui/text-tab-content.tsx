"use client"
import React from 'react'
import PasteText from '@/components/ui/paste-text'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'
import { Separator } from './separator'
import { getFirebase, serverTimestamp } from '@/lib/firebase'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useUserData } from '@/hooks/use-user-data'
import { useFolders } from '@/hooks/use-folders'
import { convertToHTML } from '@/lib/convertToHTML'

const TextTabContent = () => {
  const { authUser } = useUserData()
  const { folders } = useFolders()
  const [text, setText] = React.useState('')
  const [folderId, setFolderId] = React.useState<string | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)

  const handleSummarize = async () => {
    if (loading) return
    const clean = text.trim()
    if (!authUser || !clean) return
    setLoading(true)
    // Close the parent dialog (More Options) once generation starts
    try {
      const closeBtn = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement | null
      closeBtn?.click()
    } catch {}
    const { db } = getFirebase()
    let noteId: string | null = null
    try {
      const selectedFolderName = folders.find((f) => f.id === folderId)?.name ?? null
      const placeholder = {
        userId: authUser.uid,
        title: clean.slice(0, 80) || 'New Note',
        note: '',
        transcript: clean,
        date: serverTimestamp(),
        folder: selectedFolderName,
        satisfied: null,
        status: 'generating',
        type: 'Text',
      }
      const ref = await addDoc(collection(db, 'notes'), placeholder)
      noteId = ref.id

      const res = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text', text: clean }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      const summary: string = data.summary || ''
      const docJson = data.doc || null
      const title: string = (data.title || '').slice(0, 80)
      const overview: string = data.overview || ''
      const html: string = convertToHTML(docJson)

      await updateDoc(doc(db, 'notes', ref.id), {
        note: html, // store HTML rendering of the generated TipTap JSON
        noteDoc: docJson ? JSON.stringify(docJson) : null,
        title: title || placeholder.title,
        overview: overview,
        status: 'ready',
        // keep satisfied as null until the user reacts
      })
      setText('')
      setFolderId(undefined)
    } catch (e) {
      console.error(e)
      try {
        if (noteId) {
          await updateDoc(doc(db, 'notes', noteId), { status: 'error' })
        }
      } catch {}
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