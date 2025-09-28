import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from "./button"
import { IconFolder } from "@tabler/icons-react"
import ColorPicker from "./color-picker"

type Props = {
  color?: string
  onChange?: (hex: string) => void
}

const changeFolderColor = ({ color, onChange }: Props) => {
  return (

    <Popover>
        <PopoverTrigger>
            <Button variant="outline" size="chat" >
                <IconFolder className="size-6" style={color ? { color } : undefined}/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-6">
            <ColorPicker value={color} onChange={onChange} />
        </PopoverContent>
    </Popover>
    
  )
}

export default changeFolderColor