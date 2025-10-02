"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEditMode } from "@/components/edit-mode-provider"

export default function Toolbar() {
  const pathname = usePathname()
  const isNoteDetail = !!pathname && /^\/notes\/[^/]+\/?$/.test(pathname)
  const { editModeEnabled } = useEditMode()
  const visible = isNoteDetail && editModeEnabled

  return (
    <footer
      aria-hidden={!visible}
      className={
        "bg-background-primary sticky bottom-0 z-40 flex h-16 shrink-0 items-center gap-2 border-t " +
        "transition-transform duration-300 ease-in-out " +
        (visible ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none")
      }
    >
      <div className="flex w-full items-center gap-2 px-4 lg:gap-2 lg:px-6">
        <p className="text-sm font-medium text-primary">Edit tools</p>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline">Undo</Button>
          <Button size="sm" variant="outline">Redo</Button>
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Button size="sm" variant="default">Save</Button>
        </div>
      </div>
    </footer>
  )
}


