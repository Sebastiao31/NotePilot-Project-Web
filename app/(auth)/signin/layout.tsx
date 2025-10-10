import React from 'react'
import NavBar from '@/components/landingPage/navBar/nav-bar'

const layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="bg-white">
            {children}
        </div>
    )
}

export default layout