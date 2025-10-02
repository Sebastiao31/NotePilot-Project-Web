"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconSpacingVertical } from '@tabler/icons-react'

const HorizontalRule = () => {
  const { editor } = useEditorBridge()

  return (
    <Button
      size="chat"
      variant="ghost"
      disabled={!editor}
      onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      aria-label="Insert horizontal rule"
    >
      <IconSpacingVertical className="size-5" />
    </Button>
  )
}

export default HorizontalRule


