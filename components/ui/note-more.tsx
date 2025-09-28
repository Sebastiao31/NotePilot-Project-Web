import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "./button"
import { IconDotsVertical, IconFolder, IconFolderUp, IconPencil, IconTrash } from "@tabler/icons-react"
import { useFolders } from "@/hooks/use-folders"
import type { NoteDoc } from "@/hooks/use-notes"
import { doc, updateDoc } from "firebase/firestore"
import { getFirebase } from "@/lib/firebase"
import { Dialog, DialogContent, DialogTrigger } from "./dialog"
import RenameNote from "../modals/rename-note"

type Props = { note: NoteDoc }

const noteMore = ({ note }: Props) => {
  const { folders, loading } = useFolders()
  const { db } = getFirebase()
  const [openRename, setOpenRename] = React.useState(false)

  const moveToFolder = async (folderName: string | null) => {
    try {
      await updateDoc(doc(db, 'notes', note.id), { folder: folderName })
    } catch (err) {
      // no-op UI error handling for now
      console.error('Failed to move note to folder', err)
    }
  }
  return (
    <DropdownMenu>
    <DropdownMenuTrigger>

        <Button variant="ghost" size="icon">
            <IconDotsVertical />
        </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="mr-12">
        <DropdownMenuLabel>More</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => setOpenRename(true)}>
            <IconPencil className="size-5 text-accent-foreground" />
            Edit</DropdownMenuItem>

            <DropdownMenuSub>
            <DropdownMenuSubTrigger >
                <IconFolderUp className="size-5 text-accent-foreground mr-2" />
                Move To
                </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[14rem]">
                {loading ? (
                  <DropdownMenuItem disabled>Loading folders…</DropdownMenuItem>
                ) : folders.length === 0 ? (
                  <DropdownMenuItem disabled>No folders</DropdownMenuItem>
                ) : (
                  folders.map((f) => (
                    <DropdownMenuItem key={f.id} className="flex items-center gap-2" onSelect={() => moveToFolder(f.name)}>
                      <IconFolder className="size-5" style={{ color: f.color }} />
                      <span className="truncate">{f.name}</span>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => moveToFolder(null)}>Remove from folder</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
            <IconTrash className="size-5 text-dislike" />
            Delete Note</DropdownMenuItem>
    </DropdownMenuContent>
    <Dialog open={openRename} onOpenChange={setOpenRename}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <RenameNote note={note} open={openRename} onOpenChange={setOpenRename} />
      </DialogContent>
    </Dialog>
    </DropdownMenu>
  )
}

export default noteMore