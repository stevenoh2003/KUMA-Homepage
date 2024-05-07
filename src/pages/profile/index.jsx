// src/pages/profile.js
import { useSession, getSession } from "next-auth/react"
import Head from "next/head"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import Footer from "src/components/Footer"
export default function Profile() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [name, setName] = useState(session?.user?.name || "")
  const [image, setImage] = useState(null)

  const defaultThumbnail =
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts/mine?page=${page}`)
        const data = await response.json()
        setPosts(data.posts)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching posts:", error)
      }
    }
    fetchPosts()
  }, [page])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!session || !session.user) {
    return (
      <div>
        <p>You must be logged in to view this page.</p>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("name", name)
    if (image) {
      formData.append("file", image)
    }

const response = await fetch("/api/users/update", {
  // Corrected endpoint path
  method: "POST",
  body: formData,
})

    if (response.ok) {
      const updatedUser = await response.json()
      // Update session data if needed
    } else {
      console.error("Failed to update profile")
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const loadMorePosts = (pageNumber) => {
    setPage(pageNumber)
  }

  return (
    <div>
      <Head>
        <title>User Profile</title>
      </Head>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "auto",
          padding: "5rem",
          gap: "2rem",
        }}
      >
        {/* Profile Section (40%) */}
        <div
          style={{
            width: "30%",
            padding: "2rem",
            // border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f2f3ef",
            // boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="inputGroup mb-4">
              <strong>Name:</strong>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="inputGroup mb-4">
              <strong>Email:</strong> {session.user.email}
            </div>
            <div className="inputGroup mb-4">
              <strong>Profile Image:</strong>
              {session.user.image && (
                <div
                  className="imageWrapper mt-1"
                  style={{
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src={session.user.image}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="object-cover"
                    style={{ minWidth: "100%", minHeight: "100%" }}
                  />
                </div>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="inputFile mt-2"
              />
            </div>
            <button
              type="submit"
              className="button px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Posts Section (60%) */}
        <div
          style={{
            width: "70%",
            padding: "2rem",
            // border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            backgroundColor: "#f2f3ef",
            // boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.1)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">My Posts</h2>
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post._id} className="group w-full mx-auto sm:max-w-sm">
                <Link
                  href={`/blog/${encodeURIComponent(post.title)}`}
                  legacyBehavior
                >
                  <a>
                    <div className="h-48 w-full overflow-hidden rounded-lg bg-white">
                      <img
                        src={post.thumbnail_url || defaultThumbnail}
                        alt={post.title}
                        className="object-cover h-full w-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="block text-indigo-600">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        {/* <span className="block text-gray-600">
                          {post.ownerName || "Unknown Author"}
                        </span> */}
                      </div>
                      <h3 className="text-lg text-gray-800 duration-150 group-hover:text-indigo-600 font-semibold">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm duration-150 group-hover:text-gray-800">
                        {post.description ||
                          "Read this blog post to find out more!"}
                      </p>
                    </div>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-screen-xl mx-auto mt-8 px-4 text-gray-600 md:px-8">
        <div
          className="hidden items-center justify-between sm:flex"
          aria-label="Pagination"
        >
          <a
            href="#"
            onClick={() => loadMorePosts(Math.max(page - 1, 1))}
            className="hover:text-indigo-600 flex items-center gap-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </a>
          <ul className="flex items-center gap-1">
            {[...Array(totalPages).keys()].map((index) => (
              <li key={index} className="text-sm">
                <a
                  href="#"
                  onClick={() => loadMorePosts(index + 1)}
                  aria-current={page === index + 1 ? "page" : undefined}
                  className={`px-3 py-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${
                    page === index + 1
                      ? "bg-indigo-50 text-indigo-600 font-medium"
                      : ""
                  }`}
                >
                  {index + 1}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#"
            onClick={() => loadMorePosts(Math.min(page + 1, totalPages))}
            className="hover:text-indigo-600 flex items-center gap-x-2"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    }
  }
  return {
    props: { session },
  }
}
