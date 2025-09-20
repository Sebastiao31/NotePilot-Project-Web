"use client"

import * as React from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { IconLoader2, IconX } from '@tabler/icons-react'

type QuizQuestion = { q: string; options: string[]; correct: number }

type Props = {
  noteId: string
  quizId?: string | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function Quiz({ noteId, quizId, open, onOpenChange }: Props) {
  const { db } = getFirebase()
  const [loading, setLoading] = React.useState(false)
  const [questions, setQuestions] = React.useState<QuizQuestion[] | null>(null)
  const [idx, setIdx] = React.useState(0)
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')
  const [answers, setAnswers] = React.useState<number[]>([])
  const [quizDocId, setQuizDocId] = React.useState<string | null>(null)
  const phrases = React.useMemo(() => [
    'Analyzing note content',
    'Creating questions',
    'Balancing difficulty',
    'Checking answers',
    'Formatting quiz',
  ], [])
  const [phraseIdx, setPhraseIdx] = React.useState(0)

  // Fix common JSON-escape losses for LaTeX commands (e.g., \t -> tab, \f -> form feed)
  const fixLatexEscapes = React.useCallback((s: string) => {
    return (s ?? '')
      .replace(/\t(?=[A-Za-z])/g, '\\\\') // tab -> backslash for commands like \times
      .replace(/\f(?=[A-Za-z])/g, '\\\\') // form feed -> backslash for commands like \frac
  }, [])

  // Always render full Markdown (including math) to avoid limiting content types.

  // Load note title/content
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

  // Trigger generation when opened (only if no existing quizId provided)
  React.useEffect(() => {
    const run = async () => {
      if (!open || !noteId || !title || !content) return
      if (quizId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/notes/${noteId}/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content })
        })
        const data = await res.json()
        const qs = Array.isArray(data?.questions) ? data.questions : []
        setQuestions(qs)
        setAnswers(new Array(qs.length).fill(-1))
        setIdx(0)
        // Persist quiz and questions
        const quizRef = await addDoc(collection(db, 'notes', noteId, 'quizzes'), {
          title: `Quiz: ${title || noteId}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          numQuestions: qs.length,
        })
        setQuizDocId(quizRef.id)
        for (const q of qs) {
          await addDoc(collection(db, 'notes', noteId, 'quizzes', quizRef.id, 'questions'), q)
        }
      } catch (e) {
        console.error('quiz generation failed', e)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [open, noteId, title, content, quizId])

  // If an existing quizId is provided, load it instead of generating
  React.useEffect(() => {
    const loadExisting = async () => {
      if (!open || !noteId || !quizId) return
      setLoading(true)
      try {
        const qsSnap = await (await import('firebase/firestore')).getDocs(
          (await import('firebase/firestore')).collection(db, 'notes', noteId, 'quizzes', quizId, 'questions')
        )
        const qs: any[] = []
        qsSnap.forEach((d: any) => qs.push(d.data()))
        setQuestions(qs)
        setAnswers(new Array(qs.length).fill(-1))
        setIdx(0)
      } catch (e) {
        console.error('failed to load existing quiz', e)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }
    loadExisting()
  }, [open, noteId, quizId, db])

  const current = questions && questions[idx]

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
                <DialogTitle>{loading ? 'Creating Quiz…' : 'Quiz'}</DialogTitle>
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

        {loading ? (
          <div className='flex items-center gap-3 py-6'>
            <IconLoader2 className='size-5 animate-spin' />
            <div className='text-sm text-muted-foreground'>{phrases[phraseIdx]}…</div>
          </div>
        ) : !current ? (
          <div className='text-sm text-muted-foreground'>Something went wrong. Try again.</div>
        ) : (
          <div className='space-y-4'>
            <div className='font-medium text-lg flex gap-2 items-start'>
              <span>{idx + 1}.</span>
              <div className='flex-1'>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{ p: (props: any) => <span {...props} /> }}
                >
                  {fixLatexEscapes(current.q)}
                </ReactMarkdown>
              </div>
            </div>
            <div className='grid gap-2 my-12'>
              {current.options?.map((opt: string, i: number) => {
                const selected = answers[idx]
                const answered = selected !== -1
                const isCorrect = i === current.correct
                const isSelected = i === selected
                const variant = !answered ? 'outline' : isCorrect ? 'correct' : isSelected ? 'incorrect' : 'outline'
                return (
                  <Button size="options" key={i} variant={variant as any} onClick={() => {
                    if (answers[idx] !== -1) return
                    setAnswers((a) => { const n = a.slice(); n[idx] = i; return n })
                  }}>
                    <div className='w-full '>
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{ p: (props: any) => <span {...props} /> }}
                      >
                        {opt}
                      </ReactMarkdown>
                    </div>
                  </Button>
                )
              })}
            </div>
            <div className='flex justify-between'>
              <Button variant='outline' onClick={() => setIdx((v) => Math.max(0, v - 1))} disabled={idx === 0}>Previous</Button>
              {idx >= (questions?.length || 1) - 1 ? (
                <DialogClose asChild>
                  <Button>Finish</Button>
                </DialogClose>
              ) : (
                <Button onClick={() => setIdx((v) => Math.min((questions?.length || 1) - 1, v + 1))}>Next</Button>
              )}
            </div>
          </div>
        )}

        
      </DialogContent>
    </Dialog>
  )
}
