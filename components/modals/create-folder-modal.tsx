"use client"

import React from 'react'
import { DialogClose, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { IconX } from '@tabler/icons-react'
import { Separator } from '../ui/separator'
import ColorPicker from '../ui/color-picker'
import FolderNameInput from '../ui/folder-name-input'
import CreateFolderBtn from '../ui/create-folder-btn'
import { getFirebase, serverTimestamp } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useUserData } from '@/hooks/use-user-data'

const createFolderModal = () => {
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState<string>("#0A7BFF")
  const [saving, setSaving] = React.useState(false)
  const { authUser } = useUserData()

  const handleCreate = async () => {
    if (!authUser) return
    if (!name.trim()) return
    setSaving(true)
    try {
      const { db } = getFirebase()
      await addDoc(collection(db, 'folders'), {
        name: name.trim(),
        color,
        userId: authUser.uid,
        createdAt: serverTimestamp(),
      })
      // Optionally reset form
      setName("")
      // Close dialog programmatically (works even when triggered via Enter)
      document.getElementById('create-folder-close')?.click()
    } catch (e) {
      console.error('Failed to create folder', e)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!saving && name.trim()) {
        void handleCreate()
      }
    }
  }

  return (
    <DialogHeader>
        <div className="flex justify-between items-center">
            <div>
                <DialogTitle>Create Folder</DialogTitle>
            </div>
            <div>
                <DialogClose asChild>
                    <Button size="icon" variant="ghost">
                        <IconX className="!size-5" />
                    </Button>
                </DialogClose>
            </div>
        </div>
        <div className="flex justify-start">
            <DialogDescription>
                Organize your notes by topic, project or purpose.
            </DialogDescription>
            </div>


            <div className='flex justify-center py-12'>
                <ColorPicker value={color} onChange={setColor} />
            </div>

            <div className='flex flex-col gap-2'>
                <FolderNameInput value={name} onChange={setName} onKeyDown={handleKeyDown} />
            </div>


            <div className="mt-4">
              <DialogClose asChild>
                <CreateFolderBtn onClick={handleCreate} disabled={saving || !name.trim()}>
                  Create Folder
                </CreateFolderBtn>
              </DialogClose>
            </div>

            {/* Hidden close control for programmatic closing on Enter */}
            <DialogClose id="create-folder-close" className="hidden" />

    </DialogHeader>
  )
}

export default createFolderModal