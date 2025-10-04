// I am adding a React hook to subscribe to Firebase auth state and user doc.
"use client"

import * as React from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'

export type AppUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  roles?: string[]
  completedOnboarding?: boolean
} | null

type UseUserData = {
  authUser: FirebaseUser | null
  userDoc: AppUser
  loading: boolean
}

export function useUserData(): UseUserData {
  const [authUser, setAuthUser] = React.useState<FirebaseUser | null>(null)
  const [userDoc, setUserDoc] = React.useState<AppUser>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const { auth, db } = getFirebase()

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user)
      if (!user) {
        setUserDoc(null)
        setLoading(false)
        return
      }

      const ref = doc(db, 'users', user.uid)
      const unsubDoc = onSnapshot(ref, (snap) => {
        const data = snap.data() as DocumentData | undefined
        setUserDoc(
          data
            ? {
                uid: user.uid,
                email: data.email ?? user.email ?? null,
                displayName: data.displayName ?? user.displayName ?? null,
                photoURL: data.photoURL ?? user.photoURL ?? null,
                roles: data.roles ?? [],
                completedOnboarding: data.completedOnboarding ?? false,
              }
            : {
                uid: user.uid,
                email: user.email ?? null,
                displayName: user.displayName ?? null,
                photoURL: user.photoURL ?? null,
                roles: [],
                completedOnboarding: false,
              }
        )
        setLoading(false)
      })

      return () => unsubDoc()
    })

    return () => unsubAuth()
  }, [])

  return { authUser, userDoc, loading }
}


