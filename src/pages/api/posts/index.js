import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"

export default async function handler(req, res) {
  await dbConnect()

  try {
    const posts = await BlogPost.find({})
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
