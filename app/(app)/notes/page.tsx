"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useNotes } from '@/hooks/use-notes'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import MoreOptions from '@/components/modals/more-options'
import { IconPlus } from '@tabler/icons-react'

const NotesPage = () => {
  const router = useRouter()
  const { notes, loading } = useNotes()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (loading) return
    const items = notes ?? []
    if (items.length > 0) {
      router.replace(`/notes/${items[0].id}`)
    }
  }, [loading, notes, router])

  if (loading) return null

  const items = notes ?? []
  if (items.length === 0) {
    return (
      <div className="flex items-center mt-24 justify-center py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">This is so empty...</h2>
          <p className="text-muted-foreground">It looks like you don't have any notes yet. <br /> Start by creating one now!</p>
          <div className='mt-8'>
            <Button className="gap-2" onClick={() => setOpen(true)}>
              <IconPlus className="size-5" />
              Create note
            </Button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <MoreOptions />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return null
}

export default NotesPage