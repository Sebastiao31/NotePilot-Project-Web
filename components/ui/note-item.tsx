import React from 'react'
import Link from 'next/link'
import { Note } from '@/constants/notes'
import { cn } from '@/lib/utils'
import { IconDotsVertical, IconFolder, IconMicrophone,IconBrandYoutubeFilled, IconTextScan2, IconUpload, IconWorldWww } from '@tabler/icons-react'

const TYPE_STYLES: Record<string, string> = {
  Audio: 'bg-(--type-audio-bg) text-(--type-audio-color-font)',
  YouTube: 'bg-(--type-YouTube-bg) text-(--type-YouTube-color-font)',
  Website: 'bg-(--type-website-bg) text-(--type-website-color-font)',
  PDF_File: 'bg-(--type-pdf-bg) text-(--type-pdf-color-font)',
  Text: 'bg-(--type-text-bg) text-(--type-text-color-font)',
}

const TYPE_ICONS = {
  Audio: <IconMicrophone className='!size-4' />,
  YouTube: <IconBrandYoutubeFilled className='!size-4' />,
  Website: <IconWorldWww className='!size-4' />,
  PDF_File: <IconUpload className='!size-4' />,
  Text: <IconTextScan2 className='!size-4' />,
}

export default function NoteItem({ note }: { note: Note }) {
  return (
    
        <Link href={`/notes/${note.id}`} className="border rounded-xl px-4 py-3 flex items-center gap-4 hover:bg-accent hover:cursor-pointer transition-colors duration-300">
      <div className="size-13 rounded-lg bg-secondary flex items-center justify-center text-2xl">
        <span aria-hidden>{note.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate text-xl">
          {note.title}
        </div>
        <div className="mt-2 flex items-center gap-3 text-muted-foreground/70 font-medium text-md">
          <div className="flex items-center gap-1">
            <IconFolder className="!size-4 " />
            <span className="truncate">{note.folder}</span>
          </div>
          <span className="opacity-50 text-sm">•</span>
          <div className="flex items-center gap-1">
            <span className="truncate">{note.createdAt}</span>
          </div>
          <span className="opacity-50 text-sm">•</span>
          <div className={cn('px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1', TYPE_STYLES[note.type] ?? '')}>
            {TYPE_ICONS[note.type as keyof typeof TYPE_ICONS] ?? ''}
            {note.type}
          </div>
        </div>
        
      </div>
      <button className="text-muted-foreground hover:text-foreground">
        <IconDotsVertical />
        <span className="sr-only">More</span>
      </button>
      </Link>

  )
}