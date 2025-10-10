import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

const FAQSection = () => {
    return (
        <section className='py-24'>
        <div >
            <div className='flex flex-col items-center justify-center gap-2'>
                <span className="font-medium text-xl text-center text-muted-foreground">Support</span>
                <h2 className="font-medium text-black text-center sm:max-w-[80%] sm:text-5xl md:max-w-[80%] md:text-5xl lg:max-w-[60%] lg:text-5xl xl:max-w-[60%] xl:text-6xl">
                    Frequently asked questions
                </h2>
            </div>

            <div className='pt-20 px-8'>
            <Accordion type="single"
            collapsible
            className="w-full"
            defaultValue="item-1">

                <AccordionItem value="item-1">
                    <AccordionTrigger>What is NotePilot?</AccordionTrigger>
                    <AccordionContent>
                    NotePilot is an AI summary generator that creates concise, editable notes from YouTube videos, websites, PDFs, audio recordings, pasted text, and futurally more sources.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Can I edit the generated summaries?</AccordionTrigger>
                    <AccordionContent>
                    Absolutely. Every summary is editable, your free to amke the changes that you want, add lists, tables, math expressions, etc.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>How accurate are the summaries?</AccordionTrigger>
                    <AccordionContent>
                    NotePilot uses latest AI models in the world that understand context and structure. Summaries are highly accurate and optimized for clarity. We constantly test and evaluate new models to ensure highest quality generations.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger>Is my notes private?</AccordionTrigger>
                    <AccordionContent>
                    100%. Your are the only one who can access your notes.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                    <AccordionTrigger>Is NotePilot ok to use at my school?</AccordionTrigger>
                    <AccordionContent>
                    Yes. NotePilot IS NOT a cheating tool, it's a tool to help you learn, capture key details and practice what you've learned.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                    <AccordionTrigger>Does it work on mobile?</AccordionTrigger>
                    <AccordionContent>
                    Yes, you can use NotePilot on mobile, but we suggest desktop for the best expreience. Launching mobile app very soon!
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            </div>
            

            
        </div>
    </section>
    )
}

export default FAQSection