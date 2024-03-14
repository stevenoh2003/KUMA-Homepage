import Hero from "src/components/Hero"
import { CONFIG } from "../../site.config"

import MetaConfig from "src/components/Hero"
import Feature from "src/components/Feature"

import FeaturedPosts from "src/components/FeaturedPosts"


import { getPosts } from "../apis"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"



// import Nav from "src/pages/Nav"
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
    <>
      {/* <Nav /> */}
      <Hero />
      <Feature />
      <FeaturedPosts />
    </>
  )
}

export default FeedPage
