// I am adding a GoogleAuthBtn that signs in with Google and upserts a user.
"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { IconBrandGoogle } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { getFirebase, serverTimestamp } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const GoogleAuthBtn = () => {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleSignIn = async () => {
    if (loading) return
    setLoading(true)
    try {
      const { auth, db, googleProvider } = getFirebase()
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      if (!user?.uid) throw new Error('No user returned from Google sign-in')

      const userRef = doc(db, 'users', user.uid)
      const snap = await getDoc(userRef)

      const baseData = {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        provider: 'google',
        updatedAt: serverTimestamp(),
      }

      if (!snap.exists()) {
        await setDoc(userRef, {
          ...baseData,
          createdAt: serverTimestamp(),
          roles: ['user'],
          completedOnboarding: false,
        })
      } else {
        await setDoc(userRef, baseData, { merge: true })
      }

      router.push('/notes')
    } catch (error) {
      console.error('Google sign-in error', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSignIn} disabled={loading} className="h-10">
      <IconBrandGoogle className="!size-5 mr-2" />
      {loading ? 'Signing in…' : 'Continue with Google'}
    </Button>
  )
}

export default GoogleAuthBtn
