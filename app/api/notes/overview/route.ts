import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Generates a plain-text overview (3–5 sentences) from provided raw text
export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    const source: string = (text || '').toString().trim()
    if (!source) {
      return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 })
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), { status: 500 })
    }
    const client = new OpenAI({ apiKey })

    const system = `You are an assistant that writes a single-paragraph overview in plain text.\n- 3 to 5 sentences.\n- Describe the topic and outcome clearly.\n- No markdown, no bullets, no headings, no emojis, no quotes.\n- Output plain text only.`
    const user = source.slice(0, 8000)

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.2,
      max_tokens: 220,
    })
    const overview = resp.choices[0]?.message?.content?.trim() || ''
    return new Response(JSON.stringify({ overview }), { status: 200 })
  } catch (err: any) {
    console.error('Overview API error', err)
    return new Response(JSON.stringify({ error: 'Failed to generate overview' }), { status: 500 })
  }
}


