"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import OnboardingButton from '@/components/ui/onboarding-button'
import Image from 'next/image'
import "flag-icons/css/flag-icons.min.css";
import { getFirebase, serverTimestamp } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useUserData } from '@/hooks/use-user-data'
import { useRouter } from 'next/navigation'


type AnswerMap = {
  heardAbout?: string
  language?: string
  primaryUse?: string
}

const steps = [
  {
    key: 'heardAbout' as const,
    question: 'How did you hear about NotePilot?',
    subtitle: 'Help us understand how you discovered NotePilot',
    options: [
      'TikTok',
      'YouTube',
      'Instagram',
      'Facebook',
      'Google Search',
      'Friends & Family',
      'Reddit',
      'Other',
    ],
  },
  {
    key: 'language' as const,
    question: "What's your preferres language?",
    subtitle: 'We\'ll optimize AI features for your preferred language',
    options: [
      'Auto-Detect',
      'English',
      'Spanish',
      'French',
      'German',
      'Italian',
      'Portuguese',
    ],
  },
  {
    key: 'primaryUse' as const,
    question: "What'll you primarily use NotePilot for?",
    subtitle: 'This helps us customize your experience',
    options: [
      'Study Notes',
      'Meeting Notes',
      'Research & Analysis',
      'Personal Journal',
      'Lecture recording',
      'Podcast/Audio Notes',
    ],
  },
]

const OnboardingPage = () => {
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<AnswerMap>({})
  const [saving, setSaving] = React.useState(false)
  const { authUser, userDoc, loading } = useUserData()
  const router = useRouter()

  const current = steps[step]
  const value = answers[current.key]

  const canNext = Boolean(value)
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  const select = (label: string) => {
    setAnswers((prev) => ({ ...prev, [current.key]: label }))
  }

  const onNext = async () => {
    if (!canNext) return
    if (isLast) {
      try {
        setSaving(true)
        const { auth, db } = getFirebase()
        const uid = auth.currentUser?.uid
        if (!uid) {
          console.warn('No authenticated user; cannot save onboarding')
          setSaving(false)
          return
        }
        const userRef = doc(db, 'users', uid)
        await setDoc(
          userRef,
          {
            onboarding: {
              heardAbout: answers.heardAbout ?? null,
              language: answers.language ?? null,
              primaryUse: answers.primaryUse ?? null,
              completedAt: serverTimestamp(),
            },
            completedOnboarding: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
      } catch (e) {
        console.error('Failed to save onboarding:', e)
      } finally {
        setSaving(false)
      }
      return
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  const onBack = () => {
    setStep((s) => Math.max(s - 1, 0))
  }

  React.useEffect(() => {
    if (loading) return
    if (authUser && userDoc?.completedOnboarding) {
      router.replace('/notes')
    }
  }, [authUser, userDoc?.completedOnboarding, loading, router])

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 ">
          <h1 className="text-3xl font-semibold">{current.question}</h1>
          <p className="text-muted-foreground ">{current.subtitle}</p>
        </div>

        <div role="radiogroup" className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {current.options.map((opt) => (
            <OnboardingButton
              key={opt}
              label={opt}
              selected={value === opt}
              onSelect={select}
              icon={getIcon(current.key, opt)}
            />
          ))}
        </div>

        <div className="relative mt-8 h-10">
          <div className="absolute left-0 top-0">
            {isFirst ? (
              <Button variant="outline" className="invisible pointer-events-none">Back</Button>
            ) : (
              <Button variant="outline" onClick={onBack}>Back</Button>
            )}
          </div>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className={
                  'size-2 rounded-full transition-colors ' +
                  (i === step ? 'bg-primary' : 'bg-muted-foreground/30')
                }
              />
            ))}
          </div>
          <div className="absolute right-0 top-0">
            <Button onClick={onNext} disabled={!canNext || saving}>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage

function getIcon(key: keyof AnswerMap, option: string): React.ReactNode {
  if (key === 'heardAbout') {
    switch (option) {
      case 'TikTok':
        return (
          <Image src="/socials/tiktok.svg" alt="TikTok" width={40} height={40} />
        )
      case 'YouTube':
        return (
          <Image src="/socials/youtube.svg" alt="YouTube" width={40} height={40}  />
        )
      case 'Instagram':
        return (
          <Image src="/socials/instagram.svg" alt="Instagram" width={40} height={40} />
        )
      case 'Facebook':
        return (
          <Image src="/socials/facebook.svg" alt="Facebook" width={40} height={40} />
        )
      case 'Google Search':
        return (
          <Image src="/socials/google.svg" alt="Google" width={40} height={40} />
        )
      case 'Reddit':
        return (
          <Image src="/socials/reddit.svg" alt="Reddit" width={40} height={40} />
        )
      case 'Friends & Family':
        return <span className="text-xl">👫</span>
      case 'Other':
        return <span className="text-xl">👀</span>
    }
  }
  if (key === 'language') {
    switch (option) {
      case 'Auto-Detect':
        return <span className="text-xl">🌐</span>
      case 'English':
        return <span className="fi fi-us" />;
      case 'Spanish':
        return <span className="text-xl fi fi-es"></span>
      case 'French':
        return <span className="text-xl fi fi-fr"></span>
      case 'German':
        return <span className="text-xl fi fi-de"></span>
      case 'Italian':
        return <span className="text-xl fi fi-it"></span>
      case 'Portuguese':
        return <span className="text-xl fi fi-br"></span>
    }
  }
  if (key === 'primaryUse') {
    switch (option) {
      case 'Study Notes':
        return <span className="text-xl">📚</span>
      case 'Meeting Notes':
        return <span className="text-xl">🏢</span>
      case 'Research & Analysis':
        return <span className="text-xl">🔎</span>
      case 'Personal Journal':
        return <span className="text-xl">📔</span>
      case 'Lecture recording':
        return <span className="text-xl">🎓</span>
      case 'Podcast/Audio Notes':
        return <span className="text-xl">🎧</span>
    }
  }
  return null
}