import React from 'react'

const NavLinks = () => {
    return (
        <main>
            <div className='flex items-center gap-4 text-lg font-medium'>
                <a href="/" className='p-2 rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>Features</a>
                <a href="/" className='p-2 rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>How it works</a>
                <a href="/" className='p-2 rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>FAQ</a>
            </div>
        </main>
    )
}

export default NavLinks