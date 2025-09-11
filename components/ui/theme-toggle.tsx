"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const isDark = (resolvedTheme ?? theme) === "dark"

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={cn(
        "ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground inline-flex h-8 w-8 items-center justify-center rounded-md outline-hidden transition-colors focus-visible:ring-2",
        className
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun className={cn("!size-5", isDark && "hidden")} />
      <Moon className={cn("!size-5", !isDark && "hidden")} />
    </button>
  )
}


