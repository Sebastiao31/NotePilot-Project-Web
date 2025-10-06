import { JSONContent } from '@tiptap/react'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Mathematics from '@tiptap/extension-mathematics'

export function convertToHTML(doc: JSONContent | null | undefined): string {
  const safeDoc = doc && typeof doc === 'object' ? doc : { type: 'doc', content: [{ type: 'paragraph' }] }
  return generateHTML(safeDoc, [
    StarterKit,
    Underline,
    Highlight.configure({ multicolor: true }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Mathematics,
  ])
}


