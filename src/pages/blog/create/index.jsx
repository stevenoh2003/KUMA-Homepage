import React from "react"
import { EditorProvider } from "@tiptap/react"
import { StyledEditor } from "src/components/Blog/StyledComponents"
import MenuBar from "src/components/Blog/MenuBar"
import { extensions, content } from "src/components/Blog/editorSettings"

const Editor = () => (
  <StyledEditor>
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
    ></EditorProvider>
  </StyledEditor>
)

export default Editor
