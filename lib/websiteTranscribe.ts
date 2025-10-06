export type WebsiteTranscription = {
  text: string
}

/**
 * Fetches a URL and extracts visible text content.
 * Performs minimal cleanup (remove scripts/styles, collapse whitespace).
 */
export async function websiteTranscribe(url: string): Promise<WebsiteTranscription> {
  const resp = await fetch(url, { headers: { 'User-Agent': 'NotePilotBot/1.0' } })
  if (!resp.ok) {
    throw new Error('Failed to fetch URL')
  }
  const html = await resp.text()

  // Simple text extraction by stripping tags and collapsing whitespace
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12000000)

  return { text }
}


