import React from 'react'
import { Input } from '@/components/ui/input'
import SelectFolder from '@/components/ui/select-folder'
import { Button } from './button'
import { useUserData } from '@/hooks/use-user-data'
import { getFirebase, serverTimestamp } from '@/lib/firebase'
import { useFolders } from '@/hooks/use-folders'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'

const WebsiteTabContent = () => {
  const { authUser } = useUserData()
  const { folders } = useFolders()
  const [url, setUrl] = React.useState('')
  const [folderId, setFolderId] = React.useState<string | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)

  const handleWebsite = async () => {
    if (loading) return
    const clean = url.trim()
    if (!authUser || !clean) return
    try {
      new URL(clean)
    } catch {
      return
    }
    setLoading(true)
    const { db } = getFirebase()
    try {
      const selectedFolderName = folders.find((f) => f.id === folderId)?.name ?? null
      const placeholder = {
        userId: authUser.uid,
        title: 'Website note',
        note: '',
        transcript: `Source: ${clean}`,
        source: clean,
        date: serverTimestamp(),
        folder: selectedFolderName,
        satisfied: null,
        status: 'generating',
        type: 'Website',
      }
      const ref = await addDoc(collection(db, 'notes'), placeholder)

      const res = await fetch('/api/notes/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: clean })
      })
      if (!res.ok) throw new Error('Website summarize failed')
      const data = await res.json()
      const summary: string = data.summary || ''
      const title: string = (data.title || '').slice(0, 80)
      const transcript: string = data.transcript || ''

      // Generate plain-text overview from raw transcript (not markdown summary)
      const overRes = await fetch('/api/notes/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript })
      })
      const overData = await overRes.json()
      const overview: string = overData.overview || ''

      await updateDoc(doc(db, 'notes', ref.id), {
        note: summary,
        title: title || placeholder.title,
        transcript: transcript,
        source: clean,
        overview: overview,
        status: 'ready',
      })

      setUrl('')
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
            <label htmlFor="website-url" className='text-start'>Website URL</label>
            <Input type="text" id="website-url" placeholder="Enter Website URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div>
            <SelectFolder value={folderId} onChange={setFolderId} disabled={loading} />
        </div>

        <div className="text-start">
            <p className='text-sm text-muted-foreground'>*It’ll be imported only the visible text of the website</p>
            <p className='text-sm text-muted-foreground'>*Paid articles may not be compatible</p>
        </div>
        
        <div>
            <Button className='w-full h-12' onClick={handleWebsite} disabled={!url.trim() || !authUser || loading}>
                {loading ? 'Summarizing…' : 'Summarize website link'}
            </Button>
        </div>
    </main>
  )
}

export default WebsiteTabContent