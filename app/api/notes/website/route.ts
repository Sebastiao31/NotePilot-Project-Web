import { NextRequest } from 'next/server'
import OpenAI from 'openai'

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

    return new Response(JSON.stringify({ summary, title, transcript: text }), { status: 200 })
  } catch (err) {
    console.error('Website summarize API error', err)
    return new Response(JSON.stringify({ error: 'Failed to summarize website' }), { status: 500 })
  }
}


