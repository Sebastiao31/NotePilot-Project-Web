import React from 'react'
import CtaBtn from './cta-btn'

const HIWSection = () => {
    return (
    <section className='py-24'>
            <div >
                <div className='flex flex-col items-center justify-center gap-2'>
                    <span className="font-medium text-xl text-center text-muted-foreground">How it works</span>
                    <h2 className="font-medium text-black text-center sm:max-w-[80%] sm:text-5xl md:max-w-[80%] md:text-5xl lg:max-w-[60%] lg:text-5xl xl:max-w-[60%] xl:text-6xl">
                        We like to keep it simple. Transcribe, summarize, learn.
                    </h2>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-1 max-md:place-items-center max-md:px-8  gap-4  px-4 pt-20">
                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="HIW/HIW_1.svg" alt="Hiw 1" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black text-center  sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl">
                                Transcribe
                            </h3>
                            <p className="text-muted-foreground text-center">
                                Record or upload. NotePilot will trancribe the content of the choosen source.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="HIW/HIW_2.svg" alt="Hiw 2" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black text-center  sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl">
                                Summarize
                            </h3>
                            <p className="text-muted-foreground text-center">
                            Our AI condenses content into clear, readable summary in seconds.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="HIW/HIW_3.svg" alt="Hiw 3" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black text-center  sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl">
                                Learn
                            </h3>
                            <p className="text-muted-foreground text-center">
                                Review, study, practice, chat with your notes and actually learn faster.
                            </p>
                        </div>
                    </div>

                </div>

                <div className='flex items-center justify-center pt-20'>
                    <CtaBtn/>
                </div>
            </div>
        </section>
    )
}

export default HIWSection