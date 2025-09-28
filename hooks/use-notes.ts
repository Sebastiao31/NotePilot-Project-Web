"use client"

import React from 'react'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import { useUserData } from './use-user-data'

export type NoteDoc = {
  id: string
  userId: string
  title: string
  note: string
  overview?: string
  transcript: string
  date: any
  folder: string | null
  satisfied: boolean | null
  type: 'Text'
  status?: 'generating' | 'ready' | 'error'
}

export function useNotes() {
  const { authUser } = useUserData()
  const [notes, setNotes] = React.useState<NoteDoc[] | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!authUser) {
      setNotes([])
      setLoading(false)
      return
    }

    const { db } = getFirebase()
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', authUser.uid)
    )

    const unsub = onSnapshot(q, (snap) => {
      const items: NoteDoc[] = []
      snap.forEach((doc) => {
        const data = doc.data() as any
        items.push({
          id: doc.id,
          userId: data.userId,
          title: data.title ?? '',
          note: data.note ?? '',
          overview: data.overview ?? '',
          transcript: data.transcript ?? '',
          date: data.date,
          folder: data.folder ?? null,
          satisfied: !!data.satisfied,
          type: 'Text',
          status: data.status ?? 'ready',
        })
      })
      // Sort by date desc client-side to avoid requiring composite index
      items.sort((a, b) => {
        const aTs = a.date?.toMillis?.() ?? 0
        const bTs = b.date?.toMillis?.() ?? 0
        return bTs - aTs
      })
      setNotes(items)
      setLoading(false)
    })

    return () => unsub()
  }, [authUser])

  return { notes, loading }
}


