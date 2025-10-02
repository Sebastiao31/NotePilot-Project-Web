"use client"

import * as React from "react"

type EditModeContextValue = {
  editModeEnabled: boolean
  setEditModeEnabled: (value: boolean) => void
  toggleEditMode: () => void
}

const EditModeContext = React.createContext<EditModeContextValue | null>(null)

export function useEditMode() {
  const ctx = React.useContext(EditModeContext)
  if (!ctx) {
    throw new Error("useEditMode must be used within an EditModeProvider")
  }
  return ctx
}

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [editModeEnabled, setEditModeEnabled] = React.useState<boolean>(false)

  React.useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("editModeEnabled") : null
      if (stored != null) {
        setEditModeEnabled(stored === "true")
      }
    } catch {}
  }, [])

  const setAndPersist = React.useCallback((value: boolean) => {
    setEditModeEnabled(value)
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("editModeEnabled", String(value))
      }
    } catch {}
  }, [])

  const toggleEditMode = React.useCallback(() => setAndPersist(!editModeEnabled), [editModeEnabled, setAndPersist])

  const value = React.useMemo(() => ({ editModeEnabled, setEditModeEnabled: setAndPersist, toggleEditMode }), [editModeEnabled, setAndPersist, toggleEditMode])

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}


