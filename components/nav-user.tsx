"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useUserData } from "@/hooks/use-user-data"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getFirebase } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { userDoc, loading } = useUserData()
  const router = useRouter()

  // Do not fall back to props when loading; avoid showing hardcoded defaults like "shadcn".
  const displayName = (userDoc?.displayName ?? "User")
  const avatarUrl = (userDoc?.photoURL ?? "")

  const handleLogout = async () => {
    try {
      const { auth } = getFirebase()
      await signOut(auth)
      router.push("/signin")
    } catch (e) {
      console.error("Failed to sign out", e)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        
            <div className="flex w-full items-center gap-2 overflow-hidden rounded-lg p-2">
              <Avatar className="h-10 w-10 rounded-full bg-sidebar-accent">
                <AvatarImage src={avatarUrl} alt={displayName} />
              </Avatar>
              <div className="grid flex-1 gap-1.5 text-left leading-tight">
                <span className="truncate text-[16px] font-semibold">{loading ? "User" : displayName}</span>
                <span className="text-muted-foreground truncate text-xs">FREE</span>
              </div>
              <Button
                variant="logout"
                size="icon"
                className="ml-auto"
                onClick={handleLogout}
              >
                <IconLogout className="size-5" />
              </Button>
            </div>
          
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
