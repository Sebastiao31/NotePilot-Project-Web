"use client"

import * as React from 'react'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconX } from '@tabler/icons-react'
import { Separator } from '../ui/separator'
import Length from '../rewriteNote/length'
import AditionalInfo from '../rewriteNote/aditional-info'
import RewriteBtn from '../rewriteNote/rewrite.btn'
import Preview from '../rewriteNote/preview'

type Props = {
  noteId: string
  open: boolean
  onOpenChange: (v: boolean) => void
}

export default function Rewrite({ noteId, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
                <div>
                    <DialogTitle>Rewrite Note</DialogTitle>
                </div>
                <div>
                    <DialogClose asChild>
                        <Button size="icon" variant="ghost">
                            <IconX className="!size-5" />
                        </Button>
                    </DialogClose>
                </div>
            </div>
          </DialogHeader>
          <div className='-mx-6'>
          <Separator />
          </div>
          
        <div className='flex gap-6'>
            <div className='pt-4 gap-6 flex flex-col'>
                <div>
                <Length />
                </div>
                <div>
                    <AditionalInfo />
                </div>
                <div className='pt-4 mt-auto'>
                    <RewriteBtn />
                </div>
            </div>
            <div className='-mb-10'>
                <Separator orientation='vertical' className="-my-4 " />
            </div>
            <div className='py-4 min-w-0 flex-1'>
                <Preview noteId={noteId} />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}