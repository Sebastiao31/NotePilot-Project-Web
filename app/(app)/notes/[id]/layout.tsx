import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Loading from "./loading"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
   <div>
    {children}
   </div>
  )
}

export default layout