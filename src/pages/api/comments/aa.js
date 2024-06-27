// pages/api/comments/[title].js
import dbConnect from "src/libs/mongoose"
import Comment from "src/libs/model/Comment"
import BlogPost from "src/libs/model/BlogPost"

export default async function handler(req, res) {
  await dbConnect()

  const { title } = req.query

  if (req.method === "GET") {
    try {
      const post = await BlogPost.findOne({ title })
      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      const comments = await Comment.find({ post: post._id })
        .populate("author", "name profilePicUrl")
        .exec()
      console.log("Fetched comments:", comments) // Log the comments
      res.status(200).json(comments)
    } catch (error) {
      console.error("Error fetching comments:", error) // Log any errors
      res.status(500).json({ message: "Internal server error" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
