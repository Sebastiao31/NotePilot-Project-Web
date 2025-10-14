"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import CreateFolder from "./create-folder"
import ChatTrigger from "./chat-trigger"
import NoteTrigger from "./note-trigger"
import { usePathname, useParams } from "next/navigation"
import * as React from "react"
import { useChatSidebar } from "./chat-provider"
import { useNotes } from "@/hooks/use-notes"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import TranscriptSheet from "./ui/transcript-sheet"
import Export from "./ui/export"
import EditModeToogle from "./ui/edit-mode-toogle"

export function SiteHeader() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const showNoteActions = !!pathname && /^\/notes\/[^/]+\/?$/.test(pathname)
  const { setOpen } = useChatSidebar()
  const params = useParams() as any
  const noteRouteId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const { notes } = useNotes()
  const activeNoteTitle = React.useMemo(() => {
    if (!showNoteActions) return "Note"
    if (!noteRouteId) return "Note"
    const found = notes?.find((n) => n.id === noteRouteId)
    return found?.title?.trim() || "Note"
  }, [showNoteActions, noteRouteId, notes])

  // Ensure chat sidebar default state per route:
  // - Open by default on note detail pages
  // - Closed on other pages (e.g., notes list)
  React.useEffect(() => {
    setOpen(showNoteActions)
  }, [showNoteActions, setOpen])
  
  return (
    <header className="bg-background-primary py-3 sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1 " />
          
        
          
       



        {showNoteActions && (
          <div className="items-center ml-auto flex gap-2 shrink-0">
            <div >
              <EditModeToogle />
            </div>

            <Separator
          orientation="vertical"
          className=" data-[orientation=vertical]:h-6"
        />
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
              <Export />
            </div>
            
            
          </div>
        )}
        
      </div>
    </header>
  )
}
