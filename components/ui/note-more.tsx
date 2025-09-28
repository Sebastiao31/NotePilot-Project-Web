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
import { IconDotsVertical, IconFolderUp, IconPencil, IconTrash } from "@tabler/icons-react"

const noteMore = () => {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger>

        <Button variant="ghost" size="icon">
            <IconDotsVertical />
        </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="mr-12">
        <DropdownMenuLabel>More</DropdownMenuLabel>
        <DropdownMenuItem>
            <IconPencil className="size-5 text-accent-foreground" />
            Edit</DropdownMenuItem>

            <DropdownMenuSub>
            <DropdownMenuSubTrigger >
                <IconFolderUp className="size-5 text-accent-foreground mr-2" />
                Move To
                </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>German</DropdownMenuItem>
                
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
            <IconTrash className="size-5 text-dislike" />
            Delete Note</DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default noteMore