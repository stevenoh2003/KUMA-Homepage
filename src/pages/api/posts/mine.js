// src/pages/api/posts/mine.js
import { getSession } from "next-auth/react"
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"

export default async function handler(req, res) {
  // Get the user's session to identify the authenticated user
  const session = await getSession({ req })

  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await dbConnect()

  const { page = 1, limit = 10 } = req.query

  try {
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)
    const skip = (pageNum - 1) * limitNum

    // Query to fetch posts by the logged-in user
    const userPosts = await BlogPost.find({ owner: session.user.id })
      .skip(skip)
      .limit(limitNum)
      .lean()

    // Count all posts owned by the user
    const totalPosts = await BlogPost.countDocuments({ owner: session.user.id })

    // Return the posts, total count, and total pages
    res.status(200).json({
      posts: userPosts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNum),
      currentPage: pageNum,
    })
  } catch (error) {
    console.error("Error fetching user's posts:", error)
    res.status(500).json({ error: error.message })
  }
}
