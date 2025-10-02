"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconPaint, IconBan, IconSquareRoundedFilled } from '@tabler/icons-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'

// Theme-aware palette: choose readable BGs for both light/dark
type HighlightKey = 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | 'none'
const COLORS: { key: HighlightKey; className: string }[] = [
  { key: 'yellow', className: 'bg-highlight-yellow dark:bg-highlight-yellow' },
  { key: 'green', className: 'bg-highlight-green dark:bg-highlight-green' },
  { key: 'blue', className: 'bg-highlight-blue dark:bg-highlight-blue' },
  { key: 'pink', className: 'bg-highlight-pink dark:bg-highlight-pink' },
  { key: 'purple', className: 'bg-highlight-purple dark:bg-highlight-purple' },
  { key: 'none', className: 'bg-transparent' },
]

// Theme-aware CSS variables declared in globals.css
const COLOR_VAR: Record<Exclude<HighlightKey, 'none'>, string> = {
  yellow: 'var(--highlight-yellow)',
  green: 'var(--highlight-green)',
  blue: 'var(--highlight-blue)',
  pink: 'var(--highlight-pink)',
  purple: 'var(--highlight-purple)',
}

const Background = () => {
  const { editor } = useEditorBridge()
  const [value, setValue] = React.useState<HighlightKey>('none')

  React.useEffect(() => {
    if (!editor) return
    const sync = () => {
      // Try to infer from current selection style attribute (not perfect, but workable)
      // We store the chosen color in dataset via style background-color, multicolor highlight supports raw colors.
      setValue('none')
    }
    editor.on('selectionUpdate', sync)
    sync()
    return () => {
      editor.off('selectionUpdate', sync)
    }
  }, [editor])

  const applyColor = (key: HighlightKey) => {
    if (!editor) return
    if (key === 'none') {
      editor.chain().focus().unsetHighlight().run()
      return
    }
    const cssColor = COLOR_VAR[key as Exclude<HighlightKey, 'none'>]
    editor.chain().focus().setHighlight({ color: cssColor as string }).run()
  }

  const triggerSwatch = () => {
    const current = COLORS.find(c => c.key === value) || COLORS[0]
    return (
      <div className="flex items-center gap-2">
        <IconPaint className="size-5 text-accent-foreground" />
      </div>
    )
  }

  return (
    <Popover >
      <PopoverTrigger asChild>
        <Button size="chat" variant="ghost" disabled={!editor}>
          <IconPaint className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {COLORS.filter(c => c.key !== 'none').map(({ key }) => (
              <Button
                size="icon"
                variant="ghost"
                key={key}
                type="button"
                aria-label={key}
                onClick={() => {
                  setValue(key)
                  applyColor(key)
                }}
              >
                <IconSquareRoundedFilled className="size-5" style={{ color: COLOR_VAR[key as Exclude<HighlightKey,'none'>] }} />
              </Button>
            ))}
          </div>
          <Separator
          orientation="vertical"
          className=" data-[orientation=vertical]:h-6"
          />
          <Button
            size="icon"
            variant="ghost"
            aria-label="Remove highlight"
            onClick={() => {
              setValue('none')
              applyColor('none')
            }}
          >
            <IconBan className="size-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Background


