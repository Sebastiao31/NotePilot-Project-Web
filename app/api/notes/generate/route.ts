import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { SUMMARIZE_PROMPT, TITLE_PROMPT } from '@/constants'
import { websiteTranscribe } from '@/lib/websiteTranscribe'
import { markdownToTiptapDoc } from '@/lib/markdownToTiptapDoc'

// Unified generation route
// body: { type: 'website', url: string } | { type: 'text', text: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const type = body?.type as 'website' | 'text'
    if (!type) {
      return new Response(JSON.stringify({ error: 'Missing type' }), { status: 400 })
    }

    let sourceText = ''

    if (type === 'website') {
      const url = body?.url
      if (!url || typeof url !== 'string') {
        return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 })
      }
      const { text } = await websiteTranscribe(url)
      sourceText = text
    } else if (type === 'text') {
      const text = body?.text
      if (!text || typeof text !== 'string') {
        return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 })
      }
      sourceText = text
    }

    if (!sourceText) {
      return new Response(JSON.stringify({ error: 'No content extracted' }), { status: 400 })
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), { status: 500 })
    }
    const client = new OpenAI({ apiKey })

    // Summarize
    const summaryPrompt = SUMMARIZE_PROMPT.userTemplate.replace('{text}', sourceText)
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

    // Title
    const titleResp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: TITLE_PROMPT.trim() },
        { role: 'user', content: sourceText.slice(0, 4000) },
      ],
      temperature: 0.2,
      max_tokens: 40,
    })
    const title = titleResp.choices[0]?.message?.content?.trim() || ''

    const doc = await markdownToTiptapDoc(summary)

    return new Response(
      JSON.stringify({
        summary,
        title,
        overview,
        transcript: type === 'website' ? sourceText : undefined,
        doc,
      }),
      { status: 200 }
    )
  } catch (err) {
    console.error('Generate API error', err)
    return new Response(JSON.stringify({ error: 'Failed to generate note' }), { status: 500 })
  }
}
