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
import Footer from "src/components/Footer.jsx"
import dynamic from "next/dynamic"
import { RotatingLines } from "react-loader-spinner"
import { NotionRenderer } from "react-notion-x"
import "react-notion-x/src/styles.css"

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
)
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("src/routes/Detail/components/NotionRenderer/Equation.js").then(
    (m) => m.Equation
  )
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const predefinedTags = ["Paper Note", "AI", "Robotics"]

const PostPage = () => {
  const router = useRouter()
  const { title } = router.query
  const [postContent, setPostContent] = useState({
    title: "",
    description: "",
    content: "",
    owner: "",
    thumbnail_url: "",
    isPublic: false,
    created_at: "",
    notion_id: "",
    tags: [],
  })
  const [userInfo, setUserInfo] = useState(null)
  const { data: session } = useSession()
  const [editable, setEditable] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newThumbnail, setNewThumbnail] = useState(null)
  const [isPublic, setIsPublic] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [editorFocused, setEditorFocused] = useState(false)
  const [authorLoading, setAuthorLoading] = useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Mathematics.configure({}),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Dropcursor.configure({
        class: "",
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
    ],
    content: "",
    editable: false,
    onFocus: () => {
      setEditorFocused(true)
    },
    onBlur: () => {
      setEditorFocused(false)
    },
  })

  useEffect(() => {
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
          setNewDescription(data.description || "")
          setIsPublic(data.isPublic)
          setSelectedTags(data.tags || [])
          if (!data.notion_id) {
            editor.commands.setContent(
              data.content || "<p>No content available</p>"
            )
          }
          if (data.owner) fetchUserInfo(data.owner)
          setEditable(session && session.user && data.owner === session.user.id)
        })
        .catch((error) => console.error("Error fetching post details:", error))
    }
  }, [title, editor, session])

  const fetchUserInfo = (userId) => {
    setAuthorLoading(true)
    fetch(`/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP status ${response.status}`)
        return response.json()
      })
      .then((user) => {
        setUserInfo(user)
        setAuthorLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching user info:", error)
        setAuthorLoading(false)
      })
  }

  const handleThumbnailChange = (event) => {
    setNewThumbnail(event.target.files[0])
  }

  const handleTagChange = (event) => {
    const { value, checked } = event.target
    setSelectedTags((prevTags) =>
      checked ? [...prevTags, value] : prevTags.filter((tag) => tag !== value)
    )
  }

  const updateTitleAndThumbnail = async () => {
    const response = await fetch(`/api/posts/updateTitleAndThumbnail`, {
      method: "POST",
      body: new URLSearchParams({
        currentTitle: postContent.title,
        currentDescription: postContent.description,
        newDescription: newDescription,
        newTitle: newTitle,
        isPublic: String(isPublic),
        thumbnailName: newThumbnail ? newThumbnail.name : "",
        thumbnailType: newThumbnail ? newThumbnail.type : "",
        tags: selectedTags.join(","),
      }),
    })

    const result = await response.json()

    if (response.ok && result.presignedPost) {
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
        description: result.description,
        thumbnail_url: result.thumbnailUrl,
        isPublic: result.isPublic,
        tags: result.tags,
      }))
      setShowModal(false)
    } else if (response.ok) {
      setPostContent((prev) => ({
        ...prev,
        title: result.title,
        description: result.description,
        thumbnail_url: result.thumbnail_url,
        isPublic: result.isPublic,
        tags: result.tags,
      }))
      router.push("/blog")

      setShowModal(false)
    } else {
      console.error("Error updating title and thumbnail:", result.error)
    }
  }

  const deletePost = async () => {
    if (!editable) return
    const confirmed = confirm("Are you sure you want to delete this post?")
    if (!confirmed) return

    try {
      const response = await fetch(`/api/posts/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postContent.title }),
      })

      if (response.ok) {
        console.log("Post deleted successfully")
        router.push("/blog")
      } else {
        console.error("Failed to delete post:", await response.json())
      }
    } catch (error) {
      console.error("Error deleting post:", error)
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
        <div className="absolute inset-0 bg-black opacity-85 flex justify-center items-center">
          <div className="relative flex items-center space-x-2">
            <h1 className="text-4xl mx-4 text-white font-semibold">
              {postContent.title}
            </h1>
          </div>
        </div>
      </div>
      <div className="mt-8">
        {authorLoading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <RotatingLines
              visible={true}
              height="50"
              width="50"
              color="#4f46e5"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
            />
          </div>
        ) : userInfo ? (
          <div className="flex justify-between items-center mt-4 mb-4 mx-auto max-w-screen-lg px-4 sm:px-0 md:px-14">
            <div className="flex items-center space-x-2 md:space-x-4">
              {userInfo.profilePicUrl ? (
                <img
                  src={userInfo.profilePicUrl}
                  alt="Profile"
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-gray-200 rounded-full" />
              )}
              <div>
                <h4 className="text-sm sm:text-lg md:text-xl font-medium text-gray-700">
                  {userInfo.name}
                </h4>
              </div>
            </div>
            <div className="text-right flex flex-col space-y-1 sm:space-y-0 sm:space-x-2 sm:flex-row items-center">
              <p className="text-xs sm:text-sm md:text-base text-gray-500">
                {new Date(postContent.created_at).toLocaleDateString()}{" "}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-500">
                {new Date(postContent.created_at).toLocaleTimeString()}{" "}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No user information available.</p>
        )}
      </div>
      <hr
        style={{
          color: "black",
          backgroundColor: "black",
          height: 1,
        }}
      />
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:px-8 text-gray-600">
        {postContent.notion_id ? (
          <div className="overflow-x-auto">
            <NotionRenderer
              recordMap={postContent.recordMap}
              disableHeader={true}
              header={null}
              components={{
                Code,
                Collection,
                Equation,
                Modal,
                Pdf,
              }}
            />
          </div>
        ) : (
          <StyledEditor>
            {editable && <MenuBar editor={editor} />}
            {editable && (
              <hr
                style={{
                  color: "black",
                  backgroundColor: "black",
                  opacity: "70%",
                  height: 1,
                }}
              />
            )}
            <EditorContent
              editor={editor}
              style={{
                backgroundColor: editorFocused ? "white" : "transparent",
              }}
            />
          </StyledEditor>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
              <h3 className="text-3xl font-bold mb-6 text-center text-indigo-600">
                Edit Post
              </h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-lg font-medium">New Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium">
                    New Description
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium">
                    New Thumbnail
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full mt-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-lg font-medium">
                    Visibility
                  </label>
                  <div className="mt-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="mr-2"
                    />
                    <span>Make Public</span>
                  </div>
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
                          checked={selectedTags.includes(tag)}
                          onChange={handleTagChange}
                          className="mr-2"
                        />
                        {tag}
                      </label>
                    ))}
                  </div>
                </div>
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
              </form>
            </div>
          </div>
        )}
        {editable && (
          <div className="flex gap-4 justify-end mt-4">
            <button
              className="px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg ml-4"
              onClick={deletePost}
            >
              Delete Post
            </button>
            <button
              className="px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg"
              onClick={() => setShowModal(true)}
            >
              Update Post
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default PostPage
