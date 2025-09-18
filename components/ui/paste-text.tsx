"use client"
import React from 'react'
import { Textarea } from './textarea'

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const PasteText = ({ value, onChange, disabled }: Props) => {
  return (
    <main>
        <div>
            <Textarea
              id="paste-text"
              placeholder="Paste your text here.."
              className='h-40'
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
        </div>
    </main>
  )
}

export default PasteText