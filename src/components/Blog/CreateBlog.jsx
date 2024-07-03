import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEditor, EditorContent } from "@tiptap/react"
import { extensions, content } from "src/components/Blog/editorSettings"
import MenuBar from "src/components/Blog/UpdateMenuBar"
import "katex/dist/katex.min.css"

const predefinedTags = ["Paper Note", "AI", "Robotics"]

const CreateBlog = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [s3Key, setS3Key] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [notionLink, setNotionLink] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [tags, setTags] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const [useNotion, setUseNotion] = useState(false)
  const [editable, setEditable] = useState(true)

  const editor = useEditor({
    extensions,
    content,
    editable: true,
  })

  useEffect(() => {
    const canEdit = editable === null ? false : editable

    if (editor) {
      editor.setEditable(canEdit)
    }
  }, [editor, editable])

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files[0])
  }

  const handleTagChange = (event) => {
    const { value, checked } = event.target
    setTags((prevTags) =>
      checked ? [...prevTags, value] : prevTags.filter((tag) => tag !== value)
    )
  }

  const validateForm = async () => {
    if (!title.trim()) {
      setErrorMessage("Title is required.")
      return false
    }

    const response = await fetch(
      `/api/posts/checkTitle?title=${encodeURIComponent(title)}`
    )
    const result = await response.json()

    if (response.ok && result.exists) {
      setErrorMessage("The title has already been used.")
      return false
    }

    return true
  }

  const extractNotionId = (url) => {
    const regex = /https:\/\/(?:\S+\.)?notion\.site\/(\S+)\??/
    const match = url.match(regex)
    return match ? match[1] : ""
  }

  const sendDiscordMessage = async (title, username, postUrl, description) => {
    console.log("Sending message to Discord")
    console.log("Channel ID:", process.env.NEXT_PUBLIC_DISCORD_BLOG_CHANNEL_ID)
    console.log("Bot Token:", process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN)

    const messageDescription = description
      ? `Description: ${description}`
      : "Find out more by going to the link"

    try {
      const response = await fetch("/api/sendDiscordMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          DISCORD_BLOG_CHANNEL_ID:
            process.env.NEXT_PUBLIC_DISCORD_BLOG_CHANNEL_ID,
          DISCORD_BOT_TOKEN: process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN,
          message: `New blog post published by ${username}: "${title}"\n${messageDescription}\nRead more at: ${postUrl}`,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        console.error("Error sending message to Discord:", data)
      } else {
        console.log("Message sent to Discord successfully:", data)
      }
    } catch (error) {
      console.error("Error during fetch operation:", error)
    }
  }

  const handlePost = async (isNew) => {
    const isFormValid = await validateForm()
    if (!isFormValid || !session) {
      return
    }

    let postContent = null
    if (useNotion) {
      postContent = extractNotionId(notionLink)
      if (!postContent) {
        setErrorMessage("Invalid Notion link provided.")
        return
      }
    } else {
      if (editor) {
        postContent = editor.getHTML()
        if (postContent.trim() === "") {
          setErrorMessage("Content or Notion link is required.")
          return
        }
      }
    }

    let thumbnailUrl = ""

    if (thumbnail) {
      try {
        const presignedResponse = await fetch("/api/posts/uploadThumbnail", {
          method: "POST",
          body: new URLSearchParams({
            filename: thumbnail.name,
            filetype: thumbnail.type,
          }),
        })

        const presignedData = await presignedResponse.json()

        const formData = new FormData()
        Object.keys(presignedData.presignedPost.fields).forEach((key) => {
          formData.append(key, presignedData.presignedPost.fields[key])
        })
        formData.append("file", thumbnail)

        const s3Response = await fetch(presignedData.presignedPost.url, {
          method: "POST",
          body: formData,
        })

        if (s3Response.ok) {
          thumbnailUrl = presignedData.thumbnailUrl
        } else {
          console.error("Thumbnail upload failed to S3")
          setErrorMessage("Thumbnail upload failed")
          return
        }
      } catch (error) {
        console.error("Error getting presigned URL or uploading to S3:", error)
        setErrorMessage("Error getting presigned URL or uploading")
        return
      }
    }

    try {
      const response = await fetch("/api/posts/postHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          content: postContent,
          notionLink: notionLink.trim() || null,
          s3Key: s3Key || null,
          isNew,
          userId: session.user.id,
          thumbnailUrl,
          isPublic,
          tags,
        }),
      })

      const data = await response.json()

      console.log("API Response:", data)

      if (response.ok) {
        console.log("Post created successfully:", data)
        if (isNew && data.s3_key) {
          setS3Key(data.s3_key)
        }
        setErrorMessage("")

        const postUrl = `https://www.kuma2024.tech/blog/${encodeURIComponent(
          title
        )}`
        console.log("Sending message to Discord with:", {
          title,
          username: session.user.name,
          postUrl,
        })
        if (isPublic == true) await sendDiscordMessage(title, session.user.name, postUrl, description)

        router.push("/blog")
      } else {
        console.error("Error creating post:", data)
        setErrorMessage(
          data.message ||
            "An unexpected error occurred while creating the post."
        )
      }
    } catch (error) {
      console.error("Error during fetch operation:", error)
      setErrorMessage("An unexpected error occurred while creating the post.")
    }
  }

  return (
    <main className="py-8">
      <div className="max-w-screen-xl mx-auto text-gray-600">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
            Create a Blog Post
          </h1>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-lg font-medium">Blog Title</label>
              <input
                type="text"
                placeholder="Enter your blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-lg font-medium">Description</label>
              <input
                type="text"
                placeholder="Enter a short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
              />
            </div>
            {errorMessage && (
              <p className="text-red-600 text-sm">{errorMessage}</p>
            )}
            <div>
              <label className="block text-lg font-medium">
                Notion Link or Editor Content
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  name="contentType"
                  checked={useNotion}
                  onChange={() => setUseNotion(true)}
                  className="mr-2 bg-gray-200"
                />
                <span>Notion Link</span>
                <input
                  type="radio"
                  name="contentType"
                  checked={!useNotion}
                  onChange={() => setUseNotion(false)}
                  className="ml-4 mr-2 bg-gray-200"
                />
                <span>Editor Content</span>
              </div>
            </div>
            {useNotion ? (
              <div>
                <label className="block text-lg font-medium">Notion Link</label>
                <input
                  type="text"
                  placeholder="Enter Notion link"
                  value={notionLink}
                  onChange={(e) => setNotionLink(e.target.value)}
                  className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
                />
              </div>
            ) : (
              <div>
                {editable && <MenuBar editor={editor} />}
                <EditorContent
                  editor={editor}
                  content={content}
                  className="mt-2 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-100"
                />
              </div>
            )}
            <div>
              <label className="block text-lg font-medium">
                Upload Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-lg font-medium">Tags</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {predefinedTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center bg-gray-200 rounded-lg px-3 py-1"
                  >
                    <input
                      type="checkbox"
                      value={tag}
                      checked={tags.includes(tag)}
                      onChange={handleTagChange}
                      className="mr-2"
                    />
                    {tag}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-lg font-medium">Visibility</label>
              <div className="mt-2">
                <label className="flex items-center bg-gray-200 rounded-lg px-3 py-1">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="mr-2"
                  />
                  Make Public
                </label>
                <label className="flex items-center rounded-lg py-1">
                  By checking this, a notification will be sent to the Discord
                  channel to announce your post.
                </label>
              </div>
            </div>
            <div className="text-center">
              <button
                className="w-1/4 px-6 py-3 text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                onClick={() => handlePost(true)}
              >
                Create New Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default CreateBlog
