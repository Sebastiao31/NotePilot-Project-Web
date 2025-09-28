"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useNoteSidebar } from "./note-provider"
import { useSidebar } from "@/components/ui/sidebar"
import { useNotes } from "@/hooks/use-notes"
import { IconDotsVertical, IconFolder, IconChevronsLeft } from "@tabler/icons-react"
import { Button } from "./ui/button"

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
          
          <h2 className="text-foreground text-base font-semibold">Notes</h2>
          <Button variant="ghost" size="icon" onClick={toggle}>
            <IconChevronsLeft className="size-5 text-accent-foreground/60" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {(notes || []).map((n) => (
            <div key={n.id} className="rounded-md px-3 py-2 hover:bg-sidebar cursor-pointer flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="truncate text-[15px] font-medium">{n.title || 'Untitled note'}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <IconFolder className="!size-3 text-red-500" />
                    <span className="leading-none">{n.folder || 'No Folder'}</span>
                  </span>
                </div>
              </div>
              <div className="shrink-0">
                <Button variant="ghost" size="icon">
                  <IconDotsVertical className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


