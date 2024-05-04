// src/pages/api/posts/updateTitleAndThumbnail.js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "src/libs/aws-config"
import { Formidable } from "formidable"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const uploadDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const form = new Formidable({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("File upload error:", err)
      return res
        .status(500)
        .json({ message: "File upload error", error: err.toString() })
    }

    // Ensure that title and isPublic are correctly parsed
    const currentTitle = Array.isArray(fields.currentTitle)
      ? fields.currentTitle[0]
      : fields.currentTitle
    const newTitle = Array.isArray(fields.newTitle)
      ? fields.newTitle[0]
      : fields.newTitle
    const isPublic = fields.isPublic === "true" // Expecting string values ("true" or "false") for the checkbox
    const thumbnailFile = files.thumbnail

    try {
      await dbConnect()
      // Find the post by the current title
      const post = await BlogPost.findOne({ title: currentTitle })

      if (!post) {
        console.error("Post not found:", currentTitle)
        return res.status(404).json({ message: "Post not found" })
      }

      let thumbnailUrl = post.thumbnail_url

      // If a new thumbnail is uploaded, update the URL
      if (thumbnailFile && Array.isArray(thumbnailFile)) {
        const file = thumbnailFile[0] // Get the first file from the array

        const fileStream = fs.createReadStream(file.filepath)
        const s3Key = `thumbnails/${Date.now()}_${file.originalFilename}`

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Body: fileStream,
          ContentType: file.mimetype,
          ACL: "public-read",
        }

        await s3Client.send(new PutObjectCommand(params))

        // Delete the local file after uploading to S3
        fs.unlink(file.filepath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting local file:", unlinkErr)
          }
        })

        thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`
      }

      // Update the post with the new data
      post.title = newTitle || post.title
      post.thumbnail_url = thumbnailUrl
      post.isPublic = isPublic

      await post.save()

      res.status(200).json({
        title: post.title,
        thumbnail_url: post.thumbnail_url,
        isPublic: post.isPublic,
      })
    } catch (error) {
      console.error("Error updating post title and thumbnail:", error)
      res.status(500).json({
        message: "Failed to update post",
        error: error.message || error,
      })
    }
  })
}
