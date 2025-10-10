import React from 'react'

const FeaturesSection = () => {
    return (
        <section className='py-24'>
            <div >
                <div className='flex flex-col items-center justify-center gap-2'>
                    <span className="font-medium text-xl text-center text-muted-foreground">Features</span>
                    <h2 className="font-medium text-black text-center sm:max-w-[60%] sm:text-5xl md:max-w-[50%] md:text-5xl lg:max-w-[43%] lg:text-5xl xl:max-w-[43%] xl:text-6xl">
                        Everything you need in one place
                    </h2>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-4  px-4 pt-20">
                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="features/Feature_1.svg" alt="Feature 1" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black  sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
                                Create from any source
                            </h3>
                            <p className="text-muted-foreground">
                                Select your source NotePilot will transcribe it, and transform it into clean, structured notes you can edit and save.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="features/Feature_2.svg" alt="Feature 2" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black  sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
                                Talk to your notes
                            </h3>
                            <p className="text-muted-foreground">
                                The built-in AI chat understands your notes context and helps you go deeper.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="features/Feature_3.svg" alt="Feature 3" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black  sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
                                Interactive study tools
                            </h3>
                            <p className="text-muted-foreground">
                                Generate quizzes and flashcards automatically to test yourself and retain knowledge faster.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="features/Feature_4.svg" alt="Feature 4" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black  sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
                                Organize your workflow
                            </h3>
                            <p className="text-muted-foreground">
                                Maintain your workflow organized with folders, create and costumize them by topic, project or subject.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="features/Feature_5.svg" alt="Feature 5" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black  sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
                                Edit your notes
                            </h3>
                            <p className="text-muted-foreground">
                                Format text, add lists, tables, or math expressions with our built-in text editor..
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-[#EEEEEE] border-3 rounded-xl gap-6 flex flex-col">
                        <img src="features/Feature_6.svg" alt="Feature 6" className="w-full object-cover rounded-lg" />
                        <div className="gap-2 flex flex-col px-2">
                            <h3 className="font-medium text-black  sm:text-2xl md:text-xl lg:text-2xl xl:text-3xl">
                                Your notes, your privacy
                            </h3>
                            <p className="text-muted-foreground">
                                We prioritize your privacy, that’s why your notes are encrypted and belong only to you.
                            </p>
                        </div>
                    </div>



                    
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection