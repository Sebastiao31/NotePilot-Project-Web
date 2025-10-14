"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type DragAudioContainerProps = {
  children: React.ReactNode
  className?: string
}

export function DragAudioContainer({ children, className }: DragAudioContainerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const isDraggingRef = React.useRef(false)
  const startPointerRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const startPosRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const onPointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    // Only start drag from elements marked as handle
    if (!target.closest('[data-drag-handle="true"]')) return
    isDraggingRef.current = true
    startPointerRef.current = { x: e.clientX, y: e.clientY }
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    startPosRef.current = { x: rect.left, y: rect.top }
    // Switch from bottom/right anchoring to top/left to avoid stretch
    el.style.bottom = "auto"
    el.style.right = "auto"
    el.style.left = `${rect.left}px`
    el.style.top = `${rect.top}px`
    el.setPointerCapture?.(e.pointerId)
    document.body.classList.add("select-none")
  }, [])

  const onPointerMove = React.useCallback((e: PointerEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - startPointerRef.current.x
    const dy = e.clientY - startPointerRef.current.y
    const nextX = startPosRef.current.x + dx
    const nextY = startPosRef.current.y + dy
    const el = containerRef.current
    if (!el) return

    // Constrain within viewport
    const vw = window.innerWidth
    const vh = window.innerHeight
    const width = el.offsetWidth
    const height = el.offsetHeight
    const clampedX = Math.max(8, Math.min(nextX, vw - width - 8))
    const clampedY = Math.max(8, Math.min(nextY, vh - height - 8))
    el.style.left = `${clampedX}px`
    el.style.top = `${clampedY}px`
  }, [])

  const onPointerUp = React.useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    document.body.classList.remove("select-none")
  }, [])

  React.useEffect(() => {
    const move = (e: PointerEvent) => onPointerMove(e)
    const up = () => onPointerUp()
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
    }
  }, [onPointerMove, onPointerUp])

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      className={cn(
        "fixed z-[60]",
        className
      )}
      style={{ right: 24, bottom: 24 }}
    >
      {children}
    </div>
  )
}


