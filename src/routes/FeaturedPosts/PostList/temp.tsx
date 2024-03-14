import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link" // Import Link from Next.js for navigation
import PostCard from "src/routes/Feed/PostList/PostCard"
import usePostsQuery from "src/hooks/usePostsQuery"
import styled from "@emotion/styled" // Assuming you're using Emotion for styling

// Define your styled components
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // Creates a 4-column layout
  gap: 20px; // Adjust the gap as needed
  margin-bottom: 2rem; // Adds some space below the grid
`

const ReadMoreColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px; // Adjust as needed
  // Styling for the read more "arrow"/link
  a {
    display: inline-block;
    background: #007bff; // Example color
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    cursor: pointer;
  }
`

type Props = {
  q: string // Assuming this is a search query you might want to use for filtering by keywords
}

const PostList: React.FC<Props> = ({ q }) => {
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
      return newFilteredPosts.slice(0, 3) // Only take the first 3 for the cards, as the 4th is the "Read More"
    })
  }, [q, data])

  return (
    <GridWrapper>
      {filteredPosts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
      <ReadMoreColumn>
        <Link href="/blog" legacyBehavior>
          <a>Read More →</a>
        </Link>
      </ReadMoreColumn>
    </GridWrapper>
  )
}

export default PostList
