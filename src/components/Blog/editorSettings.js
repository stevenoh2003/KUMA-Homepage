import StarterKit from "@tiptap/starter-kit"

import { Color } from "@tiptap/extension-color"
import ListItem from "@tiptap/extension-list-item"
import TextStyle from "@tiptap/extension-text-style"
import { Mathematics } from "@tiptap-pro/extension-mathematics"
import "katex/dist/katex.min.css"


export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
  Mathematics,
]

export const content = `
  <h2>Hi there,</h2>
  <p>this is a <em>basic</em> example of <strong>tiptap</strong>.</p>
  <ul>
    <li>That’s a bullet list with one …</li>
    <li>… or two list items.</li>
  </ul>
  <p>Isn’t that great? And all of that is editable.</p>
  <pre><code class="language-css">body { display: none; }</code></pre>
  <blockquote>Wow, that’s amazing. Good work, boy! 👏<br>— Mom</blockquote>
`
