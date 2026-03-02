'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState, useRef } from 'react'
import { Bold, Italic, Strikethrough, Code } from 'lucide-react'

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-border bg-card rounded-t-xl p-2 flex gap-2 flex-wrap items-center">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          editor.chain().focus().toggleBold().run()
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          editor.chain().focus().toggleItalic().run()
        }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          editor.chain().focus().toggleStrike().run()
        }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded-md transition-colors ${editor.isActive('strike') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'}`}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-border mx-2" />

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          editor.chain().focus().toggleCodeBlock().run()
        }}
        className={`p-2 rounded-md transition-colors ${editor.isActive('codeBlock') ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-foreground'}`}
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>
    </div>
  )
}

interface EditorProps {
  text?: string;
  storageId?: string; // Kept in interface to prevent TS errors from parent components
  onChange?: (html: string) => void;
}

const extensions = [StarterKit]

const Tiptap = ({ text, onChange }: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const lastUpdatedText = useRef<string | undefined>(text);

  const editor = useEditor({
    extensions,
    content: text || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose w-full! max-w-full focus:outline-none min-h-[150px] max-h-[30rem] overflow-y-auto p-4 bg-background border border-t-0 border-border rounded-b-xl text-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastUpdatedText.current = html;
      if (onChange) {
        onChange(html);
      }
    }
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && isMounted && text !== undefined) {
      if (text !== lastUpdatedText.current) {
        editor.commands.setContent(text);
        lastUpdatedText.current = text;
      }
    }
  }, [editor, text, isMounted])

  if (!isMounted || !editor) return null;

  return (
    <div className="flex flex-col shadow-sm rounded-xl">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap