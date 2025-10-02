"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconTable } from '@tabler/icons-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const TableTool = () => {
  const { editor } = useEditorBridge()
  const inTable = !!editor?.isActive('table')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="chat" variant="ghost" disabled={!editor} aria-label="Table tools">
          <IconTable className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            disabled={!editor}
            onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            Insert 3×3
          </Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().deleteTable().run()}>Delete table</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().addRowBefore().run()}>Row before</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().addRowAfter().run()}>Row after</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().deleteRow().run()}>Delete row</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().addColumnBefore().run()}>Col before</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().addColumnAfter().run()}>Col after</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().deleteColumn().run()}>Delete col</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().toggleHeaderRow().run()}>Toggle header row</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}>Toggle header col</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().mergeCells().run()}>Merge cells</Button>
          <Button  variant="outline" disabled={!inTable} onClick={() => editor?.chain().focus().splitCell().run()}>Split cell</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TableTool


