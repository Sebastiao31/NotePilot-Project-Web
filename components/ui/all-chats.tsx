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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { IconClock } from "@tabler/icons-react"
import { getFirebase } from "@/lib/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
 
type Chat = { id: string; title?: string; createdAt?: any; updatedAt?: any }

type Props = {
  noteId?: string
  value?: string | null
  onSelect?: (chatId: string) => void
}

export function AllChats({ noteId, value, onSelect }: Props) {
  const [open, setOpen] = React.useState(false)
  const [chats, setChats] = React.useState<Chat[]>([])
  const { db } = getFirebase()

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
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === c.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {c.title || `Chat ${c.id.slice(0, 4)}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}