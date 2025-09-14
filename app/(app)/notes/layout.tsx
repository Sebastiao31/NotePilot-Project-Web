import React from 'react'
import { SiteHeader } from '@/components/site-header'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='p-8 bg-background-primary h-full'>
        {children}
        
    </div>
  )
}

export default layout