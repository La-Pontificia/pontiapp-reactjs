import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  AppsListFilled,
  TextBoldFilled,
  TextItalicFilled,
  TextNumberListLtrFilled
} from '@fluentui/react-icons'
import { cn } from '~/utils'
import React from 'react'

const MenuBar = ({ disabled = false }: { disabled?: boolean }) => {
  const { editor } = useCurrentEditor()

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  if (!editor) {
    return null
  }

  if (disabled) return null

  return (
    <div className="flex flex-wrap dark:bg-stone-600/30 bg-stone-100 rounded-lg mb-2 w-fit [&>button]:p-1.5 [&>button]:flex [&>button]:items-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        data-active={editor.isActive('bold') ? '' : undefined}
        className="data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        <TextBoldFilled fontSize={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        data-active={editor.isActive('italic') ? '' : undefined}
        className="data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        <TextItalicFilled fontSize={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        data-active={editor.isActive('paragraph') ? '' : undefined}
        className="font-semibold text-base data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        P
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        data-active={editor.isActive('heading', { level: 1 }) ? '' : undefined}
        className="font-semibold text-base data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        data-active={editor.isActive('heading', { level: 2 }) ? '' : undefined}
        className="font-semibold text-base data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        data-active={editor.isActive('heading', { level: 3 }) ? '' : undefined}
        className="font-semibold text-base data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        data-active={editor.isActive('bulletList') ? '' : undefined}
        className="data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        <AppsListFilled fontSize={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        data-active={editor.isActive('orderedList') ? '' : undefined}
        className="data-[active]:opacity-100 data-[active]:dark:text-blue-500 data-[active]:text-blue-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md"
      >
        <TextNumberListLtrFilled fontSize={18} />
      </button>
    </div>
  )
}

const TextEditor = ({
  defaultValue = '',
  onChange,
  placeholder = 'Enter text here',
  className = '',
  disabled
}: {
  defaultValue?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}) => {
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    }),
    Placeholder.configure({
      placeholder
    })
  ]

  return (
    <EditorProvider
      slotBefore={<MenuBar disabled={disabled} />}
      extensions={extensions}
      content={defaultValue}
      onUpdate={(content) => onChange?.(content.editor.getHTML())}
      injectCSS
      editorContainerProps={{
        className: cn(
          'border dark:border-stone-700 dark:border-b-stone-400 border-b-stone-600 border-stone-300 rounded-md p-3 [&>div]:outline-none',
          className
        )
      }}
    />
  )
}

export default TextEditor
