import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChatProvider } from "@/components/chat-provider"
import { AudioRecordProvider } from "@/components/ui/audio-rec-container"
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
import { EditorBridgeProvider } from "@/components/editor-bridge"


const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <SidebarProvider>
      <ChatProvider>
        <AudioRecordProvider>
        <NoteProvider>
        <AuthGuard>
          <EditModeProvider>
            <EditorBridgeProvider>
              <AppSidebar />
              <SidebarInset>
                <NoteInset>
                  <ChatInset>
                  <SiteHeader />
                  <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
                    {children}
                    <Toolbar />
                  </div>
                  </ChatInset>
                </NoteInset>
              </SidebarInset>
              <NoteSidebar />
              <ChatSidebar />
            </EditorBridgeProvider>
          </EditModeProvider>
        </AuthGuard>
        </NoteProvider>
        </AudioRecordProvider>
      </ChatProvider>
    </SidebarProvider>
  )
}

export default layout