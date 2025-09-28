"use client"

import * as React from "react"

type NoteSidebarContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  width: number
  setWidth: (width: number) => void
  minWidth: number
  maxWidth: number
}

const NoteSidebarContext = React.createContext<NoteSidebarContextValue | null>(null)

export function useNoteSidebar() {
  const ctx = React.useContext(NoteSidebarContext)
  if (!ctx) {
    throw new Error("useNoteSidebar must be used within a NoteProvider")
  }
  return ctx
}

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const toggle = React.useCallback(() => setOpen((v) => !v), [])
  const defaultWidth = 400
  const minWidth = defaultWidth
  const maxWidth = defaultWidth
  const [width] = React.useState<number>(defaultWidth)
  const setWidth = React.useCallback((_value: number | ((w: number) => number)) => {
    // fixed width; no-op
    return
  }, [])

  const value = React.useMemo(
    () => ({ open, setOpen, toggle, width, setWidth, minWidth, maxWidth }),
    [open, width, setWidth, minWidth, maxWidth]
  )

  return (
    <NoteSidebarContext.Provider value={value}>{children}</NoteSidebarContext.Provider>
  )
}


