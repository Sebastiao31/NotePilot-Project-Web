"use client"

import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import { extractHeadings } from '@/lib/markdown'

type Props = {
  content: string
  showTOC?: boolean
}

const Callout: React.FC<{ type: 'TIP' | 'INFO' | 'WARNING'; title?: string; children?: React.ReactNode }>=({ type, title, children }) => {
  const cls = type === 'TIP' ? 'callout callout-tip' : type === 'INFO' ? 'callout callout-info' : 'callout callout-warning'
  return (
    <div className={`${cls} p-3 my-2`}>
      <div className="font-semibold  mb-1">{title ?? type}</div>
      <div className="text-md leading-6">{children}</div>
    </div>
  )
}

function transformCallouts(md: string): string {
  return md.replace(/(^|\n)> \[!(TIP|INFO|WARNING)\] ?([^\n]*)\n([\s\S]*?)(?=\n\n|$)/g, (_m, p1, kind, t, body) => {
    const title = t?.trim() || kind
    const inner = body.replace(/^>\s?/gm, '')
    return `${p1}<div data-callout="${kind}"><strong>${title}</strong>\n${inner}\n</div>`
  })
}

function transformLooseMath(md: string): string {
  const MATH_HINT = /(\\frac|\\cdot|\\times|\\sqrt|\\sum|\\int|\\pi|\\alpha|\\beta|\\gamma|[a-zA-Z]_\{?\d+\}?|\^\{[^}]+\}|\^[0-9]+)/
  return md.replace(/\[\s*([^\]\n]+?)\s*\]/g, (match, inner: string) => {
    if (/\$/.test(inner)) return match
    if (!MATH_HINT.test(inner)) return match
    return `$$${inner}$$`
  })
}

export default function MarkdownViewer({ content, showTOC=false }: Props) {
  const processed = useMemo(() => transformLooseMath(transformCallouts(content)), [content])
  const toc = useMemo(() => extractHeadings(content), [content])

  return (
    <div className="md-content  leading-7 text-[15px] md:text-[16px] space-y-6">
      {showTOC && toc.length > 0 && (
        <div className="mb-6 text-sm">
          <div className="font-medium mb-2">On this page</div>
          <ul className="space-y-1">
            {toc.map((h) => (
              <li key={h.id} className="truncate" style={{ paddingLeft: (h.depth - 1) * 12 }}>
                <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">{h.text}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <ReactMarkdown
        rehypePlugins={[rehypeSlug, rehypeRaw, rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          h1: ({node, ...props}) => <h1 className="mt-2 mb-6 text-3xl md:text-4xl font-bold tracking-tight" {...props} />,
          h2: ({node, ...props}) => <h2 className="mt-10 mb-4 text-2xl md:text-3xl font-semibold tracking-tight" {...props} />,
          h3: ({node, ...props}) => <h3 className="mt-8 mb-3 text-xl md:text-2xl font-semibold" {...props} />,
          p: ({node, ...props}) => <p className="my-4 text-lg text-muted-foreground leading-7" {...props} />,
          a: ({node, ...props}) => <a className="underline underline-offset-2 text-lg text-primary hover:opacity-90" {...props} />,
          ul: ({node, ...props}) => <ul className="my-4 text-lg list-disc pl-6 space-y-2" {...props} />,
          ol: ({node, ...props}) => <ol className="my-4 text-lg list-decimal pl-6 space-y-2" {...props} />,
          li: ({node, ...props}) => <li className="leading-7 text-lg" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="my-6 border-l-2 pl-4 italic font-semibold" {...props} />,
          hr: () => <div className="my-8 border-t" />,
          img: ({node, ...props}) => <img className="my-6 rounded-lg" {...props} />,
          code: ({node, inline, ...props}: any) => inline ? (
            <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em]" {...props} />
          ) : (
            <code className="block rounded bg-muted p-4 text-[0.9em] overflow-x-auto" {...props} />
          ),
          table: ({node, ...props}) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full text-md border-separate border-spacing-0" {...props} />
            </div>
          ),
          th: ({node, ...props}) => <th className="border border-border px-3 py-2 bg-muted/50 text-left font-medium" {...props} />,
          td: ({node, ...props}) => <td className="border border-border px-3 py-2 align-top" {...props} />,
          div: ({node, ...props}) => {
            const t = (props as any)["data-callout"]
            if (t === 'TIP' || t === 'INFO' || t === 'WARNING') {
              return <Callout type={t as any} title={undefined}>{(props as any).children}</Callout>
            }
            return <div {...props} />
          }
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  )
}

