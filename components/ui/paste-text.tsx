import React from 'react'
import { Textarea } from './textarea'

const pasteText = () => {
  return (
    <main>
        <div>
            <Textarea id="paste-text" placeholder="Paste you text here.." className='h-40'/>
        </div>
    </main>
  )
}

export default pasteText