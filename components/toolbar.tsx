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
import Blockquote from "./textTools/blockquote"
import Bold from "./textTools/bold"
import Italic from "./textTools/italic"

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
      <div className="flex w-full justify-center  items-center gap-2 px-4 lg:gap-2 lg:px-6">
       
        <div className="flex items-center gap-2">
          
          <Texts />
          <Lists />
          <Codeblock />
          <Blockquote />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Bold />
          <Italic />
          
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
        </div>
      </div>
    </footer>
  )
}


