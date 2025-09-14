import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChatProvider } from "@/components/chat-provider"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatInset } from "@/components/chat-inset"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

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
        <AppSidebar  />
        <SidebarInset>
          <ChatInset>
            <SiteHeader />
            {children}
          </ChatInset>
        </SidebarInset>
        <ChatSidebar />
      </ChatProvider>
    </SidebarProvider>
  )
}

export default layout