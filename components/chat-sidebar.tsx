"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatSidebar } from "./chat-provider"
import { IconChevronsRight, IconClock, IconPlus } from "@tabler/icons-react"
import { Button } from "./ui/button"
import ChatInput from "./ui/chat-input"
import { useParams } from "next/navigation"
import { doc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, setDoc, getDoc } from "firebase/firestore"
import { getFirebase } from "@/lib/firebase"
import MarkdownChat from "./ui/markdown-chat"
import { AllChats } from "./ui/all-chats"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import AiTools from "./ui/ai-tools"

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
  const [chatId, setChatId] = React.useState<string | null>(null)
  const [suggestions, setSuggestions] = React.useState<string[] | null>(null)

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

  // Subscribe to messages for the active chat
  React.useEffect(() => {
    if (!noteId || !chatId) {
      setMessages([])
      return
    }
    const q = query(collection(db, "notes", noteId, "chats", chatId, "messages"), orderBy("createdAt", "asc"))
    const unsub = onSnapshot(q, (snap) => {
      const rows: Message[] = []
      snap.forEach((d) => {
        const data = d.data() as any
        rows.push({ id: d.id, role: data.role, content: data.content })
      })
      setMessages(rows)
    })
    return () => unsub()
  }, [db, noteId, chatId])

  const newChat = React.useCallback(async () => {
    if (!noteId) return null
    const ref = await addDoc(collection(db, "notes", noteId, "chats"), {
      title: "Untitled",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    setChatId(ref.id)
    return ref.id
  }, [db, noteId])

  const sendQuestion = React.useCallback(async (question: string) => {
    const q = question.trim()
    if (!q || !noteId) return
    setLoading(true)
    const activeChatId = chatId || (await newChat())
    if (!activeChatId) return
    const messagesCol = collection(db, "notes", noteId, "chats", activeChatId, "messages")
    await addDoc(messagesCol, { role: "user", content: q, createdAt: serverTimestamp() })
    const chatRef = doc(db, "notes", noteId, "chats", activeChatId)
    const chatSnap = await getDoc(chatRef)
    const currentTitle = chatSnap.data()?.title as string | undefined
    if (!currentTitle || currentTitle === "Untitled") {
      await setDoc(chatRef, { title: q.slice(0, 60), updatedAt: serverTimestamp() }, { merge: true })
    } else {
      await setDoc(chatRef, { updatedAt: serverTimestamp() }, { merge: true })
    }
    setInput("")
    try {
      const res = await fetch(`/api/notes/${noteId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, note: noteText ?? "", transcript: transcript ?? "" }),
      })
      const data = await res.json()
      const answer = (data?.answer ?? "") as string
      await addDoc(messagesCol, { role: "assistant", content: answer || "(No answer)", createdAt: serverTimestamp() })
      await setDoc(doc(db, "notes", noteId, "chats", activeChatId), { updatedAt: serverTimestamp() }, { merge: true })
    } catch (err) {
      await addDoc(messagesCol, { role: "assistant", content: "Sorry, something went wrong.", createdAt: serverTimestamp() })
    } finally {
      setLoading(false)
    }
  }, [noteId, noteText, transcript, chatId, db, newChat])

  const ask = React.useCallback(async () => {
    await sendQuestion(input)
  }, [input, sendQuestion])

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load suggestions when there are no messages (prefers Firestore cache; falls back to API and persists)
  React.useEffect(() => {
    const load = async () => {
      if (!noteId) return
      if (messages.length > 0) return setSuggestions(null)
      try {
        // Try Firestore first
        const suggRef = doc(db, 'notes', noteId, 'suggestions', 'default')
        const snap = await getDoc(suggRef)
        const items = (snap.exists() ? (snap.data() as any)?.items : null) as string[] | null
        if (items && Array.isArray(items) && items.length > 0) {
          setSuggestions(items)
          return
        }
        // Generate via API and persist
        const res = await fetch(`/api/notes/${noteId}/possibleQuestions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: noteText ?? '', transcript: transcript ?? '' }),
        })
        const data = await res.json()
        const qs: string[] = Array.isArray(data?.questions) ? data.questions : []
        setSuggestions(qs)
        await setDoc(suggRef, { items: qs, updatedAt: serverTimestamp() }, { merge: true })
      } catch {
        setSuggestions([])
      }
    }
    load()
  }, [noteId, noteText, transcript, messages.length])

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 border-l bg-background-primary transition-transform duration-300 ease-in-out",
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

          <div className="flex items-center gap-2 ml-auto">

            

            <AllChats
              noteId={noteId}
              value={chatId}
              onSelect={(id) => setChatId(id)}
              onDeleted={(removedId) => {
                if (chatId === removedId) {
                  setChatId(null)
                  setMessages([])
                }
              }}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => newChat()}>
                  <IconPlus className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                New Chat
              </TooltipContent>
            </Tooltip>

            
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-[16px] space-y-4">
          {messages.length === 0 ? (
            <div className="grid gap-2 ">
              {(suggestions && suggestions.length > 0) ? (
                suggestions.map((q, idx) => (
                  <button
                    key={idx}
                    className="text-left bg-sidebar rounded-md px-3 py-2 hover:bg-sidebar-accent hover:cursor-pointer"
                    onClick={() => sendQuestion(q)}
                  >
                    {q}
                  </button>
                ))
              ) : (
                <p className="text-muted-foreground/70">Thinking in possible questions…</p>
              )}
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}> 
                <div className={cn(
                  "max-w-[85%] rounded-xl px-4 py-3 break-words",
                  m.role === "user" ? "bg-sidebar" : "bg-background-primary"
                )}>
                  <MarkdownChat content={m.content?.trim?.() ?? m.content} />
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t items-center flex gap-2 p-3">
          <AiTools />
          <ChatInput value={input} onChange={setInput} onSubmit={ask} loading={loading} />
        </div>
      </div>
    </div>
  )
}


