import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { StyledEditor } from "src/components/Blog/StyledComponents"
import { useSession } from "next-auth/react"
import "katex/dist/katex.min.css"
import Mathematics from "@tiptap-pro/extension-mathematics"
import MenuBar from "src/components/Blog/UpdateMenuBar"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import Dropcursor from "@tiptap/extension-dropcursor"
import ImageExtension from "src/components/tiptap-imagresize/src/index"

const PostPage = () => {


  const router = useRouter()
  const { title } = router.query
  const [postContent, setPostContent] = useState({
    title: "",
    content: "",
    owner: "",
    thumbnail_url: "",
    isPublic: false, // Track existing `isPublic` value
    created_at: ""
  })
  const [userInfo, setUserInfo] = useState(null)
  const { data: session } = useSession()
  const [editable, setEditable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newThumbnail, setNewThumbnail] = useState(null)
  const [isPublic, setIsPublic] = useState(postContent.isPublic) // Initialize to the post's value

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mathematics,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Dropcursor.configure({
        class: "",
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image"
        },
      }),
      // ImageExtension,
    ],
    content: "",
    editable: false,
  })

useEffect(() => {
  // If editable is null, default to false
  const canEdit = editable === null ? false : editable

  if (editor) {
    editor.setEditable(canEdit)
  }
}, [editor, editable])


  useEffect(() => {
    if (title && editor) {
      fetch(`/api/posts/${encodeURIComponent(title)}`)
        .then((response) => response.json())
        .then((data) => {
          setPostContent(data)
          setNewTitle(data.title)
          setIsPublic(data.isPublic) // Initialize the checkbox value
          editor.commands.setContent(
            data.content || "<p>No content available</p>"
          )
          if (data.owner) fetchUserInfo(data.owner)
          setEditable(session && session.user && data.owner === session.user.id)
        })
        .catch((error) => console.error("Error fetching post details:", error))
    }
  }, [title, editor, session])

  const fetchUserInfo = (userId) => {
    fetch(`/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP status ${response.status}`)
        return response.json()
      })
      .then((user) => setUserInfo(user))
      .catch((error) => console.error("Error fetching user info:", error))
  }

  const handleThumbnailChange = (event) => {
    setNewThumbnail(event.target.files[0])
  }

  const updatePost = () => {
    if (!editor || !editable) return
    const htmlContent = editor.getHTML()

    fetch(`/api/posts/updatePost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content: htmlContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post updated:", data)
        router.push("/blog")
      })
      .catch((error) => console.error("Error updating post:", error))
  }
const updateTitleAndThumbnail = async () => {
  updatePost()
  const response = await fetch(`/api/posts/updateTitleAndThumbnail`, {
    method: "POST",
    body: new URLSearchParams({
      currentTitle: postContent.title,
      newTitle: newTitle,
      isPublic: String(isPublic),
      thumbnailName: newThumbnail ? newThumbnail.name : "",
      thumbnailType: newThumbnail ? newThumbnail.type : "",
    }),
  })

  const result = await response.json()

  if (response.ok && result.presignedPost) {
    // Use the pre-signed URL to upload the new thumbnail
    const formData = new FormData()
    Object.keys(result.presignedPost.fields).forEach((key) => {
      formData.append(key, result.presignedPost.fields[key])
    })
    formData.append("file", newThumbnail)

    const s3Response = await fetch(result.presignedPost.url, {
      method: "POST",
      body: formData,
    })

    if (!s3Response.ok) {
      console.error("Error uploading thumbnail to S3")
      return
    }

    setPostContent((prev) => ({
      ...prev,
      title: result.title,
      thumbnail_url: result.thumbnailUrl,
      isPublic: result.isPublic,
    }))
    setShowModal(false)
  } else if (response.ok) {
    // Update post without changing the thumbnail
    setPostContent((prev) => ({
      ...prev,
      title: result.title,
      thumbnail_url: result.thumbnail_url,
      isPublic: result.isPublic,
    }))
    setShowModal(false)
  } else {
    console.error("Error updating title and thumbnail:", result.error)
  }
}

  if (!editor) return null

  const defaultThumbnail =
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
  const thumbnailUrl = postContent.thumbnail_url || defaultThumbnail

  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={thumbnailUrl}
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-60 flex justify-center items-center">
          <div className="relative flex items-center space-x-2">
            <h1 className="text-4xl text-white font-semibold">
              {postContent.title}
            </h1>
            {/* {editable && (
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white cursor-pointer"
                  fill="currentColor"
                  class="bi bi-pencil-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                </svg>
              </button>
            )} */}
          </div>
        </div>
      </div>
      <div className="mt-8">
        {userInfo ? (
          <div className="flex items-center justify-between mt-4 mx-auto max-w-screen-md">
            {/* Author Profile */}
            <div className="flex items-center">
              {userInfo.profilePicUrl ? (
                <img
                  src={userInfo.profilePicUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full" />
              )}
              <div className="ml-4">
                <h4 className="text-xl font-medium text-gray-700">
                  {userInfo.name}
                </h4>
              </div>
            </div>

            {/* Created At (aligned to the right) */}
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {new Date(postContent.created_at).toLocaleDateString()}{" "}
                {/* Date Format */}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(postContent.created_at).toLocaleTimeString()}{" "}
                {/* Time Format */}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No user information available.</p>
        )}
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-4 md:px-8 text-gray-600">
        <StyledEditor>
          {editable && <MenuBar editor={editor} />}
          {editable && (
            <hr
              style={{
                color: "black",
                backgroundColor: "black",
                height: 1,
              }}
            />
          )}
          <EditorContent editor={editor} />
        </StyledEditor>
        {editable && (
          <>
            <hr
              style={{
                color: "black",
                backgroundColor: "black",
                height: 1,
              }}
            />
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg"
                onClick={() => setShowModal(true)}
              >
                Update Post
              </button>
            </div>
          </>
        )}

        {/* Modal for Title, Thumbnail, and isPublic Update */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
              <h3 className="text-2xl font-semibold mb-4">
                Edit Title, Thumbnail, and Visibility
              </h3>
              <label className="block mb-2">
                New Title
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </label>
              <label className="block mb-4">
                New Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none"
                />
              </label>
              <label className="block mb-4">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                Public Post
              </label>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 text-gray-600 font-medium rounded-lg border hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                  onClick={updateTitleAndThumbnail}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostPage
