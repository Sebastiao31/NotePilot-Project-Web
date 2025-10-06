"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Mathematics from "@tiptap/extension-mathematics";
import {
    IconBold,
  IconItalic,
  IconUnderline,
  IconList,
  IconListNumbers,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useEditorBridge } from "./editor-bridge";
import BubbleMenuFloating from "./textTools/bubble-menu";
import { useEditMode } from "./edit-mode-provider";
import { getFirebase, serverTimestamp } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useUserData } from "@/hooks/use-user-data";

type Props = { initialDoc?: any | null; fallbackMarkdown?: string; editable?: boolean }

const Tiptap = ({ initialDoc, fallbackMarkdown, editable }: Props) => {
  const { setEditor, setSaveStatus, setLastSavedAt } = useEditorBridge()
  const { db } = getFirebase()
  const params = useParams()
  const noteId = useMemo(() => Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined) , [params])
  const { authUser } = useUserData()
  const initialSyncDoneRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastQueuedSerializedRef = useRef<string | null>(null)
  const lastSavedSerializedRef = useRef<string | null>(null)
  const lastAppliedInitialSerializedRef = useRef<string | null>(null)
  const { editModeEnabled } = useEditMode()
  const isEditable = typeof editable === 'boolean' ? editable : editModeEnabled

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Mathematics.configure({
        katexOptions: { output: 'html' }
      }),
    ],
    content: initialDoc || "<p></p>",
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none min-h-[250px]",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return
    editor.setEditable(isEditable)
  }, [editor, isEditable])

  // Debounced autosave: save noteDoc (json) and note (plain text summary)
  useEffect(() => {
    if (!editor) return

    const handleChange = () => {
      if (!noteId || !authUser) return
      // Skip autosave for the initial setContent after load, but only once user starts typing
      if (!initialSyncDoneRef.current) {
        // If the change is empty/no-op (e.g., formatting or initial mount), skip without flipping the flag
        const textNow = editor.getText().trim()
        if (textNow.length === 0) {
          return
        }
        initialSyncDoneRef.current = true
      }
      const serialized = JSON.stringify(editor.getJSON())
      // Only schedule a save if the content actually changed
      if (lastQueuedSerializedRef.current === serialized || lastSavedSerializedRef.current === serialized) {
        return
      }
      lastQueuedSerializedRef.current = serialized
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      setSaveStatus('saving')
      saveTimerRef.current = setTimeout(async () => {
        try {
          const text = editor.getText().trim()
          const ref = doc(db, 'notes', noteId)
          await setDoc(ref, {
            noteDoc: serialized,
            note: text,
            updatedAt: serverTimestamp(),
          }, { merge: true })
          lastSavedSerializedRef.current = serialized
          setSaveStatus('saved')
          setLastSavedAt(Date.now())
        } catch (e) {
          console.error('Autosave error', e)
          setSaveStatus('error')
        }
      }, 600)
    }

    // Only listen to document updates (excludes selection-only changes)
    editor.on('update', handleChange)
    return () => {
      editor.off('update', handleChange)
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [editor, db, noteId, authUser, setSaveStatus, setLastSavedAt])

  useEffect(() => {
    if (!editor) return
    if (!isEditable) return
    setEditor(editor)
    return () => setEditor(null)
  }, [editor, isEditable, setEditor])

  // Update editor content when a new initialDoc arrives from Firestore
  useEffect(() => {
    if (!editor) return
    if (!initialDoc) return
    try {
      const incomingSerialized = JSON.stringify(initialDoc)
      const currentSerialized = JSON.stringify(editor.getJSON())
      // If the editor already has the same content, skip re-applying to avoid cursor jumps
      if (incomingSerialized === currentSerialized || incomingSerialized === lastAppliedInitialSerializedRef.current) {
        return
      }
      // Apply new content from Firestore without emitting an update event to avoid feedback loops
      editor.commands.setContent(initialDoc, { emitUpdate: false })
      lastAppliedInitialSerializedRef.current = incomingSerialized
    } catch {
      // If serialization fails, fall back to setting content
      editor.commands.setContent(initialDoc, { emitUpdate: false })
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