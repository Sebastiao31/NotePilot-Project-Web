"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type OnboardingButtonProps = {
  label: string
  selected?: boolean
  onSelect?: (label: string) => void
  className?: string
  icon?: React.ReactNode
}

export function OnboardingButton({ label, selected, onSelect, className, icon }: OnboardingButtonProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect?.(label)}
      className={cn(
        "w-full text-left rounded-lg border px-4 py-5 transition-colors",
        "bg-background hover:bg-accent hover:text-accent-foreground",
        selected && "border-primary border-3",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="inline-flex items-center justify-center size-6">
          {icon}
        </span>
        <span className="text-lg font-medium">{label}</span>
      </div>
    </button>
  )
}

export default OnboardingButton


