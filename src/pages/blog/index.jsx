import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Footer from "src/components/Footer"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"
import LoadingPage from "src/components/LoadingPage"
import MetaConfig from "src/components/MetaConfig"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons"

const PAGE_LIMIT = 15

const BlogIndex = () => {
  const meta = {
    title: "Blog",
    description: "Kuma Lab's community blog.",
    type: "website",
    url: "https://www.kuma2024.tech/blog",
  }

  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState("")
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t } = useTranslation()

  const fetchPosts = async (page, tag) => {
    setIsLoading(true)
    const tagQuery = tag ? `&tag=${tag}` : ""
    const response = await fetch(
      `/api/posts?page=${page}&limit=${PAGE_LIMIT}${tagQuery}`
    )
    const data = await response.json()
    setPosts(data.posts || [])
    setTotalPages(data.totalPages || 1)
    setCurrentPage(data.currentPage || page)
    setIsLoading(false)
    console.log(data)
  }

  useEffect(() => {
    fetchPosts(currentPage, selectedTag)
  }, [currentPage, selectedTag])

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? "" : tag)
    setCurrentPage(1) // Reset to first page when a new tag is selected or deselected
  }

  const generatePageList = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  const pages = generatePageList()

  const defaultThumbnail =
    "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).filter((tag) => tag)

  const truncateDescription = (description) => {
    const words = description.split(" ")
    if (words.length > 15) {
      return words.slice(0, 15).join(" ") + "..."
    }
    return description
  }

  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <MetaConfig {...meta} />
      <section className="py-4">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          {isLoading ? (
            <LoadingPage />
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between sm:max-w-full sm:mx-auto">
                <div>
                  <h1 className="flex flex-wrap items-center gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        className={`px-3 py-2 rounded-lg duration-150 ${
                          selectedTag === tag
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}{" "}
                  </h1>
                  {/* <p className="text-gray-600">{t("blogIndex.subtitle")}</p> */}
                </div>
                <div className="flex flex-wrap items-center gap-2 ">
                  {status === "authenticated" ? (
                    <button
                      onClick={() => router.push("/blog/create")}
                      className="px-3 py-3 text-indigo-600 bg-indigo-50 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200 flex items-center ml-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 mr-2"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t("blogIndex.addNewPost")}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push("/auth/signup")}
                      className="px-3 py-3 text-indigo-600 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200 flex items-center ml-2"
                    >
                      {t("blogIndex.signUp")}
                    </button>
                  )}
                </div>
              </div>
              <ul className="grid gap-x-8 gap-y-10 mt-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const cleanTags = (post.tags || [])
                    .map((tag) => tag.trim())
                    .filter((tag) => tag)

                  return (
                    <li
                      className="w-full mx-auto group sm:max-w-sm"
                      key={post._id}
                    >
                      <Link
                        href={`/blog/${encodeURIComponent(post.title)}`}
                        legacyBehavior
                      >
                        <a>
                          <div className="h-48 w-full overflow-hidden rounded-lg">
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
                              <span className="block text-gray-600">
                                {post.ownerName || "Unknown Author"}
                              </span>
                            </div>
                            <h3 className="text-lg text-gray-800 duration-150 group-hover:text-indigo-600 font-semibold">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 text-sm duration-150 group-hover:text-gray-800">
                              {truncateDescription(
                                post.description ||
                                  "Read this blog post to find out more!"
                              )}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex flex-wrap gap-2">
                                {cleanTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center text-indigo-600">
                                <FontAwesomeIcon icon={faThumbsUp} />
                                <span className="ml-1">
                                  {post.likes?.length || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {/* Pagination Component */}
              <div className="flex items-center justify-between mt-10">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 text-indigo-600 rounded-lg duration-150 hover:bg-indigo-100 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-indigo-50"
                  }`}
                >
                  {t("pagination.previous")}
                </button>
                <ul className="flex items-center space-x-2">
                  {pages.map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => changePage(page)}
                        className={`px-3 py-2 rounded-lg duration-150 hover:bg-indigo-50 ${
                          currentPage === page
                            ? "bg-indigo-600 text-white font-bold"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 text-indigo-600 rounded-lg duration-150 hover:bg-indigo-100 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-indigo-50"
                  }`}
                >
                  {t("pagination.next")}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default BlogIndex
