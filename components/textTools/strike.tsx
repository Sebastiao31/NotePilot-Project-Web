"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconStrikethrough } from '@tabler/icons-react'

const Strike = () => {
  const { editor } = useEditorBridge()
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    if (!editor) return
    const sync = () => setActive(editor.isActive('strike'))
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
      onClick={() => editor?.chain().focus().toggleStrike().run()}
      aria-pressed={active}
    >
      <IconStrikethrough className="size-5" />
    </Button>
  )
}

export default Strike


