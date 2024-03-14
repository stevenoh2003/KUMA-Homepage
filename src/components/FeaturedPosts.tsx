// import Feed from "src/routes/Feed"
import FeaturedPosts from "src/routes/FeaturedPosts"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "src/types"
import { getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"
import styled from "@emotion/styled"



const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <FeaturedPosts />
    </>
  )
}

export default FeedPage


