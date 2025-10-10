import React, { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import Loading from './loading'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='p-8 bg-background-primary h-full'>
        {children}
    </div>
  )
}

export default layout