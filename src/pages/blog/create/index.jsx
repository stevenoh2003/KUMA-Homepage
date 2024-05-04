// src/pages/Editor.js
import React from "react"
import { StyledEditor } from "src/components/Blog/StyledComponents"
import MenuBar from "src/components/Blog/MenuBar"
import { extensions, content } from "src/components/Blog/editorSettings"
import { EditorProvider } from "@tiptap/react"
import CreateBlog from "src/components/Blog/CreateBlog"

const EditorPage = () => {
  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <StyledEditor>
        <div className="max-w-lg mx-auto space-y-3 sm:text-center">
          <h3 className="text-indigo-600 font-semibold">Create a Blog Post</h3>
          <p>Fill out the form below to share your ideas and stories!</p>
        </div>
        <hr
          style={{
            color: "black",
            backgroundColor: "black",
            height: 1,
          }}
        />
        <EditorProvider
          slotBefore={<MenuBar />}
          extensions={extensions}
          content={content}
        >
          <CreateBlog />
        </EditorProvider>
      </StyledEditor>
    </div>
  )
}

export default EditorPage
