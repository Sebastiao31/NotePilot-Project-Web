"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNoteSidebar } from "./note-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { useNotes } from "@/hooks/use-notes"
import { IconDotsVertical, IconFolder, IconChevronsLeft } from "@tabler/icons-react"
import { Button } from "./ui/button"
import NoteFilter from "./note-filter"
import NotesList from "./ui/notes-list"
import SearchNote from "./search-note"

export function NoteSidebar() {
  const { open, width, toggle } = useNoteSidebar()
  const { state, isMobile } = useSidebar()
  const { notes } = useNotes()


  const transform = open ? "translateX(0)" : "translateX(-100%)"
  const leftOffset: string | number = isMobile ? 0 : (state === "expanded" ? "var(--sidebar-width)" : 0)

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-40 border-r bg-background-primary transition-[transform,left] duration-300 ease-in-out left-0"
      )}
      style={{ width, transform, pointerEvents: open ? "auto" : "none", left: leftOffset }}
      hidden={!open}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div className="px-5 py-4 flex items-center gap-4 justify-between">
          
          <NoteFilter />
          <Button variant="ghost" size="icon" onClick={toggle}>
            <IconChevronsLeft className="size-5 text-accent-foreground/60" />
          </Button>
        </div>

        <div className="px-4">
            <SearchNote />
        </div>
        <div className="flex-1 overflow-y-auto p-3 ">
          
          <div>
            <NotesList />
        </div>
        </div>

        
      </div>
    </div>
  )
}


