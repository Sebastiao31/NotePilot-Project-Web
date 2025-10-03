"use client"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconCards, IconPlus, IconLanguage, IconMicrophone2, IconRefresh, IconSitemap, IconTestPipe } from "@tabler/icons-react"
import Quiz from "@/components/modals/quiz"
import FlashcardsModal from "@/components/modals/flashcards"
import { useParams } from "next/navigation"
import { getFirebase } from "@/lib/firebase"
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore"
import * as React from "react"

const AiTools = () => {
  const params = useParams()
  const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)
  const [openQuiz, setOpenQuiz] = React.useState(false)
  const [existingQuizId, setExistingQuizId] = React.useState<string | null>(null)
  const [openFlash, setOpenFlash] = React.useState(false)
  const [existingFlashId, setExistingFlashId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!noteId) {
      setExistingQuizId(null)
      setExistingFlashId(null)
      return
    }
    const { db } = getFirebase()
    const q = query(collection(db, 'notes', noteId, 'quizzes'), orderBy('createdAt', 'desc'), limit(1))
    const unsub = onSnapshot(q, (snap) => {
      const first = snap.docs[0]
      setExistingQuizId(first ? first.id : null)
    })
    const q2 = query(collection(db, 'notes', noteId, 'flashcardSets'), orderBy('createdAt', 'desc'), limit(1))
    const unsub2 = onSnapshot(q2, (snap) => {
      const first = snap.docs[0]
      setExistingFlashId(first ? first.id : null)
    })
    return () => { unsub(); unsub2(); }
  }, [noteId])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="chat">
            <IconPlus className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>AI Tools</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setOpenQuiz(true)} disabled={!noteId}>
            <IconTestPipe className="size-5 text-accent-foreground " />
            {existingQuizId ? 'Take Quiz' : 'Create Quiz'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenFlash(true)} disabled={!noteId}>
            <IconCards className="size-5 text-accent-foreground " />
            {existingFlashId ? 'Open Flashcards' : 'Create Flashcards'}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconSitemap className="size-5 text-accent-foreground " />
            Create Mindmap
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <IconMicrophone2 className="size-5 text-accent-foreground mr-2" />
                Make Podcast</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>German</DropdownMenuItem>
                
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Note</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconRefresh className="size-5 text-accent-foreground " />
            Rewrite</DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <IconLanguage className="size-5 text-accent-foreground mr-2" />
                Translate</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Spanish</DropdownMenuItem>
                <DropdownMenuItem>French</DropdownMenuItem>
                <DropdownMenuItem>German</DropdownMenuItem>
                
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
        </DropdownMenuGroup>
        
      </DropdownMenuContent>
      {noteId && (
        <Quiz noteId={noteId} quizId={existingQuizId} open={openQuiz} onOpenChange={setOpenQuiz} />
      )}
      {noteId && (
        <FlashcardsModal noteId={noteId} setId={existingFlashId} open={openFlash} onOpenChange={setOpenFlash} />
      )}
    </DropdownMenu>
  )
}

export default AiTools