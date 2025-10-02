"use client"

import React from 'react'
import { Button } from '../ui/button'
import { IconLetterTSmall, IconH1, IconH2, IconH3, IconLetterT } from '@tabler/icons-react'
import { useEditorBridge } from '../editor-bridge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const Texts = () => {
  const { editor } = useEditorBridge()
  const [value, setValue] = React.useState<"p" | "1" | "2" | "3">("p")

  React.useEffect(() => {
    if (!editor) return
    const syncHeading = () => {
      if (editor.isActive('paragraph')) {
        setValue('p')
        return
      }
      for (let level = 1 as 1 | 2 | 3; level <= 3; level = (level + 1) as 1 | 2 | 3) {
        if (editor.isActive('heading', { level })) {
          setValue(String(level) as typeof value)
          return
        }
      }
      setValue('p')
    }
    editor.on('selectionUpdate', syncHeading)
    syncHeading()
    return () => {
      editor.off('selectionUpdate', syncHeading)
    }
  }, [editor])

  return (
    <div className="flex items-center gap-2">
      
      <Select
        value={value}
        onValueChange={(next) => {
          setValue(next as typeof value)
          if (next === 'p') {
            editor?.chain().focus().setParagraph().run()
            return
          }
          const level = Number(next) as 1 | 2 | 3
          // Ensure we set the heading deterministically
          editor?.chain().focus().setParagraph().toggleHeading({ level }).run()
        }}
        disabled={!editor}
      >
        <SelectTrigger  className='bg-background-primary border-none px-1.5 font-semibold max-w-[180px] sm:max-w-[220px] truncate dark:bg-background-primary'>
          {value === 'p' && <IconLetterT    className="size-5 text-accent-foreground" />}
          {value === '1' && <IconH1 className="size-6 text-accent-foreground" />}
          {value === '2' && <IconH2 className="size-6 text-accent-foreground" />}
          {value === '3' && <IconH3 className="size-6 text-accent-foreground" />}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="p">
            <div className='flex items-center text-[16px] gap-2'>
              <IconLetterT className="size-4 text-muted-foreground" />
              <span>Text</span>
            </div>
          </SelectItem>
          <SelectItem value="1">
            <div className='flex items-center  text-[16px] gap-2'>
              <IconH1 className="size-5 text-muted-foreground" />
              <span>Heading 1</span>
            </div>
          </SelectItem>
          <SelectItem value="2">
            <div className='flex items-center text-[16px] gap-2'>
              <IconH2 className="size-5 text-muted-foreground" />
              <span>Heading 2</span>
            </div>
          </SelectItem>
          <SelectItem value="3">
            <div className='flex items-center text-[16px] gap-2'>
              <IconH3 className="size-5 text-muted-foreground" />
              <span>Heading 3</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default Texts