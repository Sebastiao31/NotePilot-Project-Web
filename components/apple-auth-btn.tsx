import React from 'react'

const AppleAuthBtn = () => {
  return (
    <button className='flex items-center justify-center p-4 gap-2 border-[#EEEEEE] border-2 w-full rounded-lg hover:bg-[#EEEEEE] transition-all duration-300 hover:cursor-pointer'>
        <img src="socials/apple.svg" alt="apple" className='w-6 h-6' />
        <span className='text-xl font-semibold text-black'>Sign in with Apple</span>

      </button>
  )
}

export default AppleAuthBtn