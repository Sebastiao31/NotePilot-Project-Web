import React from 'react'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

const Length = () => {
  return (
    <main>
        <div className='mb-4 text-lg font-semibold'>
            Length
        </div>

        <RadioGroup defaultValue="shorter">
            <CardOption id="shorter" value="shorter" title="Shorter" description="~70% of current length" />
            <CardOption id="same" value="same" title="Same Length" description="±10% of current length" />
            <CardOption id="longer" value="longer" title="Longer" description="~130% of current length" />
        </RadioGroup>

    </main>
  )
}

export default Length

function CardOption({ id, value, title, description }: { id: string; value: string; title: string; description: string }) {
    return (
        <div className={cn(
            "relative rounded-lg border px-4 py-3",
            "bg-dialog-background hover:bg-accent/70 transition-colors"
        )}>
            <Label htmlFor={id} className="block cursor-pointer">
                <div className="font-semibold mb-2">{title}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
            </Label>
            <RadioGroupItem value={value} id={id} className="absolute right-3 top-3" />
        </div>
    )
}