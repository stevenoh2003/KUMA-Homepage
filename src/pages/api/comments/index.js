import dbConnect from "src/libs/mongoose"
import Comment from "src/libs/model/Comment"
import BlogPost from "src/libs/model/BlogPost"
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await dbConnect()

  const token = await getToken({ req, secret })
//   if (!token) {
//     return res.status(401).json({ message: "Not authenticated" })
//   }

  if (req.method === "POST") {
    const { content, postTitle } = req.body

    if (!content || !postTitle) {
      return res.status(400).json({ message: "Missing content or postTitle" })
    }

    try {
      const post = await BlogPost.findOne({ title: postTitle })
      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      const comment = new Comment({
        content,
        author: token.sub,
        post: post._id,
      })

      await comment.save()
      return res.status(201).json(comment)
    } catch (error) {
      console.error("Error creating comment:", error)
      return res.status(500).json({ message: "Internal server error" })
    }
  } else if (req.method === "GET") {
    const { title } = req.query

    try {
      const post = await BlogPost.findOne({ title })
      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      const comments = await Comment.find({ post: post._id })
        .populate("author", "name profilePicUrl")
        .exec()
      console.log("Fetched comments:", comments)
      res.status(200).json(comments)
    } catch (error) {
      console.error("Error fetching comments:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
