import React from "react"
import { StyledEditor } from "src/components/Blog/StyledComponents"
import MenuBar from "src/components/Blog/MenuBar"
import { extensions, content } from "src/components/Blog/editorSettings"

import { EditorProvider } from "@tiptap/react"
import Output from "src/components/Blog/Output"
import { useRouter } from "next/router"

const Editor = () => {
    const router = useRouter()



  return (
    <StyledEditor>
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
      >
      <Output />
      </EditorProvider>
    </StyledEditor>
  )

}

export default Editor
