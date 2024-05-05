import StarterKit from "@tiptap/starter-kit"

import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle from "@tiptap/extension-text-style"
import { Mathematics } from "@tiptap-pro/extension-mathematics"
import Image from "@tiptap/extension-image"
import Dropcursor from "@tiptap/extension-dropcursor"

import "katex/dist/katex.min.css"


import TextAlign from "@tiptap/extension-text-align"


export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Mathematics.configure({
    katexOptions: {
      displayMode: true, // Enable display mode
      throwOnError: false, // Prevent throwing errors
    },
  }),
  ,
  Image,
  Dropcursor,
]

export const content = `
  <h2>Write your blog here</h2>
  <p>this is a <em>basic</em> example of <strong>blog</strong>.</p>
  <ul>
    <li>That’s a bullet list with one …</li>
    <li>… or two list items.</li>
  </ul>
  <p>aligned equation</p>
  <p style="text-align: center"> <span class="Tiptap-mathematics-editor" style="">$\\begin{aligned}a + b &amp;= c \\\\ d + e &amp;= f \\\\g + h &amp;= i\\end{aligned}$</span></p>


  <p>In-line equation:  $\\theta = \\alpha + \\beta \\cdot \\gamma$
 </p>

  <pre><code class="language-css">print("Hello")</code></pre>
  <blockquote>Machine learning is wonderful</blockquote>
`
