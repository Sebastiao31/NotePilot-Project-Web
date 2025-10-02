"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
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

const Tiptap = () => {
  const { setEditor } = useEditorBridge()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content: "<p>Hello World!</p>",
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

  if (!editor) {
    return null;
  }


  return (
    <>
      <div className="flex flex-col">
        <div className="w-full p-2">
          <h2>Editor</h2>
          <div className="flex space-x-2 mb-2">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              variant="outline"
              size="icon"
            >
              <IconBold />
            </Button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 ${
                editor.isActive("italic") ? "bg-gray-300" : ""
              }`}
            >
              <IconItalic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 ${
                editor.isActive("underline") ? "bg-gray-300" : ""
              }`}
            >
              <IconUnderline />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 ${
                editor.isActive("bulletList") ? "bg-gray-300" : ""
              }`}
            >
              <IconList />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 ${
                editor.isActive("orderedList") ? "bg-gray-300" : ""
              }`}
            >
              <IconListNumbers />
            </button>
          </div>
          <div className="relative">
            <BubbleMenuFloating />
            <EditorContent editor={editor} className="tiptap border rounded-lg p-2" />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Tiptap;