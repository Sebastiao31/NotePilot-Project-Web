import React from 'react'
import GoogleAuthBtn from '@/components/google-auth-btn'
import AppleAuthBtn from '@/components/apple-auth-btn'

const SignIn = () => {
  return (

            <div className="grid h-full min-h-svh xl:grid-cols-2 lg:grid-cols-1  gap-4 p-4">
                <div className="h-full flex flex-col justify-between bg-white">
                  <div className='flex items-center justify-start gap-3 max-md:justify-center'>
                    
                        <img src="/Logo-Light.svg" alt="logo" width={25} height={25} />
                        <span className="text-3xl font-bold text-black">NotePilot</span>
                  
                  </div>

                  <div className='flex flex-col items-center mb-24 justify-center w-fit mx-auto'>
                    <div className="mx-8 gap-2 flex flex-col">
                      <h1 className="font-semibold text-center text-3xl text-black">Welcome to NotePilot!</h1>
                      <p className="text-md text-muted-foreground text-center">Please enter your details to sign in your account</p>
                    </div>

                    <div className='mt-18 w-full'>
                      <GoogleAuthBtn />
                    </div>
                    <div className='mt-4 w-full'>
                      <AppleAuthBtn />
                    </div>
                  </div>

                  <div className="flex items-end justify-between ">
                    <footer >
                      <p className='text-md text-muted-foreground text-center'>© 2025 NotePilot</p>
                    </footer>
                    <div className='flex items-center gap-4'>
                      <a href="/privacy-policy">
                        <span className='p-2 text-muted-foreground rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>Privacy Policy</span>
                      </a>
                      <a href="/terms-of-service">
                        <span className='p-2 text-muted-foreground rounded-md hover:bg-[#EEEEEE] transition-all duration-300 text-black'>Terms of Service</span>
                      </a>
                    </div>
                  </div>

                </div>

                <div className="h-full max-xl:hidden pl-48 pt-24 pb-24 bg-gradient-to-r from-[#76F28B] via-[#5CBCB0] to-[#6E8DF2] rounded-xl gap-6 flex flex-col justify-center overflow-hidden">
                    <div className="pt-2 pl-2 pb-2 rounded-tl-xl rounded-bl-xl  bg-gradient-to-r from-[#BBFBC6] via-[#ADE0D5] to-[#A6BBF5] hover:scale-105 transition-all duration-300">
                    <img src="Testimonials-img.png" alt="Testimonials-img" className="w-full rounded-tl-lg rounded-bl-lg object-contain" />
                    </div>
                </div>
                

                

            </div>















  )

      {/* 
        <div className='flex flex-col items-center justify-center gap-2'>
            <h1 className='text-2xl font-bold'>NotePilot</h1>
            <p className='text-sm text-muted-foreground'>Your AI-powered note-taking assistant</p>
        </div>

        <div className='mt-4'>
            <GoogleAuthBtn />
        </div>
        */}
  
}

export default SignIn