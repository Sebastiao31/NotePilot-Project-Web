"use client"

import { Button } from "@/components/ui/button"
import { useNoteSidebar } from "./note-provider"
import { IconNotes } from "@tabler/icons-react"

export default function NoteTrigger() {
  const { toggle } = useNoteSidebar()

  return (
    <Button onClick={toggle} variant="ghost" className="gap-2">
      <IconNotes className="size-5" />
      <span className="text-md font-semibold">Notes</span>
    </Button>
  )
}




