import React from 'react'
import { Input } from './input'
import { Button } from './button'
import { IconArrowUp } from '@tabler/icons-react'

type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading?: boolean
  placeholder?: string
}

export default function ChatInput({ value, onChange, onSubmit, loading, placeholder }: ChatInputProps) {
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='w-full'>
        <Input
          type='text'
          placeholder={placeholder ?? 'Ask about this note...'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!!loading}
          className="-bg-primary border-none ring-none focus-none outline-none"
        />
      </div>
      {/* 
      <div>
        <Button size='icon' onClick={onSubmit} disabled={!!loading || !value.trim()} aria-label='Send message'>
          <IconArrowUp className='size-6' />
        </Button>
      </div>
      */}
    </div>
  )
}