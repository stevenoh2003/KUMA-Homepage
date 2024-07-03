import React from "react"
import { StyledEditor } from "src/components/Blog/StyledComponents"
import MenuBar from "src/components/Blog/MenuBar"
import { extensions, content } from "src/components/Blog/editorSettings"
import { EditorProvider } from "@tiptap/react"
import CreateBlog from "src/components/Blog/CreateBlog"
import Footer from "src/components/Footer"

const EditorPage = () => {
  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <StyledEditor> 
        <CreateBlog />
      </StyledEditor>
      <Footer />
    </div>
  )
}

export default EditorPage
