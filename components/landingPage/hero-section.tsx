import React from 'react'
import CtaBtn from './cta-btn'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { IconCircleCheckFilled } from '@tabler/icons-react';

const HeroSection = () => {
    return (
        <section className="py-24 ">
            <div className="gap-16 flex flex-col items-center">
                <div className="w-full mx-auto flex flex-col items-center justify-center h-fit gap-8 ">
                    <div className="flex items-center gap-2 border border-3 border-[#E5E5E5] rounded-full p-1.5">
                        <img src="/Check.svg" alt="Logo" className="w-8" />
                        <span className="pr-2 text-lg font-semibold text-muted-foreground">
                            Perfect for ADHD
                        </span>
                    </div>
                    <h1 className="font-medium text-black text-center sm:max-w-[80%] sm:text-5xl md:max-w-[60%] md:text-5xl lg:max-w-[50%] lg:text-6xl xl:max-w-[50%] xl:text-7xl">
                        Be more present, we handle the notes.
                    </h1>

                    <p className="font-medium text-center text-lg lg:text-xl leading-7 text-[#737373]">
                        Meet your new study partner. NotePilot turns long content<br />into clear concise notes you can edit and explore with AI.
                    </p>

                </div>

                <div className="w-full flex items-center justify-center">
                    <CtaBtn />
                </div>

                <div className="flex items-center justify-center gap-4">
                    <div className="*:data-[slot=avatar]:ring-white flex -space-x-2 *:data-[slot=avatar]:ring-2">
                        <Avatar>
                            <AvatarImage src="/Avatar-1.jpg" alt="Avatar 1" />
                        
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="/Avatar-2.jpg" alt="Avatar 2" />
                        </Avatar>
                        <Avatar>
                            <AvatarImage src="/Avatar-3.jpg" alt="Avatar 3" />
                        </Avatar>
                    </div>
                    <span className="font-medium text-center text-md lg:text-md leading-7 text-muted-foreground">
                        +100K Students love NotePilot
                    </span>
                </div>

                <div className="px-2">
                    <img src="/Hero-img.png" alt="Hero Section Image" className="w-full h-auto object-cover" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;