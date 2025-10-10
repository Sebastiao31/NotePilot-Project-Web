import React from 'react'
import CtaBtn from './cta-btn'

const CTASection = () => {
    return (
        <section className='py-24'>
        <div className="bg-gradient-to-r from-[#76F28B] via-[#5CBCB0] to-[#6E8DF2] rounded-4xl p-12">
            <div className='flex flex-col items-center justify-center gap-2'>
                <h2 className="font-medium text-white text-center sm:max-w-[80%] sm:text-5xl md:max-w-[80%] md:text-5xl lg:max-w-[60%] lg:text-5xl xl:max-w-[70%] xl:text-6xl">
                    Stop wasting hours, let NotePilot do it for you in seconds
                </h2>
            </div>
            

            <div className='flex items-center justify-center pt-20'>
                <CtaBtn/>
            </div>
        </div>
    </section>
    )
}

export default CTASection