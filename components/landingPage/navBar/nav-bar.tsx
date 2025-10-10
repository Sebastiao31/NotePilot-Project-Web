import React from 'react'
import Image from 'next/image'
import NavLinks from './nav-links'
import NavBtn from './nav-btn'

const NavBar = () => {
    return (
        <main className='flex items-center justify-between p-4 max-w-[1440px] bg-white mx-auto sticky top-0 z-50'>
            <div className='flex items-center gap-3'>
                <a
                    href="/"
                    className='flex items-center gap-2'
                >
                    <Image src="/Logo-Light.svg" alt="logo" width={25} height={25} />
                    <span className="text-3xl font-bold text-black">NotePilot</span>
                </a>
            </div>

            <div>
                <NavLinks />
            </div>

            <div>
                <NavBtn />
            </div>
        </main>
    )
}

export default NavBar