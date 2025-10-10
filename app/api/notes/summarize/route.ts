import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { SUMMARIZE_PROMPT, TITLE_PROMPT } from '@/constants'
import { markdownToTiptapDoc } from '@/lib/markdownToTiptapDoc'

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
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUMMARIZE_PROMPT.system },
        { role: 'user', content: summaryPrompt },
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

    const doc = await markdownToTiptapDoc(summary)

    return new Response(JSON.stringify({ summary, title, overview, doc }), { status: 200 })
  } catch (err: any) {
    console.error('Summarize API error', err)
    return new Response(JSON.stringify({ error: 'Failed to summarize text' }), { status: 500 })
  }
}
