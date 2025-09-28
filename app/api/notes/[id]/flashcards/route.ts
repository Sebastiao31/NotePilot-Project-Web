import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.NEXT_OPENAI_API || process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json()

    const prompt = `Create a study flashcard set (12-20 cards) based strictly on the note below. Use the note's language.
Output strict JSON only (no markdown, no prose):
{"cards":[{"front":"...","back":"..."} ...]}

Rules:
- Keep front concise (term, question, or prompt). Use clear wording.
- Put definitions, answers, steps, or key explanation on back.
- Prefer one fact/idea per card; avoid duplication across cards.
- If math appears, use LaTeX delimiters:
  - Inline: $...$
  - Display: $$...$$ (own line only when truly needed)
- Avoid code fences. Use LaTeX only for math.
- No extra keys; only "cards" at top level with an array of objects containing only "front" and "back".

Title: ${title}
Content:
${content}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You produce compact JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' } as any,
    })

    const raw = completion.choices[0]?.message?.content || '{"cards":[]}'
    const parsed = JSON.parse(raw)
    return NextResponse.json({ cards: parsed.cards || [] })
  } catch (e) {
    console.error('generate-flashcards failed', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}


