import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { generateJSON } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Mathematics from '@tiptap/extension-mathematics'
import type { JSONContent } from '@tiptap/react'

const extensions = [
  StarterKit,
  Underline,
  Highlight.configure({ multicolor: true }),
  Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Mathematics,
]

const mathHandlers = {
  math(h: any, node: any) {
    const latex = typeof node?.value === 'string' ? node.value : ''
    return h(node, 'div', { 'data-type': 'block-math', 'data-latex': latex }, [
      { type: 'text', value: latex },
    ])
  },
  inlineMath(h: any, node: any) {
    const latex = typeof node?.value === 'string' ? node.value : ''
    return h(node, 'span', { 'data-type': 'inline-math', 'data-latex': latex }, [
      { type: 'text', value: latex },
    ])
  },
}

const fallbackDoc: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

export async function markdownToTiptapDoc(markdown: string | null | undefined): Promise<JSONContent> {
  const content = typeof markdown === 'string' ? markdown : ''

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true, handlers: mathHandlers as any })
    .use(rehypeStringify)
    .process(content)

  const html = String(file)
  const doc = generateJSON(html, extensions) as JSONContent | null | undefined

  if (!doc || typeof doc !== 'object') {
    return fallbackDoc
  }

  return doc
}
