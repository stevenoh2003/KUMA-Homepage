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

import dynamic from 'next/dynamic';

const Hero = dynamic(() => import("src/components/Hero"), { loading: () => <p>Loading...</p> });
const Feature = dynamic(() => import("src/components/Feature"), { loading: () => <p>Loading...</p> });
const FeaturedPosts = dynamic(() => import("src/components/FeaturedPosts"), { loading: () => <p>Loading...</p> });
const FeaturedTutorials = dynamic(() => import("src/components/FeaturedTutorials"), { loading: () => <p>Loading...</p> });
const Team = dynamic(() => import("src/components/Team"), { loading: () => <p>Loading...</p> });
const Footer = dynamic(() => import("src/components/Footer"), { loading: () => <p>Loading...</p> });

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
      <MetaConfig {...meta} />
      <Hero />
      <Feature />
      <LogoGrid />
      <FeaturedPosts />
      <Team />
      <Footer />
    </>
  )
}

export default FeedPage;
