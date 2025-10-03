import { NextRequest } from 'next/server'
import OpenAI from 'openai'
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
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 })
    }

    // Fetch the raw HTML/text
    const resp = await fetch(url, { headers: { 'User-Agent': 'NotePilotBot/1.0' } })
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch URL' }), { status: 400 })
    }
    const html = await resp.text()

    // Very simple text extraction
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12000)

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), { status: 500 })
    }
    const client = new OpenAI({ apiKey })

    const { SUMMARIZE_PROMPT, TITLE_PROMPT } = await import('@/constants')

    const summaryPrompt = SUMMARIZE_PROMPT.userTemplate.replace('{text}', text)
    const summaryResp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUMMARIZE_PROMPT.system },
        { role: 'user', content: summaryPrompt },
      ],
      temperature: 0.3,
    })
    const summary = summaryResp.choices[0]?.message?.content?.trim() || ''
    const sentences = summary
      .replace(/\n+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
    const overview = sentences.slice(0, 5).join(' ')

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

    return new Response(JSON.stringify({ summary, title, overview, transcript: text, doc }), { status: 200 })
  } catch (err) {
    console.error('Website summarize API error', err)
    return new Response(JSON.stringify({ error: 'Failed to summarize website' }), { status: 500 })
  }
}


