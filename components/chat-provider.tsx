"use client"

import * as React from "react"

type ChatSidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const ChatSidebarContext = React.createContext<ChatSidebarContextValue | null>(null)

export function useChatSidebar() {
  const ctx = React.useContext(ChatSidebarContext)
  if (!ctx) {
    throw new Error("useChatSidebar must be used within a ChatProvider")
  }
  return ctx
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((v) => !v), [])

  const value = React.useMemo(
    () => ({ open, setOpen, toggle }),
    [open]
  )

  return (
    <ChatSidebarContext.Provider value={value}>{children}</ChatSidebarContext.Provider>
  )
}


