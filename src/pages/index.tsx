import { CONFIG } from "../../site.config";
import React from "react";
import MetaConfig from "src/components/MetaConfig"; // Ensure this is the correct import for Meta tags
import { getPosts } from "../apis";
import { queryClient } from "src/libs/react-query";
import { queryKey } from "src/constants/queryKey";
import { GetStaticProps } from "next";
import { dehydrate } from "@tanstack/react-query";
import { filterPosts } from "src/libs/utils/notion";
import LogoGrid from "src/components/LogoGrid";
import Explanation from "src/components/Explanation";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from "src/components/Hero";
import Features from "src/components/Features";
import axios from "axios";
import Upcoming from "src/components/Upcoming"; // Ensure this is the correct import path for Upcoming component

const Team = dynamic(() => import("src/components/Team"), { loading: () => <p>Loading...</p> });
const Footer = dynamic(() => import("src/components/Footer"), { loading: () => <p>Loading...</p> });
const Gallery = dynamic(() => import("src/components/Gallery"), { loading: () => <p>Loading...</p> });

// Fetch events function
const fetchEvents = async () => {
  const { data } = await axios.get("/api/events/upcoming");
  return data;
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts());
  await queryClient.prefetchQuery(queryKey.posts(), () => posts);
  await queryClient.prefetchQuery(["upcomingEvents"], fetchEvents);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  };
};

const FeedPage = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  };

  return (
    <>
      <MetaConfig {...meta} />
      <Suspense fallback={<p>Loading Hero...</p>}>
        <Hero />
      </Suspense>
      <Suspense fallback={<p>Loading Upcoming Events...</p>}>
        <Upcoming />
      </Suspense>
      <Suspense fallback={<p>Loading Gallery...</p>}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<p>Loading Features...</p>}>
        <Features />
      </Suspense>
      <Suspense fallback={<p>Loading Explanation...</p>}>
        <Explanation />
      </Suspense>
      <Suspense fallback={<p>Loading Logo Grid...</p>}>
        <LogoGrid />
      </Suspense>
      <Suspense fallback={<p>Loading Team...</p>}>
        <Team />
      </Suspense>
      <Suspense fallback={<p>Loading Footer...</p>}>
        <Footer />
      </Suspense>
    </>
  );
};

export default FeedPage;
