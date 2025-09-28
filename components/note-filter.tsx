
"use client"

import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconFolder, IconFolderPlus, IconListDetails } from '@tabler/icons-react'
import { Button } from './ui/button'
import CreateFolder from './ui/create-folder'
import EditFolder from './ui/edit-folder'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { SidebarMenuButton } from './ui/sidebar'
import CreateFolderModal from './modals/create-folder-modal'
import EditFolderModal from './modals/edit-folder-modal'
import { useFolders } from '@/hooks/use-folders'
import { useNoteSidebar } from './note-provider'

const noteFilter = () => {
  const { folders } = useFolders()
  const { selectedFolder, setSelectedFolder } = useNoteSidebar()
  const selectedValue = React.useMemo(() => {
    if (!selectedFolder) return 'view-all'
    const f = folders.find((x) => x.name === selectedFolder)
    return f ? f.id : 'view-all'
  }, [selectedFolder, folders])
  return (
    <div>
        <Select value={selectedValue} onValueChange={(value) => {
          if (value === 'view-all') setSelectedFolder(null)
          else {
            const folder = folders.find((f) => f.id === value)
            setSelectedFolder(folder ? folder.name : null)
          }
        }} >
          <SelectTrigger className='bg-background-primary border-none -ml-1 font-semibold max-w-[180px] sm:max-w-[220px] truncate dark:bg-background-primary'>
            <SelectValue placeholder='Select a folder' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Folders</SelectLabel>

              <SelectItem value='view-all'>
                All notes
              </SelectItem>
              {folders.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  <IconFolder className="size-5" style={{ color: f.color }} />
                  {f.name}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              
              <Dialog>
                <DialogTrigger asChild>
                  <CreateFolder />
                </DialogTrigger>
                <DialogContent>
                  <CreateFolderModal />
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                    <EditFolder />
                </DialogTrigger>
                <DialogContent>
                    <EditFolderModal />
                </DialogContent>
              </Dialog>
              
            </SelectGroup>
          </SelectContent>
        </Select>
    </div>
  )
}

export default noteFilter