module.exports = {
  eslint: {
    // Warning: This will disable ESLint checks for the entire project.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "www.notion.so",
      "lh5.googleusercontent.com",
      "lh3.googleusercontent.com",
      "s3-us-west-2.amazonaws.com",
      "images.unsplash.com",
      "api.uifaces.co",
    ],
    formats: ["image/avif", "image/webp"], // Optional: Enable modern image formats
  },
}
