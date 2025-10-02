import React from 'react'
import { Switch } from "@/components/ui/switch"
import { useEditMode } from "@/components/edit-mode-provider"

const editModeToogle = () => {
  const { editModeEnabled, setEditModeEnabled } = useEditMode()
  return (
    <main>
        <div className='flex items-center gap-3 px-4 '>
            <p className="text-md font-semibold text-primary">Edit Mode:</p>
            <Switch checked={editModeEnabled} onCheckedChange={(v) => setEditModeEnabled(Boolean(v))} className='hover:cursor-pointer'/>
        </div>
    </main>
  )
}

export default editModeToogle