"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconUnderline } from '@tabler/icons-react'

const Underline = () => {
  const { editor } = useEditorBridge()
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    if (!editor) return
    const sync = () => setActive(editor.isActive('underline'))
    editor.on('selectionUpdate', sync)
    sync()
    return () => {
      editor.off('selectionUpdate', sync)
    }
  }, [editor])

  return (
    <Button
      size="chat"
      variant="ghost"
      disabled={!editor}
      onClick={() => editor?.chain().focus().toggleUnderline().run()}
      aria-pressed={active}
    >
      <IconUnderline className="size-5" />
    </Button>
  )
}

export default Underline


