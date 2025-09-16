"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"

export function ChatInset({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, width } = useChatSidebar()
  return (
    <div className={cn("relative flex flex-col", className)} style={{ paddingRight: open ? width : undefined }}>
      {children}
    </div>
  )
}


