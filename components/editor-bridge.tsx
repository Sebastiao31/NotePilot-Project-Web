"use client"

import * as React from "react"
import type { Editor } from "@tiptap/core"

type EditorBridgeContextValue = {
  editor: Editor | null
  setEditor: (editor: Editor | null) => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void
  lastSavedAt: number | null
  setLastSavedAt: (ts: number | null) => void
}

const EditorBridgeContext = React.createContext<EditorBridgeContextValue | null>(null)

export function useEditorBridge() {
  const ctx = React.useContext(EditorBridgeContext)
  if (!ctx) {
    throw new Error("useEditorBridge must be used within an EditorBridgeProvider")
  }
  return ctx
}

export function EditorBridgeProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = React.useState<Editor | null>(null)
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null)
  const value = React.useMemo(() => ({ editor, setEditor, saveStatus, setSaveStatus, lastSavedAt, setLastSavedAt }), [editor, saveStatus, lastSavedAt])
  return <EditorBridgeContext.Provider value={value}>{children}</EditorBridgeContext.Provider>
}



