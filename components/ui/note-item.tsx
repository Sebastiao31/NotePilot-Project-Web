import React from 'react'
import Link from 'next/link'
import { Note } from '@/constants/notes'
import { IconDotsVertical, IconFolder } from '@tabler/icons-react'

function formatDate(value: string) {
  const date = new Date(value)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function NoteItem({ note }: { note: Note }) {
  const dateLabel = formatDate(note.createdAt)

  return (
    <Link href={`/notes/${note.id}`} className="group block hover:bg-accent/30">
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
            <button className="text-muted-foreground hover:text-foreground">
              <IconDotsVertical />
              <span className="sr-only">More</span>
            </button>
          </div>
        </div>

        <div className="mt-2 text-lg font-semibold text-foreground">
          {note.title}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {note.note}
        </p>
      </div>
    </Link>
  )
}