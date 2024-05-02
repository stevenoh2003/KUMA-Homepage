import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "src/libs/aws-config"

export default async function handler(req, res) {
  const { title } = req.query

  await dbConnect()

  try {
    const post = await BlogPost.findOne({ title: decodeURIComponent(title) })
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Fetch content from S3 using the s3_key from the MongoDB document
    const { Body } = await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: post.s3_key,
      })
    )

    // Convert the S3 stream to text
    const content = await new Promise((resolve, reject) => {
      let data = ""
      Body.on("data", (chunk) => (data += chunk))
      Body.on("end", () => resolve(data))
      Body.on("error", reject)
    })

    res
      .status(200)
      .json({
        title: post.title,
        content: content,
        created_at: post.created_at,
      })
  } catch (error) {
    console.error("Failed to fetch post data:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch post data", error: error.message })
  }
}
