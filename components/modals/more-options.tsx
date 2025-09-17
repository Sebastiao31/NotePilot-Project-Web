import React from 'react'
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconBrandYoutubeFilled, IconLetterCaseToggle, IconUpload, IconWorldWww, IconX } from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import YoutubeTabContent from '@/components/ui/youtube-tab-content'
import WebsiteTabContent from '@/components/ui/website-tab-content'
import UploadTabContent from '@/components/ui/upload-tab-content'
import TextTabContent from '@/components/ui/text-tab-content'

const MoreOptions = () => {
  return (
    <DialogHeader>
        <div className="flex justify-between items-center">
            <div>
                <DialogTitle>Create Note</DialogTitle>
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
                  Choose how you want to create your note.
            </DialogDescription>
            </div>

        <Separator className="my-4"/>

        <div className="w-full">
        <Tabs defaultValue="YouTube" >
            <TabsList className="w-full">
                <TabsTrigger value="YouTube">
                    <IconBrandYoutubeFilled/>
                    YouTube</TabsTrigger>
                <TabsTrigger value="Website">
                    <IconWorldWww/>
                    Website</TabsTrigger>
                <TabsTrigger value="Upload">
                    <IconUpload/>
                    Upload</TabsTrigger>
                <TabsTrigger value="Text">
                    <IconLetterCaseToggle/>
                    Text</TabsTrigger>
            </TabsList>
                <TabsContent value="YouTube">
                    <YoutubeTabContent/>
                </TabsContent>
                <TabsContent value="Website">
                    <WebsiteTabContent/>
                </TabsContent>
                <TabsContent value="Upload">
                    <UploadTabContent/>
                </TabsContent>
                <TabsContent value="Text">
                    <TextTabContent/>
                </TabsContent>
        </Tabs>
        </div>
    </DialogHeader>
  )
}

export default MoreOptions