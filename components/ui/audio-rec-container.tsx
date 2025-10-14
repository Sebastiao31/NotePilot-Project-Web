"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconGripVertical, IconPlayerStop, IconX } from "@tabler/icons-react"
import { DragAudioContainer } from "@/components/ui/drag-audio-container"

type AudioRecordContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const AudioRecordContext = React.createContext<AudioRecordContextValue | null>(null)

export function useAudioRecord() {
  const ctx = React.useContext(AudioRecordContext)
  if (!ctx) throw new Error("useAudioRecord must be used within AudioRecordProvider")
  return ctx
}

export function AudioRecordProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  // Persist across reloads for convenience (optional)
  React.useEffect(() => {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem("audio_rec_open") : null
    if (raw === "true") setOpen(true)
  }, [])
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("audio_rec_open", open ? "true" : "false")
    }
  }, [open])

  const value = React.useMemo(() => ({ open, setOpen }), [open])

  return (
    <AudioRecordContext.Provider value={value}>
      {children}
      <AudioRecContainer />
    </AudioRecordContext.Provider>
  )
}

export function AudioRecContainer({ className }: { className?: string }) {
  const { open, setOpen } = useAudioRecord()

  if (!open) return null

  return (
    <DragAudioContainer
      className={cn(
        "w-[360px] max-w-[85vw] rounded-xl border bg-background p-3 shadow-xl",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <IconGripVertical className="size-4 text-muted-foreground" data-drag-handle="true" />
        <div className="text-sm font-medium select-none" data-drag-handle="true">Audio Recorder</div>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)} aria-label="Close">
          <IconX className="size-4" />
        </Button>
      </div>
      <div className="mt-3">
        {/* Placeholder area for your actual recorder UI */}
        <div className="rounded-md border p-3 text-sm text-muted-foreground">
          Recording UI goes here. Hook up your mic logic next.
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button size="sm" variant="default">
          <IconPlayerStop className="size-4 mr-2" />
          Stop & Save
        </Button>
      </div>
    </DragAudioContainer>
  )
}


