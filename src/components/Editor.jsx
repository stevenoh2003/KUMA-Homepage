// src/components/MyEditor.jsx
import React from "react"
import {
  BlockNoteView,
  useCreateBlockNote,
  BlockNoteSchema,
} from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/react/style.css"
import { LatexBlock } from "./LatexBlock"

export default function Editor() {
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      // Assuming you want to keep the default blocks
      ...BlockNoteSchema.defaults.blockSpecs,
      // Add your custom LaTeX block
      latex: LatexBlock,
    },
  })

  const editor = useCreateBlockNote({ schema })

  return <BlockNoteView editor={editor} />
}
