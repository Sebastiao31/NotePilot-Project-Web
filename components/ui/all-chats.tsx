"use client"
 
import * as React from "react"
import { CheckIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconClock, IconPencil, IconTrash } from "@tabler/icons-react"
import { getFirebase } from "@/lib/firebase"
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { IconBrandLine } from "@tabler/icons-react"
 
type Chat = { id: string; title?: string; createdAt?: any; updatedAt?: any }

type Props = {
  noteId?: string
  value?: string | null
  onSelect?: (chatId: string) => void
  onDeleted?: (chatId: string) => void
}

export function AllChats({ noteId, value, onSelect, onDeleted }: Props) {
  const [open, setOpen] = React.useState(false)
  const [chats, setChats] = React.useState<Chat[]>([])
  const { db } = getFirebase()
  const [renameId, setRenameId] = React.useState<string | null>(null)
  const [renameValue, setRenameValue] = React.useState<string>("")
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!noteId) return
    const q = query(collection(db, "notes", noteId, "chats"), orderBy("updatedAt", "desc"))
    const unsub = onSnapshot(q, (snap) => {
      const items: Chat[] = []
      snap.forEach((d) => items.push({ id: d.id, ...(d.data() as any) }))
      setChats(items)
    })
    return () => unsub()
  }, [db, noteId])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>

            <Button
                variant="ghost"
                role="combobox"
                aria-expanded={open}
                size="chat"
                >
                <IconClock className="size-5" />
            </Button>
        
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 mr-12">
        <Command>
          <CommandInput placeholder="Search chat..." />
          <CommandList>
            <CommandEmpty>No chat found.</CommandEmpty>
            <CommandGroup>
              {chats.map((c) => (
                <CommandItem
                  key={c.id}
                  value={(c.title || `Chat ${c.id.slice(0, 4)}`).toLowerCase() + " " + c.id}
                  onSelect={() => {
                    onSelect?.(c.id)
                    setOpen(false)
                  }}
                >
                  <IconBrandLine    
                    className={
                      "size-4"
                    }
                  />
                {renameId === c.id ? (
                  <input
                    autoFocus
                    className="ml-2 w-[140px] bg-transparent outline-none border-b border-border text-foreground"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onFocus={(e) => { try { e.currentTarget.select() } catch {} }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        if (!noteId) return
                        await updateDoc(doc(db, 'notes', noteId, 'chats', c.id), { title: renameValue || 'Untitled' })
                        setRenameId(null)
                      } else if (e.key === 'Escape') {
                        setRenameId(null)
                      }
                    }}
                    onBlur={async () => {
                      if (!noteId) return
                      await updateDoc(doc(db, 'notes', noteId, 'chats', c.id), { title: renameValue || 'Untitled' })
                      setRenameId(null)
                    }}
                  />
                ) : (
                  <span className="ml-2 truncate max-w-[160px]">{c.title || `Chat  ${c.id.slice(0, 4)}`}</span>
                )}

                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="ghostCombobox"
                      size="chatCombobox"
                      onClick={async (e) => {
                        e.stopPropagation()
                      setRenameId(c.id)
                      setRenameValue(c.title || "")
                      }}
                    >
                      <IconPencil className="size-4" />
                    </Button>

                    <Button
                      variant="dislike"
                      size="chatCombobox"
                      onClick={async (e) => {
                        e.stopPropagation()
                      setDeleteId(c.id)
                      }}
                    >
                      <IconTrash className="size-4 text-dislike" />
                    </Button>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete chat?</DialogTitle>
            <DialogDescription>This will permanently remove this chat and its messages.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!noteId || !deleteId) return
                const removed = deleteId
                await deleteDoc(doc(db, 'notes', noteId, 'chats', removed))
                setDeleteId(null)
                onDeleted?.(removed)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </PopoverContent>
    </Popover>
  )
}