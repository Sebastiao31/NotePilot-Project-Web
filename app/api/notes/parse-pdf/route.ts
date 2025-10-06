import { pdf } from 'pdf-parse'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }

    // Enforce max size: 10 MB
    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) {
      return Response.json({ error: 'PDF exceeds 10 MB limit' }, { status: 413 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const data = await (pdf as unknown as (buf: Buffer, opts?: any) => Promise<any>)(buffer, { max: 0 })

    return Response.json({ text: data.text ?? '', numpages: (data as any)?.numpages ?? null })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}


