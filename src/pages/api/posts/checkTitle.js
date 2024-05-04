// src/pages/api/posts/checkTitle.js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"

export default async function handler(req, res) {
  await dbConnect()
  const { title } = req.query

  if (!title) {
    return res.status(400).json({ error: "Title query parameter is required" })
  }

  const existingPost = await BlogPost.findOne({ title })
  return res.status(200).json({ exists: !!existingPost })
}
