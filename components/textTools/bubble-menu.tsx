"use client"

import React from "react"
 import { BubbleMenu } from '@tiptap/react/menus'
import { useEditorBridge } from "../editor-bridge"
import { Button } from "../ui/button"
import { IconBold, IconItalic, IconUnderline, IconStrikethrough } from "@tabler/icons-react"
import Texts from "./texts"
import Lists from "./lists"
import Background from "./background"
import { Separator } from "../ui/separator"
import TableTool from "./table"
import MathTool from "./math"
import { useEditMode } from "../edit-mode-provider"

const BubbleMenuFloating = () => {
  const { editor } = useEditorBridge()
  const { editModeEnabled } = useEditMode()
  if (!editor) return null
  if (!editModeEnabled) return null

  return (
    <BubbleMenu editor={editor} pluginKey="bubble-menu-formatting">
      <div className="flex items-center gap-2 rounded-lg border bg-popover px-2 py-1 shadow-md">
        <Button
          size="chat"
          variant={editor.isActive("bold") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-pressed={editor.isActive("bold")}
        >
          <IconBold className="size-5" />
        </Button>
        <Button
          size="chat"
          variant={editor.isActive("italic") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-pressed={editor.isActive("italic")}
        >
          <IconItalic className="size-5" />
        </Button>
        <Button
          size="chat"
          variant={editor.isActive("underline") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-pressed={editor.isActive("underline")}
        >
          <IconUnderline className="size-5" />
        </Button>
        <Button
          size="chat"
          variant={editor.isActive("strike") ? "default" : "ghost"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-pressed={editor.isActive("strike")}
        >
          <IconStrikethrough className="size-5" />
        </Button>
        <Background />
      </div>
    </BubbleMenu>
  )
}

export default BubbleMenuFloating


