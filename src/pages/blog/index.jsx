import React, { useEffect, useState } from "react"
import Link from "next/link"

const BlogIndex = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("/api/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error))
  }, [])

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link href={`/blog/${encodeURIComponent(post.title)}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogIndex
