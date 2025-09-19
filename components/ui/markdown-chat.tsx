"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"

type Props = {
  content: string
}

export default function MarkdownChat({ content }: Props) {
  const text = typeof content === "string" ? content.trim() : content
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        h1: ({ node, ...props }) => <h1 className="mt-1 mb-2 text-[18px] font-semibold" {...props} />,
        h2: ({ node, ...props }) => <h2 className="mt-1 mb-2 text-[17px] font-semibold" {...props} />,
        h3: ({ node, ...props }) => <h3 className="mt-1 mb-2 text-[16px] font-semibold" {...props} />,
        p: ({ node, ...props }) => <p className="mt-1 mb-2 leading-7 text-[16px] text-foreground" {...props} />,
        a: ({ node, ...props }) => <a className="underline text-[16px] underline-offset-2 text-primary" {...props} />,
        ul: ({ node, ...props }) => <ul className="mt-1 mb-2 list-disc text-[16px] pl-5 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="mt-1 mb-2 list-decimal text-[16px] pl-5 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="leading-6 text-[16px]" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="mt-2 mb-2 border-l-2 pl-3 italic text-muted-foreground" {...props} />,
        hr: () => <div className="my-3 border-t" />,
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em]" {...props} />
          ) : (
            <code className="block rounded bg-muted my-2 p-3 text-[0.9em] overflow-x-auto" {...props} />
          ),
        table: ({ node, ...props }) => (
          <div className="my-3 overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-0" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border border-border px-2 py-1 bg-muted/50 text-left font-medium" {...props} />
        ),
        td: ({ node, ...props }) => <td className="border border-border px-2 py-1 align-top" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  )
}


