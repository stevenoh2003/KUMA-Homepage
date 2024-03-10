import Hero from "src/components/Hero"
import { CONFIG } from "../../site.config"

import MetaConfig from "src/components/Hero"
import Nav from "src/pages/Nav.jsx"

const FeedPage = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <>
      <Nav />
      <Hero />
    </>
  )
}

export default FeedPage
