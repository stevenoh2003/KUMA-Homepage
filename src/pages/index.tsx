import { CONFIG } from "../../site.config"
import React, { Suspense } from "react"
import MetaConfig from "src/components/MetaConfig"
import { getPosts } from "../apis"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate, Hydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion"
import dynamic from "next/dynamic"
import axios from "axios"
import LoadingPage from "src/components/LoadingPage"

// Static imports
import Hero from "src/components/Hero"
import Features from "src/components/Features"
import Explanation from "src/components/Explanation"
import LogoGrid from "src/components/LogoGrid"
import Upcoming from "src/components/Upcoming"

// Dynamic imports
const Team = dynamic(() => import("src/components/Team"), {
  loading: () => <LoadingPage />,
})
const Footer = dynamic(() => import("src/components/Footer"), {
  loading: () => <LoadingPage />,
})
const Gallery = dynamic(() => import("src/components/Gallery"), {
  loading: () => <LoadingPage />,
})

// Fetch events function
const fetchEvents = async () => {
  const { data } = await axios.get("/api/events/upcoming")
  return data
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)
  await queryClient.prefetchQuery(["upcomingEvents"], fetchEvents)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const FeedPage = ({ dehydratedState }) => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Hydrate state={dehydratedState}>
        <Suspense fallback={<LoadingPage />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <Upcoming />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <Features />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <Explanation />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <LogoGrid />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <Team />
        </Suspense>
        <Suspense fallback={<LoadingPage />}>
          <Footer />
        </Suspense>
      </Hydrate>
    </>
  )
}

export default FeedPage
