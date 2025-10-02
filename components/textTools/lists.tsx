"use client"

import React from 'react'
import { useEditorBridge } from '../editor-bridge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select'
import { IconList, IconListNumbers } from '@tabler/icons-react'

type ListValue = "bullet" | "ordered"

const Lists = () => {
  const { editor } = useEditorBridge()
  const [value, setValue] = React.useState<ListValue | null>(null)

  React.useEffect(() => {
    if (!editor) return
    const syncLists = () => {
      if (editor.isActive('bulletList')) {
        setValue('bullet')
        return
      }
      if (editor.isActive('orderedList')) {
        setValue('ordered')
        return
      }
      setValue(null)
    }
    editor.on('selectionUpdate', syncLists)
    syncLists()
    return () => {
      editor.off('selectionUpdate', syncLists)
    }
  }, [editor])

  const renderIcon = () => {
    if (value === 'bullet') return <IconList className="size-5 text-accent-foreground" />
    if (value === 'ordered') return <IconListNumbers className="size-5 text-accent-foreground" />
    // Default icon when no list is active
    return <IconList className="size-5 text-accent-foreground" />
  }

  return (
    <Select
      value={value ?? undefined}
      onValueChange={(next) => {
        const nextValue = next as ListValue
        setValue(nextValue)
        if (nextValue === 'bullet') {
          if (!editor?.isActive('bulletList')) editor?.chain().focus().toggleBulletList().run()
          return
        }
        if (nextValue === 'ordered') {
          if (!editor?.isActive('orderedList')) editor?.chain().focus().toggleOrderedList().run()
          return
        }
      }}
      disabled={!editor}
    >
      <SelectTrigger className='bg-background-primary border-none font-semibold max-w-[180px] sm:max-w-[220px] truncate dark:bg-background-primary'>
        {renderIcon()}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="bullet">
          <div className='flex items-center text-[16px] gap-2'>
            <IconList className="size-5 text-muted-foreground" />
            <span>Bulleted list</span>
          </div>
        </SelectItem>
        <SelectItem value="ordered">
          <div className='flex items-center text-[16px] gap-2'>
            <IconListNumbers className="size-5 text-muted-foreground" />
            <span>Numbered list</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

export default Lists


