// src/components/KaTeXWrapper.jsx
import React from "react"
import "katex/dist/katex.min.css"
import { InlineMath, BlockMath } from "react-katex"

export const KaTeXWrapper = ({ content, displayMode }) => {
  if (displayMode) {
    return <BlockMath math={content} />
  } else {
    return <InlineMath math={content} />
  }
}
