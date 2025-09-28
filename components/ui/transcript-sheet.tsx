import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
  } from "@/components/ui/sheet"
import { IconChevronsRight, IconCopy, IconUpload } from "@tabler/icons-react"
import { Button } from "./button"
import { useParams } from "next/navigation"
import * as React from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { getFirebase } from "@/lib/firebase"

const TranscriptSheet = () => {
const params = useParams()
const noteId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)
const { db } = getFirebase()
const [noteType, setNoteType] = React.useState<string>("")
const [source, setSource] = React.useState<string>("")
const [transcript, setTranscript] = React.useState<string>("")

React.useEffect(() => {
  if (!noteId) return
  const ref = doc(db, "notes", noteId)
  const unsub = onSnapshot(ref, (snap) => {
    const data = snap.data() as any
    setNoteType(data?.type || "")
    setSource(data?.source || "")
    setTranscript(data?.transcript || "")
  })
  return () => unsub()
}, [db, noteId])

return (

    <SheetContent >
    
        <SheetHeader>
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <SheetClose asChild>
                    <Button variant="ghost" size="icon" >
                        <IconChevronsRight  className="size-5 text-accent-foreground/60" />
                    </Button>
                    </SheetClose>
                    <SheetTitle>Transcript</SheetTitle>
                </div>

                <div className="flex gap-2">
                    
                    <Button variant="ghost" size="icon" >
                        <IconUpload className="size-5" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(transcript || "")
                        const { toast } = await import("sonner")
                        toast.success("Transcript copied to clipboard")
                      } catch {
                        const { toast } = await import("sonner")
                        toast.error("Failed to copy transcript")
                      }
                    }}>
                        <IconCopy  className="size-5" />
                    </Button>

                </div>
        </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {transcript && (
            <div className="px-4 ">
              <div className="whitespace-pre-wrap text-[15px] leading-7 text-muted-foreground">
                {transcript}
              </div>
            </div>
          )}
        </div>

        <SheetFooter>
            {noteType === 'Website' && source ? (
              <Button asChild variant="outline" className="w-full" size="lg">
                <a href={source} target="_blank" rel="noopener noreferrer" className="">Open source link</a>
              </Button>
            ) : (
              <Button variant="outline" className="w-full">Link or upload</Button>
            )}
        </SheetFooter>
    </SheetContent>
    
    

)

}

export default TranscriptSheet