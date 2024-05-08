import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import { IncomingForm } from "formidable"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import s3Client from "src/libs/aws-config"

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing by Next.js
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const form = new IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error("Error while parsing form:", err)
      return res
        .status(500)
        .json({ message: "Form parsing error", error: err.toString() })
    }

    console.log("Parsed fields:", fields)

    // Extract relevant data from form fields
    const currentTitle = Array.isArray(fields.currentTitle)
      ? fields.currentTitle[0]
      : fields.currentTitle
    const newTitle = Array.isArray(fields.newTitle)
      ? fields.newTitle[0]
      : fields.newTitle
    const isPublic = String(fields.isPublic).toLowerCase() === "true"
    const thumbnailName = Array.isArray(fields.thumbnailName)
      ? fields.thumbnailName[0]
      : null
    const thumbnailType = Array.isArray(fields.thumbnailType)
      ? fields.thumbnailType[0]
      : null

    // Ensure required fields are provided
    if (!currentTitle || !newTitle) {
      console.error("Missing required fields:", { currentTitle, newTitle })
      return res.status(400).json({ message: "Required fields are missing." })
    }

    try {
      // Connect to the database
      await dbConnect()
      const post = await BlogPost.findOne({ title: currentTitle })

      if (!post) {
        return res.status(404).json({ message: "Post not found" })
      }

      let presignedPost = null
      let thumbnailUrl = post.thumbnail_url // Keep the existing thumbnail URL

      // Generate a presigned URL if a new thumbnail is provided
      if (thumbnailName && thumbnailType) {
        const s3Key = `thumbnails/${Date.now()}_${thumbnailName}`
        presignedPost = await createPresignedPost(s3Client, {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Fields: { "Content-Type": thumbnailType, ACL: "public-read" },
          Conditions: [
            ["content-length-range", 0, 10000000], // Limit to 5MB
            { "Content-Type": thumbnailType },
            { ACL: "public-read" },
          ],
          Expires: 60, // URL expires in 60 seconds
        })
        thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`
      }

      // Update the post title and visibility
      post.title = newTitle || post.title
      post.thumbnail_url = thumbnailUrl
      post.isPublic = isPublic
      await post.save()

      // Respond with the presigned URL and updated post info
      res.status(200).json({
        presignedPost,
        title: post.title,
        thumbnailUrl,
        isPublic: post.isPublic,
      })
    } catch (error) {
      console.error("Error updating post title and thumbnail:", error)
      res.status(500).json({
        message: "Failed to update post and generate presigned URL",
        error: error.message,
      })
    }
  })
}
