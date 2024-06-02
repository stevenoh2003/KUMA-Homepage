import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import User from "src/libs/model/User"

export default async function handler(req, res) {
  await dbConnect()

  const { page = 1, limit = 15, tag } = req.query

  try {
    // Convert page and limit to integers
    const pageNum = parseInt(page, 10)
    const limitNum = parseInt(limit, 10)

    // Calculate the number of documents to skip
    const skip = (pageNum - 1) * limitNum

    // Build the query object
    const query = { isPublic: true }
    if (tag) {
      query.tags = { $in: [tag] }
    }

    // Fetch paginated posts with `isPublic` set to true, sorted by `created_at` in descending order
    const posts = await BlogPost.find(query)
      .sort({ created_at: -1 }) // Sort by created_at field in descending order
      .skip(skip)
      .limit(limitNum)
      .lean() // Use `.lean()` to convert to plain JavaScript objects

    // Retrieve each post's owner name based on the `owner` field ID
    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.owner, "name")
        return {
          ...post,
          ownerName: user ? user.name : "Unknown Author",
        }
      })
    )

    // Count total number of documents with `isPublic` set to true and matching the tag filter if provided
    const totalPosts = await BlogPost.countDocuments(query)

    res.status(200).json({
      posts: populatedPosts, // Include posts with owner names
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNum),
      currentPage: pageNum,
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({ error: error.message })
  }
}
