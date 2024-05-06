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
import Hero from "src/components/Hero";
import Feature from "src/components/Feature";
import FeaturedPosts from "src/routes/FeaturedPosts";
import { I18nextProvider } from 'react-i18next';
import il8n from "src/pages/i18n.js"
// const FeaturedPosts = dynamic(() => import("src/components/FeaturedPosts"), { loading: () => <p>Loading...</p> });
const Team = dynamic(() => import("src/components/Team"), { loading: () => <p>Loading...</p> });
const Footer = dynamic(() => import("src/components/Footer"), { loading: () => <p>Loading...</p> });
import NavBar from "src/components/Nav";
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
    <I18nextProvider i18n={il8n}>
      {/* <NavBar /> */}
      <MetaConfig {...meta} />
      <Hero />
      <Feature />
      <LogoGrid />
      {/* <FeaturedPosts /> */}
      <Team />
      <Footer />
    </I18nextProvider>
  )
}

export default FeedPage;
