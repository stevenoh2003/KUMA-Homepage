import {
  Block,
  BlockNoteEditor,
  PartialBlock,
  defaultBlockSchema,
  DefaultBlockSchema,
  defaultProps,
  InlineContent as InlineContentType,
} from "@blocknote/core"
import {
  BlockNoteView,
  defaultReactSlashMenuItems,
  ReactSlashMenuItem,
  InlineContent as InlineContentComponent,
  useBlockNote,
  createReactBlockSpec,
} from "@blocknote/react"
import "@blocknote/core/style.css"
import { BiMath } from "react-icons/bi"
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"

const inlineContentToPlainText = (
  inlineContent: InlineContentType[]
): string => {
  let plainText = ""

  if (inlineContent.length === 0) {
    return plainText
  }

  for (const content of inlineContent) {
    if (content.type === "link") {
      for (const linkContent of content.content) {
        plainText += linkContent.text
      }
    } else {
      plainText += content.text
    }
  }

  return plainText
}

const mathBlock = createReactBlockSpec({
  type: "math-block",
  containsInlineContent: true,
  render: ({ block }) => (
    <div>
      <InlineContentComponent />
      <Latex>{inlineContentToPlainText(block.content)}</Latex>
    </div>
  ),
  propSchema: {
    ...defaultProps,
  },
})

const insertMathBlock = new ReactSlashMenuItem(
  "Insert Equation",
  (editor) =>
    editor.insertBlocks(
      [{ type: "math-block" }],
      editor.getTextCursorPosition().block,
      "after"
    ),
  ["math", "equation", "latex"],
  "Other",
  <BiMath />,
  "Used to display an equation from LaTeX"
)

const customSchema = {
  ...defaultBlockSchema,
  "math-block": mathBlock,
}

export default function App() {
  const editor: BlockNoteEditor<typeof customSchema> = useBlockNote({
    blockSchema: customSchema,
    slashCommands: [...defaultReactSlashMenuItems, insertMathBlock],
    initialContent: [{ type: "math-block", content: "$e=mc^2$" }],
  })

  // Renders the editor instance.
  return <BlockNoteView editor={editor} />
}
