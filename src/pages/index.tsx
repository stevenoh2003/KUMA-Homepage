import { CONFIG } from "../../site.config";
import React from "react";
import MetaConfig from "src/components/MetaConfig";  // Ensure this is the correct import for Meta tags

import { getPosts } from "../apis";
import { queryClient } from "src/libs/react-query";
import { queryKey } from "src/constants/queryKey";
import { GetStaticProps } from "next";
import { dehydrate } from "@tanstack/react-query";
import { filterPosts } from "src/libs/utils/notion";
import LogoGrid from "src/components/LogoGrid"
import Explanation from "src/components/Explanation"

import Slideshow from "src/components/Slideshow"
import dynamic from 'next/dynamic';
import Hero from "src/components/Hero";
import Feature from "src/components/Feature";
import FeaturedPosts from "src/routes/FeaturedPosts";
// const FeaturedPosts = dynamic(() => import("src/components/FeaturedPosts"), { loading: () => <p>Loading...</p> });
const Team = dynamic(() => import("src/components/Team"), { loading: () => <p>Loading...</p> });
const Footer = dynamic(() => import("src/components/Footer"), { loading: () => <p>Loading...</p> });
import NavBar from "src/components/Nav";
import Quote from "src/components/Quote"
export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts());
  await queryClient.prefetchQuery(queryKey.posts(), () => posts);

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
      {/* <NavBar /> */}
      <MetaConfig {...meta} />
      <Hero />
      <Quote />

      <Feature />
      <Explanation />
      <Slideshow />
      <LogoGrid />
      {/* <FeaturedPosts /> */}
      <Team />
      <Footer />
    </>
  )
}

export default FeedPage;
