// I am adding an onboarding guard that only allows authenticated users.
"use client"

import * as React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUserData } from '@/hooks/use-user-data'

type Props = {
  children: React.ReactNode
}

export default function OnboardingGuard({ children }: Props) {
  const { authUser, loading } = useUserData()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (loading) return
    if (!authUser) {
      router.replace('/signin')
    }
  }, [authUser, loading, router, pathname])

  if (loading) {
    return null
  }

  if (!authUser) return null

  return <>{children}</>
}


