"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"
import { IconChevronsRight } from "@tabler/icons-react"
import { Button } from "./ui/button"
import ChatInput from "./ui/chat-input"
import { useParams } from "next/navigation"
import { doc, onSnapshot } from "firebase/firestore"
import { getFirebase } from "@/lib/firebase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"

export function ChatSidebar() {
  const { open, width, setWidth, minWidth, maxWidth, toggle } = useChatSidebar()
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)
  const { db } = getFirebase()

  // Load note text and transcript for grounding
  const [noteText, setNoteText] = React.useState<string>("")
  const [transcript, setTranscript] = React.useState<string>("")
  React.useEffect(() => {
    if (!noteId) return
    const ref = doc(db, "notes", noteId)
    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data() as any
      setNoteText(data?.note || "")
      setTranscript(data?.transcript || "")
    })
    return () => unsub()
  }, [db, noteId])

  type Message = { id: string; role: "user" | "assistant"; content: string }
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const isDraggingRef = React.useRef(false)
  const startXRef = React.useRef(0)
  const startWidthRef = React.useRef(width)

  const onPointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true
    startXRef.current = event.clientX
    startWidthRef.current = width
    ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
    document.body.classList.add("select-none")
  }, [width])

  const onPointerMove = React.useCallback((event: PointerEvent) => {
    if (!isDraggingRef.current) return
    const delta = startXRef.current - event.clientX
    const nextWidth = startWidthRef.current + delta
    setWidth(nextWidth)
  }, [setWidth])

  const endDrag = React.useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    document.body.classList.remove("select-none")
  }, [])

  React.useEffect(() => {
    const handleMove = (e: PointerEvent) => onPointerMove(e)
    const handleUp = () => endDrag()
    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)
    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }
  }, [onPointerMove, endDrag])

  const ask = React.useCallback(async () => {
    const question = input.trim()
    if (!question || !noteId) return
    setLoading(true)
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: question }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    try {
      const res = await fetch(`/api/notes/${noteId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, note: noteText ?? "", transcript: transcript ?? "" }),
      })
      const data = await res.json()
      const answer = (data?.answer ?? "") as string
      const asstMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: answer || "(No answer)" }
      setMessages((prev) => [...prev, asstMsg])
    } catch (err) {
      const asstMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "Sorry, something went wrong." }
      setMessages((prev) => [...prev, asstMsg])
    } finally {
      setLoading(false)
    }
  }, [input, noteId, noteText, transcript])

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-30 border-l bg-background-primary transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full"
      )}
      style={{ width }}
      aria-hidden={!open}
    >
      <div className="flex h-full flex-col">
        <div
          aria-hidden
          onPointerDown={onPointerDown}
          className="absolute left-0 top-0 z-10 h-full w-1 cursor-col-resize bg-transparent"
          title={`Drag to resize (${minWidth}-${maxWidth}px)`}
        />
        <div className="px-3 py-4 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggle} >
                <IconChevronsRight className="size-5 text-accent-foreground/60" />
            </Button>
          <h2 className="text-foreground text-base font-semibold">Ai Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-[16px] space-y-4">
          {messages.length === 0 ? (
            <p className="text-muted-foreground/70">Ask a question about this note. Answers will be limited to the note and its transcript.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}> 
                <div className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3 break-words",
                  m.role === "user" ? "bg-sidebar" : "bg-background-primary"
                )}>
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeKatex]}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="mt-1 mb-2 text-[18px] font-semibold" {...props} />,
                      h2: ({node, ...props}) => <h2 className="mt-1 mb-2 text-[17px] font-semibold" {...props} />,
                      h3: ({node, ...props}) => <h3 className="mt-1 mb-2 text-[16px] font-semibold" {...props} />,
                      p: ({node, ...props}) => <p className="mt-1 mb-2 leading-7 text-[16px] text-foreground" {...props} />,
                      a: ({node, ...props}) => <a className="underline text-[16px] underline-offset-2 text-primary" {...props} />,
                      ul: ({node, ...props}) => <ul className="mt-1 mb-2 list-disc text-[16px] pl-5 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="mt-1 mb-2 list-decimal text-[16px] pl-5 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="leading-6 text-[16px]" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="mt-2 mb-2 border-l-2 pl-3 italic text-muted-foreground" {...props} />,
                      hr: () => <div className="my-3 border-t" />,
                      code: ({node, inline, ...props}: any) => inline ? (
                        <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em]" {...props} />
                      ) : (
                        <code className="block rounded bg-muted my-2 p-3 text-[0.9em] overflow-x-auto" {...props} />
                      ),
                      table: ({node, ...props}) => (
                        <div className="my-3 overflow-x-auto">
                          <table className="w-full text-sm border-separate border-spacing-0" {...props} />
                        </div>
                      ),
                      th: ({node, ...props}) => <th className="border border-border px-2 py-1 bg-muted/50 text-left font-medium" {...props} />,
                      td: ({node, ...props}) => <td className="border border-border px-2 py-1 align-top" {...props} />,
                    }}
                  >
                    {m.content?.trim?.() ?? m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-3">
          <ChatInput value={input} onChange={setInput} onSubmit={ask} loading={loading} />
        </div>
      </div>
    </div>
  )
}


