import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const noteFilter = () => {
  return (
    <div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder='Select a note' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='1'>Note 1</SelectItem>
            <SelectItem value='2'>Note 2</SelectItem>
            <SelectItem value='3'>Note 3</SelectItem>
          </SelectContent>
        </Select>
    </div>
  )
}

export default noteFilter