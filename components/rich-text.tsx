"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {
    IconBold,
  IconItalic,
  IconUnderline,
  IconList,
  IconListNumbers,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useEditorBridge } from "./editor-bridge";
import BubbleMenuFloating from "./textTools/bubble-menu";

type Props = { initialDoc?: any | null; fallbackMarkdown?: string }

const Tiptap = ({ initialDoc, fallbackMarkdown }: Props) => {
  const { setEditor } = useEditorBridge()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialDoc || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) setEditor(editor)
    return () => setEditor(null)
  }, [editor, setEditor])

  // Update editor content when a new initialDoc arrives from Firestore
  useEffect(() => {
    if (!editor) return
    if (initialDoc) {
      editor.commands.setContent(initialDoc)
    }
  }, [editor, initialDoc])

  if (!editor) {
    return null;
  }


  return (
    <>
      <div className="flex flex-col">
        <div className="w-full p-2">
          
          <div className="relative">
            <BubbleMenuFloating />
            <EditorContent editor={editor} className="tiptap" />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Tiptap;