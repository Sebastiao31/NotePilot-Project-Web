"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"

export function ChatInset({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open } = useChatSidebar()
  return (
    <div className={cn("relative flex flex-col", open && "pr-80 md:pr-96", className)}>
      {children}
    </div>
  )
}


