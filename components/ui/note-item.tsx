"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { IconDotsVertical, IconFolder } from '@tabler/icons-react'
import type { NoteDoc } from '@/hooks/use-notes'

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
          <div className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5">
            <IconFolder className="!size-3 text-red-500" />
            <span className="leading-none">{note.folder || 'No Folder'}</span>
          </div>
          {dateLabel && (
            <>
              <span className="opacity-50">•</span>
              <span>{dateLabel}</span>
            </>
          )}
          <div className="ml-auto">
            <button className="text-muted-foreground hover:text-foreground" onClick={stop}>
              <IconDotsVertical />
              <span className="sr-only">More</span>
            </button>
          </div>
        </div>

        <div className="mt-2 text-lg font-semibold text-foreground">
          {note.title || 'Untitled note'}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {note.status === 'generating' ? 'Generating summary…' : note.note}
        </p>
      </div>
    </div>
  )
}