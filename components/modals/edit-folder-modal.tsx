import React from 'react'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import EditFolderItem from '../ui/edit-folder-item'
import { Button } from '../ui/button'
import { useFolders } from '@/hooks/use-folders'
import { getFirebase } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const editFolderModal = () => {
  const { folders, loading } = useFolders()
  const { db } = getFirebase()
  const [pending, setPending] = React.useState<Record<string, { name?: string; color?: string }>>({})

  const onRowChange = (id: string, patch: { name?: string; color?: string }) => {
    setPending((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  const onSaveAll = async () => {
    const updates = Object.entries(pending)
    await Promise.all(updates.map(([id, p]) => updateDoc(doc(db, 'folders', id), {
      ...(p.name !== undefined ? { name: (p.name ?? '').trim() || 'Untitled' } : {}),
      ...(p.color !== undefined ? { color: p.color } : {}),
    })))
    setPending({})
    // Close the dialog after saving
    const closeBtn = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement | null
    closeBtn?.click()
  }
  return (
    <DialogContent className='max-h-[80vh] overflow-hidden'>
    <DialogHeader>
      <DialogTitle className='text-xl font-semibold'>Edit Folder</DialogTitle>
      <DialogDescription className='text-md text-muted-foreground'>Edit the folder name, color or delete it.</DialogDescription>
    
    <div className="my-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
      {loading ? (
        <div className='text-sm text-muted-foreground'>Loading folders…</div>
      ) : folders.length === 0 ? (
        <div className='text-sm text-muted-foreground'>You have no folders yet.</div>
      ) : (
        folders.map((f) => (
          <EditFolderItem key={f.id} id={f.id} name={pending[f.id]?.name ?? f.name} color={pending[f.id]?.color ?? f.color} onChange={onRowChange} />
        ))
      )}
    </div>
    
    
    </DialogHeader>

    <DialogFooter>
    <DialogClose asChild >
      <Button variant="outline">Cancel</Button>
    </DialogClose>
    <Button type="button"  onClick={onSaveAll} disabled={Object.keys(pending).length === 0}>Save changes</Button>
  </DialogFooter>

</DialogContent>
    

  )
}

export default editFolderModal