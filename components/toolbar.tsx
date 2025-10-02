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
import Strike from "./textTools/strike"
import Underline from "./textTools/underline"
import HorizontalRule from "./textTools/horizontal-rule"
import Background from "./textTools/background"

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
       
        <div className="flex items-center ">
          
          <Texts />
          <Lists />
          <Codeblock />
          <Blockquote />
          <HorizontalRule />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Bold />
          <Italic />
          <Strike />
          <Underline />
          <Background />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Button size="chat" variant="ghost" disabled={!canUndo} onClick={() => editor?.chain().focus().undo().run()} aria-label="Undo">
            {/* IconArrowBackUp */}
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-back-up size-5" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M9 14l-4 -4l4 -4" />
              <path d="M5 10h10a4 4 0 1 1 0 8h-1" />
            </svg>
          </Button>
          <Button size="chat" variant="ghost" disabled={!canRedo} onClick={() => editor?.chain().focus().redo().run()} aria-label="Redo">
            {/* IconArrowForwardUp */}
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-forward-up size-5" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M15 14l4 -4l-4 -4" />
              <path d="M19 10h-10a4 4 0 1 0 0 8h1" />
            </svg>
          </Button>
        </div>
      </div>
    </footer>
  )
}


