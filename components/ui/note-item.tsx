"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { IconDotsVertical, IconFolder, IconLoader2 } from '@tabler/icons-react'
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
  const pathname = usePathname()
  const dateLabel = formatDate(note.date)
  const handleOpen = () => {
    router.push(`/notes/${note.id}`)
  }
  const stop = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const isActive = pathname === `/notes/${note.id}`

  return (
    <div className={"group block cursor-pointer rounded-md mb-2 " + (isActive ? "bg-sidebar" : "hover:bg-sidebar")} onClick={handleOpen}>
      <div className="pl-3 pr-2 py-3">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">

          <div className="truncate gap-2 flex flex-col">

            <div className={" text-[16px] truncate font-semibold " + (isActive ? "text-foreground" : "text-foreground") }>
            {note.status === 'generating' ? (
              <span className="inline-flex items-center gap-2">
                <IconLoader2 className="size-4 animate-spin" />
                <span>Generating note…</span>
              </span>
            ) :  note.title}
            </div>

            <div>
              <StatusBar note={note} />
            </div>

          </div>
          

          


        
          <div className="ml-auto">
            <NoteMore note={note} />
          </div>

        </div>

        
      </div>
    </div>
  )
}