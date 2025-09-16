import React from 'react'
import GoogleAuthBtn from '@/components/google-auth-btn'

const SignIn = () => {
  return (
    <main className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col items-center justify-center gap-2'>
            <h1 className='text-2xl font-bold'>NotePilot</h1>
            <p className='text-sm text-muted-foreground'>Your AI-powered note-taking assistant</p>
        </div>

        <div className='mt-4'>
            <GoogleAuthBtn />
        </div>
    </main>
  )
}

export default SignIn