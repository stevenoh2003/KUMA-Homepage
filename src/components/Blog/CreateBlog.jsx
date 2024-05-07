import { useSession } from "next-auth/react"
import { useEditor, EditorContent } from "@tiptap/react"
import { useCurrentEditor } from "@tiptap/react"
import { useState, useCallback } from "react"
import { useRouter } from "next/router"
import ImageUploadModal from "../../components/ImageUploadModal"

const CreateBlog = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [s3Key, setS3Key] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { editor } = useCurrentEditor()

  const handleThumbnailChange = (event) => {
    setThumbnail(event.target.files[0])
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

const handlePost = async (isNew) => {
  const isFormValid = await validateForm()
  if (!isFormValid || !editor || !session) {
    return
  }

  const htmlContent = editor.getHTML()
  let thumbnailUrl = ""

  if (thumbnail) {
    try {
      // Request a presigned URL from the API
      const presignedResponse = await fetch("/api/posts/uploadThumbnail", {
        method: "POST",
        body: new URLSearchParams({
          filename: thumbnail.name,
          filetype: thumbnail.type,
        }),
      })

      const presignedData = await presignedResponse.json()

      // Upload the thumbnail directly to S3
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

  // Continue with creating the post as before
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
      content: htmlContent,
      s3Key,
      isNew,
      userId: session.user.id,
      thumbnailUrl,
      isPublic,
    }),
  })

  try {
    const data = await response.json()
    if (isNew && data.s3_key) {
      setS3Key(data.s3_key)
      setErrorMessage("")
      router.push("/blog") // Redirect to the blog page after successful post creation
    }
  } catch (error) {
    console.error("Error during fetch operation:", error)
    setErrorMessage("An unexpected error occurred while creating the post.")
  }
}


  return (
    <main className="py-1">
      <div className="max-w-screen-xl mx-auto text-gray-600">
        <div className="mt-5 max-w-lg mx-5">
          <form
            className="space-y-5 text-left"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="font-medium">Blog Title</label>
              <input
                type="text"
                placeholder="Enter your blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 border-black focus:border-indigo-600 shadow-lg rounded-lg"
              />
              <label className="font-medium">Description</label>
              <input
                type="text"
                placeholder="Enter a short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 border-black focus:border-indigo-600 shadow-lg rounded-lg"
              />
              {errorMessage && (
                <p className="mt-1 text-red-600 text-sm">{errorMessage}</p>
              )}
            </div>
            <div>
              <label className="font-medium">Upload Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                style={{
                  borderWidth: "5px",
                  borderColor: "black",
                  borderRadius: "0.375rem", // Matches Tailwind's `rounded-lg`
                }}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-indigo-600 "
              />
            </div>
            <div>
              <label className="font-medium">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2 shadow-lg"
                />
                Public Post
              </label>
            </div>
            <button
              className="px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              onClick={() => handlePost(true)}
            >
              Create New Post
            </button>
          </form>
          <div className="mt-10">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default CreateBlog
