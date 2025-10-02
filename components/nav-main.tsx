"use client"

import { IconBrandLine, IconCirclePlusFilled, IconFiles, IconLibraryPlus, IconMail, IconMicrophone, IconSparkles, type Icon } from "@tabler/icons-react"
import { usePathname, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import MoreOptions from "@/components/modals/more-options"
import { useNoteSidebar } from "./note-provider"
import { useChatSidebar } from "./chat-provider"
import React from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { getFirebase } from "@/lib/firebase"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()
  const params = useParams()
  const { toggle: toggleNoteSidebar } = useNoteSidebar()
  const { toggle: toggleChatSidebar, setOpen: setChatOpen, open: chatOpen } = useChatSidebar()
  const { db } = getFirebase()

  const noteId = React.useMemo(() => {
    const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)
    return id ?? null
  }, [params])

  const [noteHasContent, setNoteHasContent] = React.useState<boolean>(false)
  const [noteGenerating, setNoteGenerating] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!noteId) return
    const ref = doc(db, 'notes', noteId)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      const content = data?.note as string | undefined
      const status = data?.status as string | undefined
      setNoteHasContent(!!(content && content.trim().length > 0))
      setNoteGenerating(status === 'generating')
    })
    return () => unsub()
  }, [db, noteId])

  const isAiChatEnabled = !!noteId && (noteHasContent || noteGenerating)

  React.useEffect(() => {
    if (!isAiChatEnabled) {
      setChatOpen(false)
    }
  }, [isAiChatEnabled, setChatOpen])
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Record Audio"
              size="record"
              className="justify-center bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconMicrophone className="!size-5" />
              <span>Record Audio</span>
            </SidebarMenuButton>
            
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
        <SidebarMenuItem>
          <Dialog>
            <DialogTrigger asChild>
              <SidebarMenuButton
                tooltip="More Options"
                variant="ghost"
              >
                <IconLibraryPlus className="!size-5" />
                <span>More Options</span>
              </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent>
              <MoreOptions />
            </DialogContent>
          </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
        
          {items.map((item) => {
            const isActive =
              pathname === item.url || pathname.startsWith(item.url + "/")
            if (item.title === 'Notes') {
              return [
                (
                  <SidebarMenuItem key="notes">
                    <SidebarMenuButton tooltip={item.title} variant="ghost" onClick={toggleNoteSidebar}>
                      {IconFiles && <IconFiles className="!size-5"/>}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
                (
                  <SidebarMenuItem key="ai-chat">
                    <SidebarMenuButton
                      tooltip="Ai Chat"
                      variant="ghost"
                      className="gap-2"
                      onClick={toggleChatSidebar}
                      disabled={!isAiChatEnabled}
                    >
                      <IconBrandLine className="!size-5" />
                      <span>AI Chat</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ]
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} variant="ghost" isActive={isActive} asChild>
                  <a href={item.url}>
                    {item.icon && <item.icon className="!size-5"/>}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
