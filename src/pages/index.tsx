import { CONFIG } from "../../site.config"
import React, { Suspense } from "react"
import MetaConfig from "src/components/Hero"

import { getPosts } from "../apis"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"

const Hero = React.lazy(() => import("src/components/Hero"))
const Feature = React.lazy(() => import("src/components/Feature"))
const FeaturedPosts = React.lazy(() => import("src/components/FeaturedPosts"))
const FeaturedTutorials = React.lazy(
  () => import("src/components/FeaturedTutorials")
)
const Team = React.lazy(() => import("src/components/Team"))
const Footer = React.lazy(() => import("src/components/Footer"))

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const FeedPage = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Hero />
      <Feature />
      <FeaturedPosts />
      {/* Uncomment if needed <FeaturedTutorials /> */}
      <Team />
      <Footer />
    </Suspense>
  )
}

export default FeedPage
