import dbConnect from "src/libs/mongoose"
import Comment from "src/libs/model/Comment"
import { getToken } from "next-auth/jwt"

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  await dbConnect()

  const token = await getToken({ req, secret })
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  if (req.method === "DELETE") {
    const { id } = req.query

    try {
      const comment = await Comment.findById(id)
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" })
      }

      // Check if the user is the author of the comment
      if (comment.author.toString() !== token.sub) {
        return res.status(403).json({ message: "Not authorized" })
      }

      await Comment.deleteOne({ _id: id })
      return res.status(200).json({ message: "Comment deleted" })
    } catch (error) {
      console.error("Error deleting comment:", error)
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message })
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" })
  }
}
