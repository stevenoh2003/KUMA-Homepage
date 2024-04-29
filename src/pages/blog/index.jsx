import React, { useCallback, useState } from "react"
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Mathematics } from "@tiptap-pro/extension-mathematics"
import "katex/dist/katex.min.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteRight,
  faMinus,
  faSlash,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons"

export default function MyEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Mathematics],
    content: `
      <h1>
        This editor supports $\\LaTeX$ math expressions.
      </h1>
      <p>
        Try selecting some text for inline styles, or type some math: $a^2 + b^2 = c^2$.<br />
        Learn more about LaTeX at <a href="https://katex.org/docs/supported.html" target="_blank">katex.org</a>.
      </p>
    `,
  })

  const [isEditable, setIsEditable] = useState(true)

  const toggleEditing = useCallback(() => {
    setIsEditable(!isEditable)
    if (editor) {
      editor.setEditable(!isEditable)
    }
  }, [isEditable, editor])

  const containerStyles = {
    width: "100%", // Full width on smaller screens
    maxWidth: "50%", // Limit to 50% on larger screens
    margin: "0 auto", // Center the container
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }

  const bubbleMenuStyles = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    backgroundColor: "#007BFF",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  }

  if (!editor) {
    return null
  }

  return (
    <div style={containerStyles}>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isEditable}
            onChange={toggleEditing}
          />
          Editable
        </label>
      </div>
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          style={bubbleMenuStyles}
        >
          <FontAwesomeIcon
            icon={faBold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faItalic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faStrikethrough}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faCode}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faParagraph}
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faListUl}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faListOl}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faQuoteRight}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "is-active" : ""}
          />
          <FontAwesomeIcon
            icon={faMinus}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <FontAwesomeIcon
            icon={faSlash}
            onClick={() => editor.chain().focus().setHardBreak().run()}
          />
          <FontAwesomeIcon
            icon={faUndo}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          />
          <FontAwesomeIcon
            icon={faRedo}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          />
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
