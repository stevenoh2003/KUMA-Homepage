// src/pages/api/posts/index.js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"

export default async function handler(req, res) {
  await dbConnect()

  const { page = 1, limit = 15 } = req.query

  try {
    // Convert page and limit to integers
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)

    // Calculate the number of documents to skip
    const skip = (pageNum - 1) * limitNum

    // Fetch paginated posts with isPublic set to true
    const posts = await BlogPost.find({ isPublic: true })
      .skip(skip)
      .limit(limitNum)

    // Count total number of documents with isPublic set to true
    const totalPosts = await BlogPost.countDocuments({ isPublic: true })

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNum),
      currentPage: pageNum,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
