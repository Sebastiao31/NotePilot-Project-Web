import React from 'react'
import OnboardingGuard from '@/components/onboarding-guard'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <OnboardingGuard>
      <div>
          {children}
      </div>
    </OnboardingGuard>
  )
}

export default layout