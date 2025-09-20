import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const SYSTEM = String.raw`
You suggest exactly THREE short, helpful questions a user might ask about the provided note.

Rules:
- Base suggestions strictly on the provided content.
- Match the language of the note.
- Keep each question concise (max ~80 characters).
- Avoid duplicates and generic questions.
- Output the three questions as plain lines without numbering or extra text.
`.trim()

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { note, transcript } = await req.json()
    if (!params?.id) {
      return new Response(JSON.stringify({ error: 'Missing note id in path' }), { status: 400 })
    }
    if (typeof note !== 'string' || typeof transcript !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing note or transcript' }), { status: 400 })
    }

    const apiKey = process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OpenAI API key' }), { status: 500 })
    }

    const client = new OpenAI({ apiKey })
    const context = `NOTE (primary):\n\n${note || '(empty)'}\n\n---\nTRANSCRIPT (if any):\n\n${transcript || '(empty)'}\n\n`

    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `${context}\nProvide exactly three suggested questions.` },
      ],
    })

    const text = resp.choices[0]?.message?.content?.trim() || ''
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.replace(/^[-*\d.\)\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, 3)

    return new Response(JSON.stringify({ questions: lines }), { status: 200 })
  } catch (err) {
    console.error('PossibleQuestions API error', err)
    return new Response(JSON.stringify({ error: 'Failed to generate suggestions' }), { status: 500 })
  }
}


