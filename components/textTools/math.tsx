"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useEditorBridge } from '../editor-bridge'
import { IconMathFunctionY } from '@tabler/icons-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import katex from 'katex'

const MathTool = () => {
  const { editor } = useEditorBridge()
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState<'inline' | 'block'>('inline')
  const [latex, setLatex] = React.useState('')

  const openEditor = () => {
    if (!editor) return
    const inlineAttrs = editor.getAttributes('inlineMath')
    const blockAttrs = editor.getAttributes('blockMath')
    if (inlineAttrs?.latex) {
      setMode('inline')
      setLatex(inlineAttrs.latex)
    } else if (blockAttrs?.latex) {
      setMode('block')
      setLatex(blockAttrs.latex)
    } else {
      setMode('inline')
      setLatex('\\frac{a}{b}')
    }
    setOpen(true)
  }

  const onInsertOrUpdate = () => {
    if (!editor || !latex.trim()) {
      setOpen(false)
      return
    }
    const chain = editor.chain().focus()
    if (mode === 'inline') {
      const inInline = !!editor.getAttributes('inlineMath')?.latex
      if (inInline) {
        chain.updateInlineMath({ latex }).run()
      } else {
        chain.insertInlineMath({ latex }).run()
      }
    } else {
      const inBlock = !!editor.getAttributes('blockMath')?.latex
      if (inBlock) {
        chain.updateBlockMath({ latex }).run()
      } else {
        chain.insertBlockMath({ latex }).run()
      }
    }
    setOpen(false)
  }

  const previewHtml = React.useMemo(() => {
    try {
      return katex.renderToString(latex || '', {
        throwOnError: false,
        displayMode: mode === 'block',
      })
    } catch {
      return '<span style="color: var(--destructive)">Invalid LaTeX</span>'
    }
  }, [latex, mode])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="chat"
          variant="ghost"
          disabled={!editor}
          aria-label="Insert or edit math"
          onClick={openEditor}
          title="Insert or edit math"
        >
          <IconMathFunctionY className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 sm:w-96 p-3">
        <div className="text-sm mb-2 font-medium">Math</div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} >
          <TabsList className="h-10 p-1">
            <TabsTrigger value="inline">Inline</TabsTrigger>
            <TabsTrigger value="block">Block</TabsTrigger>
          </TabsList>
          <TabsContent value="inline">
            <Textarea
              value={mode === 'inline' ? latex : latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder={'\\frac{a}{b}'}
              className="min-h-24"
            />
          </TabsContent>
          <TabsContent value="block">
            <Textarea
              value={mode === 'block' ? latex : latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder={'\\int_0^1 x^2\\,dx'}
              className="min-h-24"
            />
          </TabsContent>
        </Tabs>
        <div className="mt-2 text-xs text-muted-foreground">Preview</div>
        <div className="mt-1 border rounded-md p-2 overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button  onClick={onInsertOrUpdate}>{editor?.getAttributes('inlineMath')?.latex || editor?.getAttributes('blockMath')?.latex ? 'Update' : 'Insert'}</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MathTool


