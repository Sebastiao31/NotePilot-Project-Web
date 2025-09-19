import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { CHAT_SYSTEM_PROMPT } from '@/constants'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { question, note, transcript } = await req.json()
    if (!params?.id) {
      return new Response(JSON.stringify({ error: 'Missing note id in path' }), { status: 400 })
    }
    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing question' }), { status: 400 })
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
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: CHAT_SYSTEM_PROMPT },
      { role: 'user', content: `${context}\nQuestion: ${question}` },
    ]

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.2,
    })

    const answer = completion.choices[0]?.message?.content?.trim() || ''
    return new Response(JSON.stringify({ answer }), { status: 200 })
  } catch (err) {
    console.error('Notes chat API error', err)
    return new Response(JSON.stringify({ error: 'Failed to generate answer' }), { status: 500 })
  }
}


