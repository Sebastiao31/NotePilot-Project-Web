"use client"

import { Button } from "@/components/ui/button"
import { useChatSidebar } from "./chat-provider"
import { IconSparkles } from "@tabler/icons-react"

export default function ChatTrigger() {
  const { toggle } = useChatSidebar()

  return (
    <Button  onClick={toggle} className="gap-2">
      <IconSparkles className="size-6" />
      <span className="text-md font-semibold">NotePilot AI</span>
    </Button>
  )
}


