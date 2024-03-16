import { useState } from "react"

import styled from "@emotion/styled"

import PostList from "src/routes/FeaturedTutorials/PostList"

const HEADER_HEIGHT = 73

type Props = {}

const FeaturedTutorials: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <>
      <PostList q={q} />
    </>
  )
}

export default FeaturedTutorials

