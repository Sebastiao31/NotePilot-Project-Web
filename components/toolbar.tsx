"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useEditMode } from "@/components/edit-mode-provider"
import { useEditorBridge } from "@/components/editor-bridge"
import Texts from "./textTools/texts"
import Lists from "./textTools/lists"
import Codeblock from "./textTools/codeblock"

export default function Toolbar() {
  const pathname = usePathname()
  const isNoteDetail = !!pathname && /^\/notes\/[^/]+\/?$/.test(pathname)
  const { editModeEnabled } = useEditMode()
  const visible = isNoteDetail && editModeEnabled
  const { editor } = useEditorBridge()
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  React.useEffect(() => {
    if (!editor) return
    const handler = () => forceUpdate()
    editor.on('transaction', handler)
    editor.on('update', handler)
    editor.on('selectionUpdate', handler)
    return () => {
      editor.off('transaction', handler)
      editor.off('update', handler)
      editor.off('selectionUpdate', handler)
    }
  }, [editor])

  const canUndo = !!editor?.can().undo?.()
  const canRedo = !!editor?.can().redo?.()

  return (
    <footer
      aria-hidden={!visible}
      className={
        "bg-background-primary sticky bottom-0 z-40 flex h-16 shrink-0 items-center gap-2 border-t " +
        "transition-transform duration-300 ease-in-out " +
        (visible ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none")
      }
    >
      <div className="flex w-full items-center gap-2 px-4 lg:gap-2 lg:px-6">
        <p className="text-sm font-medium text-primary">Edit tools</p>
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
        <div className="ml-auto flex items-center gap-2">
          <Texts />
          <Lists />
          <Codeblock />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Button size="sm" variant="outline" disabled={!canUndo} onClick={() => editor?.chain().focus().undo().run()}>Undo</Button>
          <Button size="sm" variant="outline" disabled={!canRedo} onClick={() => editor?.chain().focus().redo().run()}>Redo</Button>
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Button size="sm" variant="default">Save</Button>
        </div>
      </div>
    </footer>
  )
}


