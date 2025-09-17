"use client"

import * as React from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import { useUserData } from './use-user-data'

export type Folder = {
  id: string
  name: string
  color: string
  userId: string
  createdAt?: any
}

export function useFolders() {
  const { authUser } = useUserData()
  const [folders, setFolders] = React.useState<Folder[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!authUser) {
      setFolders([])
      setLoading(false)
      return
    }

    const { db } = getFirebase()
    const q = query(
      collection(db, 'folders'),
      where('userId', '==', authUser.uid)
    )

    const unsub = onSnapshot(q, (snap) => {
      const items: Folder[] = []
      snap.forEach((doc) => {
        const data = doc.data() as any
        items.push({ id: doc.id, name: data.name, color: data.color, userId: data.userId, createdAt: data.createdAt })
      })
      // Sort client-side by createdAt desc if present; fallback to name
      items.sort((a, b) => {
        const aTs = a.createdAt?.toMillis?.() ?? 0
        const bTs = b.createdAt?.toMillis?.() ?? 0
        if (aTs !== bTs) return bTs - aTs
        return a.name.localeCompare(b.name)
      })
      setFolders(items)
      setLoading(false)
    })

    return () => unsub()
  }, [authUser])

  return { folders, loading }
}


