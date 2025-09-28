"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { IconDotsVertical, IconFolder } from '@tabler/icons-react'
import type { NoteDoc } from '@/hooks/use-notes'
import StatusBar from '../status-bar/status-bar'
import NoteMore from './note-more'

function formatDate(value: any) {
  if (!value) return ''
  // Firestore Timestamp
  if (typeof value?.toMillis === 'function') {
    const d = new Date(value.toMillis())
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }
  // ISO/string/date fallback
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

type Props = { note: NoteDoc }

export default function NoteItem({ note }: Props) {
  const router = useRouter()
  const dateLabel = formatDate(note.date)
  const handleOpen = () => {
    router.push(`/notes/${note.id}`)
  }
  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div className="group block hover:bg-accent/30 cursor-pointer" onClick={handleOpen}>
      <div className="px-4 py-4 lg:px-6">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">

          <div>
            <StatusBar note={note} />
          </div>


        
          <div className="ml-auto">
            <NoteMore />
          </div>
        </div>

        <div className="mt-2 text-lg font-semibold text-foreground">
          {note.title || 'Untitled note'}
        </div>
        <p className="mt-2 text-md text-muted-foreground">
          {note.status === 'generating' ? 'Generating summary…' : (note.overview || note.note).slice(0, 380) + ((note.overview || note.note).length > 180 ? '…' : '')}
        </p>
      </div>
    </div>
  )
}