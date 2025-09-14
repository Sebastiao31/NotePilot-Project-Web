"use client"

import { Button } from "@/components/ui/button"
import { useChatSidebar } from "./chat-provider"
import { IconSparkles } from "@tabler/icons-react"

export default function ChatTrigger({ className }: { className?: string }) {
  const { toggle } = useChatSidebar()
  
  return (
    <Button variant="ghost" size="icon" className={className} onClick={toggle}>
      <IconSparkles className="size-5" />
      <span className="sr-only">Toggle Chat</span>
    </Button>
  )
}


