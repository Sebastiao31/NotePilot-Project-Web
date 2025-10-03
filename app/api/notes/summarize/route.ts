import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { SUMMARIZE_PROMPT, TITLE_PROMPT } from '@/constants'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
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

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 })
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), { status: 500 })
    }

    const client = new OpenAI({ apiKey })

    // Summary
    const summaryPrompt = SUMMARIZE_PROMPT.userTemplate.replace('{text}', text)
    const summaryResp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SUMMARIZE_PROMPT.system },
        { role: "user", content: summaryPrompt },
      ],
      temperature: 0.3,
    })
    const summary = summaryResp.choices[0]?.message?.content?.trim() || ''
    // Extract overview: first 3-5 sentences from summary
    const sentences = summary
      .replace(/\n+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
    const overview = sentences.slice(0, 5).join(' ')

    // Title
    const titleResp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: TITLE_PROMPT.trim() },
        { role: 'user', content: text.slice(0, 4000) },
      ],
      temperature: 0.2,
      max_tokens: 40,
    })
    const title = titleResp.choices[0]?.message?.content?.trim() || ''

    // Convert Markdown summary -> HTML -> TipTap JSON (using app schema)
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex)
      .use(rehypeStringify)
      .process(summary || '')
    const summaryHtml = String(file)
    const doc = generateJSON(summaryHtml, [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Mathematics,
    ])

    return new Response(JSON.stringify({ summary, title, overview, doc }), { status: 200 })
  } catch (err: any) {
    console.error('Summarize API error', err)
    return new Response(JSON.stringify({ error: 'Failed to summarize text' }), { status: 500 })
  }
}


