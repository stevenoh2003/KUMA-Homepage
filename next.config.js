module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        http2: false, // Add this line
      }
    }

    return config
  },
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
      "kuma2024.s3.ap-southeast-2.amazonaws.com",
    ],
    formats: ["image/avif", "image/webp"], // Optional: Enable modern image formats
  },
}
