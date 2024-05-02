import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { StyledEditor } from "src/components/Blog/StyledComponents"
import { extensions, content } from "src/components/Blog/editorSettings"

const PostPage = () => {
  const router = useRouter()
  const { title } = router.query
  const [postContent, setPostContent] = useState({ title: "", content: "" })

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: "", // Initialize with empty content
      editable: true,
    },
    [postContent.content]
  ) // This second argument is a dependency array

  // Effect to load the post content
  useEffect(() => {
    if (title && editor) {
      fetch(`/api/posts/${encodeURIComponent(title)}`)
        .then((response) => response.json())
        .then((data) => {
          setPostContent(data)
          editor.commands.setContent(
            data.content || "<p>No content available</p>"
          )
        })
        .catch((error) => console.error("Error fetching post details:", error))
    }
  }, [title, editor])

  const updatePost = () => {
    if (!editor) return
    const htmlContent = editor.getHTML() // Get HTML content from the editor

    fetch(`/api/posts/updatePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content: htmlContent,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post updated:", data)
        router.push("/blog") // Adjust as needed for correct redirection
      })
      .catch((error) => console.error("Error updating post:", error))
  }

  if (!editor) {
    return null // Ensure editor is initialized before rendering the component
  }

  return (
    <>
      <div>
        <h1>{postContent.title}</h1>
        <StyledEditor>
          <EditorContent editor={editor} />
        </StyledEditor>
      </div>
      <div>
        <button onClick={updatePost}>Update Post</button>
      </div>
    </>
  )
}

export default PostPage
