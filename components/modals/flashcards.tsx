"use client"

import * as React from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { IconLoader2, IconX } from '@tabler/icons-react'

type Flashcard = { front: string; back: string }

function normalizeLatexEscapes(s: string) {
  return (s ?? '')
    .replace(/\t(?=[A-Za-z])/g, '\\\\')
    .replace(/\f(?=[A-Za-z])/g, '\\\\')
}

function FlipCard({
  front,
  back,
  colors,
  flipped,
  onToggle,
}: {
  front: string
  back: string
  colors: { backgroundColor: string; borderColor: string }
  flipped: boolean
  onToggle: () => void
}) {
  return (
    <button
      type='button'
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
      aria-pressed={flipped}
      className='relative my-8 w-full h-56 md:h-64 outline-none cursor-pointer select-none'
      style={{ perspective: '1000px', WebkitPerspective: '1000px' as any }}
    >
      <div
        className='relative w-full h-full rounded-md'
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d' as any,
          transition: 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          willChange: 'transform',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformOrigin: 'center'
        }}
      >
        <div
          className='absolute inset-0 rounded-md border p-4 flex flex-col'
          style={{ backfaceVisibility: 'hidden' as any, WebkitBackfaceVisibility: 'hidden' as any, transform: 'rotateY(0deg) translateZ(0)', ...colors }}
        >
          <div className='text-muted-foreground text-xs mb-1 text-center'>Front</div>
          <div className='flex-1 flex items-center justify-center text-center text-[15px] leading-7'>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{ p: (props: any) => <span {...props} /> }}
            >
              {normalizeLatexEscapes(front)}
            </ReactMarkdown>
          </div>
        </div>
        <div
          className='absolute inset-0 rounded-md border p-4 flex flex-col'
          style={{ transform: 'rotateY(180deg) translateZ(0)', backfaceVisibility: 'hidden' as any, WebkitBackfaceVisibility: 'hidden' as any, ...colors }}
        >
          <div className='text-muted-foreground text-xs mb-1 text-center'>Back</div>
          <div className='flex-1 flex items-center justify-center text-center text-[15px] leading-7'>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{ p: (props: any) => <span {...props} /> }}
            >
              {normalizeLatexEscapes(back)}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </button>
  )
}

type Props = {
  noteId: string
  setId?: string | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function FlashcardsModal({ noteId, setId, open, onOpenChange }: Props) {
  const { db } = getFirebase()
  const [loading, setLoading] = React.useState(false)
  const [cards, setCards] = React.useState<Flashcard[] | null>(null)
  const [flipped, setFlipped] = React.useState<boolean[]>([])
  const [idx, setIdx] = React.useState(0)
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [flashDocId, setFlashDocId] = React.useState<string | null>(null)
  const phrases = React.useMemo(() => [
    'Scanning note content',
    'Extracting key concepts',
    'Authoring cards',
    'Polishing terms',
    'Formatting set',
  ], [])
  const [phraseIdx, setPhraseIdx] = React.useState(0)

  

  // Load note content
  React.useEffect(() => {
    if (!noteId) return
    const ref = doc(db, 'notes', noteId)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      setTitle(data?.title || '')
      setContent(data?.note || '')
    })
    return () => unsub()
  }, [db, noteId])

  // Rotate loading phrases
  React.useEffect(() => {
    if (!open || !loading) return
    const id = setInterval(() => setPhraseIdx((i) => (i + 1) % phrases.length), 1200)
    return () => clearInterval(id)
  }, [open, loading, phrases.length])

  // Generate set when opened (if no existing setId)
  React.useEffect(() => {
    const run = async () => {
      if (!open || !noteId || !title || !content) return
      if (setId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/notes/${noteId}/flashcards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
        const data = await res.json()
        const cs = Array.isArray(data?.cards) ? data.cards : []
        setCards(cs)
        setFlipped(new Array(cs.length).fill(false))
        setIdx(0)

        // Persist set and cards
        const setRef = await addDoc(collection(db, 'notes', noteId, 'flashcardSets'), {
          title: `Flashcards: ${title || noteId}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          numCards: cs.length,
        })
        setFlashDocId(setRef.id)
        for (const c of cs) {
          await addDoc(collection(db, 'notes', noteId, 'flashcardSets', setRef.id, 'cards'), c)
        }
      } catch (e) {
        console.error('flashcards generation failed', e)
        setCards([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [open, noteId, title, content, setId])

  // Load existing set if provided
  React.useEffect(() => {
    const loadExisting = async () => {
      if (!open || !noteId || !setId) return
      setLoading(true)
      try {
        const firestore = await import('firebase/firestore')
        const qsSnap = await firestore.getDocs(
          firestore.collection(db, 'notes', noteId, 'flashcardSets', setId, 'cards')
        )
        const cs: any[] = []
        qsSnap.forEach((d: any) => cs.push(d.data()))
        setCards(cs)
        setFlipped(new Array(cs.length).fill(false))
        setIdx(0)
      } catch (e) {
        console.error('failed to load flashcard set', e)
        setCards([])
      } finally {
        setLoading(false)
      }
    }
    loadExisting()
  }, [open, noteId, setId, db])

  const hasCards = Array.isArray(cards) && cards.length > 0
  const isLoading = loading || cards === null
  const current = hasCards ? cards![idx] : null

  const toggleFlip = (index: number) => {
    setFlipped((prev) => {
      const next = prev.slice()
      next[index] = !next[index]
      return next
    })
  }

  const getFlashColors = (index: number) => {
    const colorIdx = (index % 4) + 1
    return {
      backgroundColor: `var(--flash-${colorIdx}-bg)` as any,
      borderColor: `var(--flash-${colorIdx}-border)` as any,
    }
  }

  

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (loading && !v) return
        onOpenChange(v)
      }}
    >
      <DialogContent onInteractOutside={(e) => { if (loading) e.preventDefault() }}>
        <div className="flex justify-between items-center">
          <div>
            <DialogTitle>{loading ? 'Creating Flashcards…' : 'Flashcards'}</DialogTitle>
          </div>
          {!loading && (
            <div>
              <DialogClose asChild>
                <Button size="icon" variant="ghost">
                  <IconX className="!size-5" />
                </Button>
              </DialogClose>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className='flex items-center gap-3 py-6'>
            <IconLoader2 className='size-5 animate-spin' />
            <div className='text-sm text-muted-foreground'>{phrases[phraseIdx]}…</div>
          </div>
        ) : !hasCards ? (
          <div className='text-sm text-muted-foreground'>No flashcards were generated. Try again.</div>
        ) : (
          <div className='space-y-4'>
            
            <FlipCard
              front={current!.front}
              back={current!.back}
              colors={getFlashColors(idx)}
              flipped={flipped[idx]}
              onToggle={() => toggleFlip(idx)}
            />
            <div className='flex justify-between'>
              <Button variant='outline' onClick={() => { setIdx((v) => Math.max(0, v - 1)); }} disabled={idx === 0}>Previous</Button>
              <div className='flex items-center justify-between'>
              <div className='text-md text-muted-foreground mr-4'>{idx + 1} of {cards!.length}</div>
            </div>
              {idx >= (cards!.length - 1) ? (
                <DialogClose asChild>
                  <Button>Finish</Button>
                </DialogClose>
              ) : (
                <Button onClick={() => { setIdx((v) => Math.min(cards!.length - 1, v + 1)); }}>Next</Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}


