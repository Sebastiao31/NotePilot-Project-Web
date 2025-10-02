import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChatProvider } from "@/components/chat-provider"
import { ChatSidebar } from "@/components/chat-sidebar"
import { NoteProvider } from "@/components/note-provider"
import { NoteSidebar } from "@/components/note-sidebar"
import { NoteInset } from "@/components/note-inset"
import { ChatInset } from "@/components/chat-inset"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import AuthGuard from "@/components/auth-guard"
import { EditModeProvider } from "@/components/edit-mode-provider"
import Toolbar from "@/components/toolbar"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 16)",
        } as React.CSSProperties
      }
    >
      <ChatProvider>
        <NoteProvider>
        <AuthGuard>
          <EditModeProvider>
            <AppSidebar />
            <SidebarInset>
              <NoteInset>
                <ChatInset>
                <SiteHeader />
                {children}
                <Toolbar />
                </ChatInset>
              </NoteInset>
            </SidebarInset>
            <NoteSidebar />
            <ChatSidebar />
          </EditModeProvider>
        </AuthGuard>
        </NoteProvider>
      </ChatProvider>
    </SidebarProvider>
  )
}

export default layout