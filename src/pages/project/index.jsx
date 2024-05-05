// pages/discordPosts.js
import { useEffect, useState } from "react"
import Footer from "src/components/Footer"

const PAGE_SIZE = 15

const DiscordPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/discordPosts")
        if (response.ok) {
          const data = await response.json()
          setPosts(Array.isArray(data) ? data : [])
          setError("")
        } else {
          const errData = await response.json()
          setError(errData.message || "An unknown error occurred")
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    setTotalPages(Math.ceil(posts.length / PAGE_SIZE))
  }, [posts])

  const paginatedPosts = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) return <p>Loading posts...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <section className="py-16">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-md">
            <h1 className="text-gray-800 text-xl font-extrabold sm:text-2xl">
              Discord Forum Posts
            </h1>
            <p className="text-gray-600 mt-2">
              Check out the latest discussions happening on our forum channel.
            </p>
          </div>
          <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <li key={post.id} className="border rounded-lg">
                <div className="flex items-start justify-between p-4">
                  <div className="space-y-2">
                    {/* Display the first emoji or a default symbol */}
                    <div className="bg-white w-14 h-14 border rounded-full flex items-center justify-center text-2xl">
                      {post.tags[0] || "❓"}
                    </div>
                    <h4 className="text-gray-800 font-semibold">
                      {post.title}
                    </h4>
                    {/* <p className="text-gray-600 text-sm">
                    Author: {post.authorId}
                  </p>
                  <p className="text-gray-600 text-sm">Date: {post.date}</p> */}
                    <p className="text-gray-600 text-sm">{post.description}</p>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 text-sm border rounded-lg px-3 py-2 duration-150 hover:bg-gray-100"
                  >
                    View
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="max-w-screen-xl mx-auto mt-12 px-4 text-gray-600 md:px-8">
            <div
              className="hidden items-center justify-between sm:flex"
              aria-label="Pagination"
            >
              <a
                href="javascript:void(0)"
                onClick={goToPreviousPage}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li key={page} className="text-sm">
                      <a
                        href="javascript:void(0)"
                        onClick={() => setPage(page)}
                        aria-current={currentPage === page ? "page" : false}
                        className={`px-3 py-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${
                          currentPage === page
                            ? "bg-indigo-50 text-indigo-600 font-medium"
                            : ""
                        }`}
                      >
                        {page}
                      </a>
                    </li>
                  )
                )}
              </ul>
              <a
                href="javascript:void(0)"
                onClick={goToNextPage}
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

            {/* Mobile Version */}
            <div className="flex items-center justify-between text-sm text-gray-600 font-medium sm:hidden">
              <a
                href="javascript:void(0)"
                onClick={goToPreviousPage}
                className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
              >
                Previous
              </a>
              <div className="font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <a
                href="javascript:void(0)"
                onClick={goToNextPage}
                className="px-4 py-2 border rounded-lg duration-150 hover:bg-gray-50"
              >
                Next
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default DiscordPosts
