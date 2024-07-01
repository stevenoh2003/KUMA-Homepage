// src/pages/api/posts/likePost.js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await dbConnect()

  const token = await getToken({ req, secret })
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  if (req.method === "POST") {
    const { title } = req.body

    if (!title) {
      return res.status(400).json({ message: "Missing title" })
    }

    try {
      const post = await BlogPost.findOne({ title: decodeURIComponent(title) })
      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      if (post.likes.includes(token.sub)) {
        return res
          .status(400)
          .json({ message: "Post already liked by this user" })
      }

      post.likes.push(token.sub)
      await post.save()

      return res.status(200).json({ likes: post.likes.length })
    } catch (error) {
      console.error("Error liking post:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
