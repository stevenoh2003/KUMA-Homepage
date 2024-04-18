import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import PostsCard from "src/routes/FeaturedPosts/PostList/PostsCard"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled"
import { useMemo } from "react"


const GridWrapper = styled.div`
  display: grid;
  gap: 30px;
  margin-bottom: 2rem;
  width: 100%; // Ensures full width
  padding: 0 15px; // Add padding to handle edge spacing

  grid-template-columns: 1fr; // Default to 1 column

  @media (min-width: 768px) {
    grid-template-columns: repeat(1, 1fr); // 2 columns on medium screens
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr); // 3 columns on large screens
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr); // 4 columns on extra large screens
  }
`;
const PostsCardWrapper = styled.div`
  width: 100%; // Ensures that the card takes up all available width
  box-sizing: border-box; // Makes sure padding and borders are included in the width calculation
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
          post.type.includes("Post") && // Assuming "Post" is the type for blogs
          post.title.toLowerCase().includes(q.toLowerCase())
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
    <div
      className="bg-white py-10 sm:py-32"
      style={{ backgroundColor: "#f2f3ef" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-xl space-y-3">
          <h3 className="text-indigo-600 font-semibold">BLOG</h3>
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            Read our stories
          </p>
          <p>Learn from the latest posts by kuma members.</p>
        </div>
        {/* Use GridWrapper to apply the grid styling */}
        <GridWrapper className="border-t border-gray-200 pt-10 mt-8 sm:mt-16">
          {filteredPosts.map((post) => (
            <PostsCardWrapper key={post.id}>
              <PostsCard data={post} />
            </PostsCardWrapper>
          ))}
          <ReadMoreColumn>
            <Link href="/blog" legacyBehavior>
              <a className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Read More →
              </a>
            </Link>
          </ReadMoreColumn>
        </GridWrapper>
      </div>
    </div>
  )
}

export default PostList
