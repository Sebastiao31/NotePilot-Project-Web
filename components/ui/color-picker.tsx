"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

type ColorPickerProps = {
  value?: string
  onChange?: (hex: string) => void
  className?: string
}

const PRESET_COLORS: string[] = [
  // Top row
  '#0A7BFF', // blue
  '#05929A', // teal
  '#10B981', // green
  '#0F4C5C', // dark teal
  '#7C3AED', // purple
  // Bottom row
  '#F472B6', // pink
  '#E11D48', // red
  '#F97316', // orange
  '#F2C94C', // yellow
  '#8B5E3C', // brown
]

function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [internal, setInternal] = React.useState<string>(value ?? PRESET_COLORS[0])
  const selected = value ?? internal

  React.useEffect(() => {
    if (value !== undefined) return
    // Initialize uncontrolled state the first time
    setInternal((prev) => prev ?? PRESET_COLORS[0])
  }, [value])

  const handleSelect = (hex: string) => {
    if (value === undefined) setInternal(hex)
    onChange?.(hex)
  }

  return (
    <div className={cn('grid grid-cols-5 grid-rows-2  gap-7', className)}>
      {PRESET_COLORS.map((hex) => {
        const isSelected = selected?.toLowerCase() === hex.toLowerCase()
        return (
          <button
            key={hex}
            type="button"
            onClick={() => handleSelect(hex)}
            aria-label={`Choose color ${hex}`}
            aria-pressed={isSelected}
            className={cn(
              'h-15 w-15 rounded-lg transition-transform hover:scale-[1.04] focus:outline-none hover:cursor-pointer',
              isSelected ? 'ring-3 ring-offset-3 ring-offset-sidebar' : 'ring-0'
            )}
            style={{ backgroundColor: hex }}
          />
        )
      })}
    </div>
  )
}

export default ColorPicker