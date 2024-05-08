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

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div>
      <Head>
        <title>User Profile</title>
      </Head>
      <div className="mx-auto max-w-screen-xl p-5 lg:flex lg:gap-8 lg:items-start">
        {/* Profile Section (Responsive) */}
        <div className="lg:flex-shrink-0 lg:w-1/3 bg-gray-50 rounded-lg shadow px-4 py-8 mb-6 lg:mb-0">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <strong>Name:</strong>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {session.user.email}
            </div>
            <div className="mb-4">
              <strong>Profile Image:</strong>
              {session.user.image && (
                <div className="mt-1 w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt="Profile Picture"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Posts Section (Responsive) */}
        <div className="flex-1 bg-gray-50 rounded-lg shadow px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">My Posts</h2>
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post._id} className="group">
                <Link href={`/blog/${encodeURIComponent(post.title)}`}>
                  <div className="h-48 w-full overflow-hidden rounded-lg bg-white shadow">
                    <img
                      src={post.thumbnail_url || defaultThumbnail}
                      alt={post.title}
                      className="object-cover h-full w-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.title}
                    </h3>
                    <p className="text-gray-600">
                      {post.description ||
                        "Read this blog post to find out more!"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            {" "}
            <div className="flex justify-between max-w-xl mx-auto p-4">
              <button
                onClick={() => handlePageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`mx-2 ${page === i + 1 ? "text-red-500" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Next
              </button>
            </div>
          </div>
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
