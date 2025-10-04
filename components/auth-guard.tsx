// I am adding a client-side auth guard that redirects unauthenticated users to /signin.
"use client"

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUserData } from '@/hooks/use-user-data'

type Props = {
  children: React.ReactNode
}

export default function AuthGuard({ children }: Props) {
  const { authUser, userDoc, loading } = useUserData()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (loading) return
    if (!authUser) {
      router.replace('/signin')
      return
    }
    // If authenticated but onboarding not completed, redirect to onboarding flow
    if (!userDoc?.completedOnboarding) {
      if (pathname !== '/onboarding') {
        router.replace('/onboarding')
      }
    }
  }, [authUser, userDoc?.completedOnboarding, loading, router, pathname])

  if (loading) {
    return null
  }

  if (!authUser) return null
  if (!userDoc?.completedOnboarding && pathname !== '/onboarding') return null

  return <>{children}</>
}


