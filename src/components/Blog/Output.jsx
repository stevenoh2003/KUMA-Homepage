import React, { useState } from "react"
import { useCurrentEditor } from "@tiptap/react"

const Output = () => {
  const { editor } = useCurrentEditor()
  const [s3Key, setS3Key] = useState(null)

  const handlePost = async (isNew) => {
    if (!editor) return
    const htmlContent = editor.getHTML() // Generate HTML from the editor

    fetch("/api/posts/postHandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Example Titlettwithhtmlt", // Modify as needed
        content: htmlContent, // Send HTML content instead of JSON
        s3Key: s3Key,
        isNew: isNew,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data)
        if (isNew) setS3Key(data.s3_key) // Update the S3 key state if new post
      })
      .catch((error) => console.error("Error:", error))
  }

  return (
    <div>
      <button onClick={() => handlePost(true)}>Create New Post</button>
      <button onClick={() => handlePost(false)} disabled={!s3Key}>
        Update Post
      </button>
      <div>Output</div>
    </div>
  )
}

export default Output
