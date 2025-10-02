"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconQuote } from '@tabler/icons-react'

const Blockquote = () => {
  const { editor } = useEditorBridge()
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    if (!editor) return
    const sync = () => setActive(editor.isActive('blockquote'))
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
      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      aria-pressed={active}
    >
      <IconQuote className="size-5" />
    </Button>
  )
}

export default Blockquote


