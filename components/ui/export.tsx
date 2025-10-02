"use client"

import React from 'react'
import { Button } from './button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { IconFileTypePdf, IconFileTypeDocx, IconCopy } from '@tabler/icons-react'
import { useParams } from 'next/navigation'
import { doc, onSnapshot } from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'

const Export = () => {
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)
  const { db } = getFirebase()
  const [note, setNote] = React.useState<string>("")

  React.useEffect(() => {
    if (!noteId) return
    const ref = doc(db, 'notes', noteId)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      setNote(data?.note || "")
    })
    return () => unsub()
  }, [db, noteId])

  return (
    <DropdownMenu>
    <DropdownMenuTrigger>
        <Button variant="ghost">
            Export
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
        <DropdownMenuLabel>Export</DropdownMenuLabel>
        <DropdownMenuItem>
            <IconFileTypePdf className='size-5 text-accent-foreground' />
            PDF (.pdf)</DropdownMenuItem>
        <DropdownMenuItem>
            <IconFileTypeDocx className='size-5 text-accent-foreground' />
            Word (.docx)</DropdownMenuItem>
        <DropdownMenuItem onClick={async () => {
          try {
            await navigator.clipboard.writeText(note || "")
            const { toast } = await import("sonner")
            toast.success("Note copied to clipboard")
          } catch {
            const { toast } = await import("sonner")
            toast.error("Failed to copy note")
          }
        }}>
            <IconCopy className='size-5 text-accent-foreground' />
            Copy to clipboard</DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Export