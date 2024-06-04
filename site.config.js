const CONFIG = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Add this if your Next.js app is behind a proxy
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://localhost:3000/api/:path*", // Adjust accordingly
      },
    ]
  },
  // profile setting (required)
  profile: {
    name: "Kuma Lab",
    image: "", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "",
    bio: "",
    email: "",
    linkedin: "",
    github: "",
    instagram: "",
  },
  projects: [
    {
      name: `KumaLab Projects`,
      href: "https://www.kuma2024.tech/projects",
    },
  ],
  // blog setting (required)
  blog: {
    title: "Kuma Lab",
    description:
      "Our vision is to create a open laboratory in Tokyo where diverse individuals can engage in innovative research using state-of-the-art GPUs and robot arms. We aim to break cultural barriers, empowering anyone, including undergraduates, to innovate and drive a brighter future.",
  },

  // CONFIG configration (required)
  link: "https://www.kuma2024.tech/",
  since: 2024, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 20, // revalidate time for [slug], index
}

module.exports = { CONFIG }
