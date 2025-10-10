import React from 'react'

const Footer = () => {
    return (

    <footer className='flex items-center justify-between p-4 max-w-[1440px] bg-white mx-auto sticky top-0 z-50'>
        <div className='flex items-center gap-3'>
            <a
                href="/"
                className='flex items-center gap-2'
            >
                <img src="/Logo-Light.svg" alt="logo" width={25} height={25}/>
                <span className="text-3xl font-bold text-black">NotePilot</span>
            </a>
        </div>

        <div className='flex items-center gap-4 text-lg font-medium'>
            <a href="/" className='p-2 rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>Privacy Policy</a>
            <a href="/" className='p-2 rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>Terms of Service</a>
        </div>

        <div className='flex items-center gap-4'>
            <a href="/">
                <img src="socials/Instagram.svg" alt="Instagram" className='w-8 h-8 grayscale' />
            </a>
            <a href="/">
                <img src="socials/Facebook.svg" alt="Facebook" className='w-8 h-8 grayscale' />
            </a>
            <a href="/">
                <img src="socials/Reddit.svg" alt="Reddit" className='w-8 h-8 grayscale' />
            </a>


        </div>
    </footer>
    )
}

export default Footer