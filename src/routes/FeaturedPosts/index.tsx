import { useState } from "react"

import styled from "@emotion/styled"

import PostList from "src/routes/FeaturedPosts/PostList"

const HEADER_HEIGHT = 73

type Props = {}

const FeaturedPosts: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <StyledWrapper>

        <PostList q={q} />

    </StyledWrapper>
  )
}

export default FeaturedPosts

const StyledWrapper = styled.div`
//   grid-template-columns: repeat(12, minmax(0, 1fr));

//   padding: 2rem 0;
//   display: grid;
//   gap: 1.5rem;

//   @media (max-width: 768px) {
//     display: block;
//     padding: 0.5rem 0;
//   }

//   > .lt {
//     display: none;
//     overflow: scroll;
//     position: sticky;
//     grid-column: span 2 / span 2;
//     top: ${HEADER_HEIGHT - 10}px;

//     scrollbar-width: none;
//     -ms-overflow-style: none;
//     &::-webkit-scrollbar {
//       display: none;
//     }

//     @media (min-width: 1024px) {
//       display: block;
//     }
//   }

//   > .mid {
//     grid-column: span 12 / span 12;

//     @media (min-width: 1024px) {
//       grid-column: span 7 / span 7;
//     }

//     > .tags {
//       display: block;

//       @media (min-width: 1024px) {
//         display: none;
//       }
//     }

//     > .footer {
//       padding-bottom: 2rem;
//       @media (min-width: 1024px) {
//         display: none;
//       }
//     }
//   }

//   > .rt {
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//     &::-webkit-scrollbar {
//       display: none;
//     }

//     display: none;
//     overflow: scroll;
//     position: sticky;
//     top: ${HEADER_HEIGHT - 10}px;

//     @media (min-width: 1024px) {
//       display: block;
//       grid-column: span 3 / span 3;
//     }

//     .footer {
//       padding-top: 1rem;
//     }
//   }
`
