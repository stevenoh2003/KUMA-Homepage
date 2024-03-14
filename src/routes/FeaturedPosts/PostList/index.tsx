import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PostsCard from "src/routes/FeaturedPosts/PostList/PostsCard.tsx"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled"

// Keep your styled components
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // Keep the 4-column layout
  gap: 20px; // Adjust the gap as needed
  margin-bottom: 2rem; // Adds some space below the grid
  
`

const ReadMoreColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  grid-column: span 1; // Ensure it only takes up one column
  // Styling for the read more "arrow"/link
  a {
    display: inline-block;
    // background: #007bff;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;
  }
`

const PostList: React.FC<{ q: string }> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()
  const [filteredPosts, setFilteredPosts] = useState(data)

  useEffect(() => {
    setFilteredPosts(() => {
      let newFilteredPosts = data.filter(
        (post) =>
          post.featured && post.title.toLowerCase().includes(q.toLowerCase())
      )
      newFilteredPosts.sort(
        (a, b) =>
          new Date(b.date.start_date).getTime() -
          new Date(a.date.start_date).getTime()
      )
      return newFilteredPosts.slice(0, 3) // Only take the first 3 for the cards
    })
  }, [q, data])

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Recent blogs
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Read our cutting-edge stories on robotics.
            </p>
          </div>
          {/* Use GridWrapper to apply the grid styling */}
          <GridWrapper className="border-t border-gray-200 pt-10 mt-8 sm:mt-16">
            {filteredPosts.map((post) => (
              <PostsCard key={post.id} data={post} />
            ))}
            {/* Integrate ReadMoreColumn directly into the grid */}
            <ReadMoreColumn>
              <Link href="/blog" legacyBehavior>
                <a
                  href="#"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Read More →
                </a>
              </Link>
            </ReadMoreColumn>
          </GridWrapper>
        </div>
      </div>
    </div>
  )
}

export default PostList
