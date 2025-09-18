export type HeadingItem = {
  depth: number
  text: string
  id: string
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractHeadings(content: string): HeadingItem[] {
  const lines = content.split('\n')
  const items: HeadingItem[] = []
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.+)$/.exec(line)
    if (!m) continue
    const depth = m[1].length
    const text = m[2].trim()
    const id = slugify(text)
    items.push({ depth, text, id })
  }
  return items
}


