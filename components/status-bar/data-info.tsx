import React from 'react'
import type { NoteDoc } from '@/hooks/use-notes'

function formatCreationDate(date: any) {
  if (!date) return ''
  
  const currentYear = new Date().getFullYear()
  
  // Firestore Timestamp
  if (typeof date?.toMillis === 'function') {
    const d = new Date(date.toMillis())
    const day = d.getDate()
    const month = d.toLocaleString('en-US', { month: 'short' }).substring(0, 3)
    const year = d.getFullYear()
    
    // Only include year if it's not the current year
    if (year !== currentYear) {
      const shortYear = year.toString().substring(2)
      return `${month} ${day}, ${shortYear}`
    }
    
    return `${month} ${day}`
  }
  
  // ISO/string/date fallback
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const day = d.getDate()
  const month = d.toLocaleString('en-US', { month: 'short' }).substring(0, 3)
  const year = d.getFullYear()
  
  // Only include year if it's not the current year
  if (year !== currentYear) {
    const shortYear = year.toString().substring(2)
    return `${month} ${day}, ${shortYear}`
  }
  
  return `${month} ${day}`
}

type DataInfoProps = {
  note?: NoteDoc
}

export default function DataInfo({ note }: DataInfoProps) {
  const dateLabel = note ? formatCreationDate(note.date) : ''

  return (
    <main>
        <div className="text-md font-semibold text-muted-foreground/80">
          {dateLabel}
        </div>
    </main>
  )
}
