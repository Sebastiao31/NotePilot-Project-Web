"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"
import { IconChevronsRight } from "@tabler/icons-react"
import { Button } from "./ui/button"

export function ChatSidebar() {
  const { open } = useChatSidebar()

    const { toggle } = useChatSidebar()


  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-30 w-80 md:w-96 border-l bg-background-primary  transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div className="px-3 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggle} >
                <IconChevronsRight className="size-5 text-accent-foreground/60" />
            </Button>
          <h2 className="text-foreground text-base font-semibold">Ai Chat</h2>
        </div>
        <div className="p-4 text-sm text-muted-foreground">
          Chat UI placeholder
        </div>
      </div>
    </div>
  )
}


