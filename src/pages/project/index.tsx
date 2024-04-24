import TutorialFeed from "src/routes/TutorialFeed"
import { CONFIG } from "../../../site.config"
import { NextPageWithLayout } from "../../types"
import { getPosts } from "../../apis"
import MetaConfig from "src/components/MetaConfig"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { GetStaticProps } from "next"
import { dehydrate } from "@tanstack/react-query"
import { filterPosts } from "src/libs/utils/notion/getTutorialPost"
import { useSession } from "next-auth/react";

import ProjectList from '../../components/ProjectLlist'

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

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }
  const { data: session } = useSession();


  return (
    <div
      style={{
        backgroundColor: "#f2f3ef",

      }}
    >
        <MetaConfig {...meta} />
        <ProjectList />
    </div>
  )
}

export default FeedPage

