// src/pages/api/posts/delete.js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { title } = req.body

  if (!title) {
    return res.status(400).json({ error: "Missing post title" })
  }

  try {
    const deletedPost = await BlogPost.findOneAndDelete({ title })

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" })
    }

    res.status(200).json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({ error: error.message })
  }
}
