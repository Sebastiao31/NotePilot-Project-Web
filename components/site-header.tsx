"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import CreateFolder from "./create-folder"
import ChatTrigger from "./chat-trigger"
import NoteTrigger from "./note-trigger"
import { usePathname } from "next/navigation"
import * as React from "react"
import { useChatSidebar } from "./chat-provider"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import TranscriptSheet from "./ui/transcript-sheet"

export function SiteHeader() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const showNoteActions = !!pathname && /^\/notes\/[^/]+\/?$/.test(pathname)
  const { setOpen } = useChatSidebar()

  // Ensure chat sidebar default state per route:
  // - Open by default on note detail pages
  // - Closed on other pages (e.g., notes list)
  React.useEffect(() => {
    setOpen(showNoteActions)
  }, [showNoteActions, setOpen])
  
  return (
    <header className="bg-background-primary sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1 " />
          <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
          
        
        <h1 className="text-md font-semibold text-primary">Note</h1>



        {showNoteActions && (
          <div className="items-end ml-auto flex gap-2">
            <div>
              

              <Sheet>
                <SheetTrigger>
                  <Button variant="ghost">
                    Transcript
                  </Button>
                </SheetTrigger>
                  <TranscriptSheet />
            </Sheet>
            </div>
            <div>
              <Button variant="ghost">
                Share/Export
              </Button>
            </div>
            
            <div>
              <ChatTrigger />
            </div>
          </div>
        )}
        
      </div>
    </header>
  )
}
