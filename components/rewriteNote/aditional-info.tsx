import React from 'react'
import { Textarea } from '../ui/textarea'

const AditionalInfo = () => {
  return (
    <main>
        <div className='mb-4 text-lg font-semibold'>
            Additional Instructions (optional)
        </div>
        <div>
            <Textarea
                placeholder='Enter additional instructions...'
                className="max-h-40 h-30"
                
            />
        </div>
    </main>
  )
}

export default AditionalInfo