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
      role="switch"
      aria-label="Toggle theme"
      aria-checked={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "hover:cursor-pointer relative inline-flex h-8 w-16 items-center rounded-full bg-sidebar-accent p-0 outline-hidden transition-colors focus-visible:ring-2 ring-sidebar-ring",
        className
      )}
    >
      {/* icons */}
      <Sun
        className={cn(
          "pointer-events-none absolute left-2 size-4 transition-opacity",
          isDark ? "opacity-50" : "opacity-100"
        )}
      />
      <Moon
        className={cn(
          "pointer-events-none absolute right-2 size-4 transition-opacity",
          isDark ? "opacity-100" : "opacity-50"
        )}
      />

      {/* thumb */}
      <span
        aria-hidden
        className={cn(
          " pointer-events-none relative h-6 w-6 translate-x-1 rounded-full bg-background shadow-sm transition-transform",
          isDark && "translate-x-9"
        )}
      >
        <Sun
          className={cn(
            "absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-opacity text-foreground",
            isDark ? "opacity-0" : "opacity-100"
          )}
        />
        <Moon
          className={cn(
            "absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-opacity text-foreground",
            isDark ? "opacity-100" : "opacity-0"
          )}
        />
      </span>
    </button>
  )
}


