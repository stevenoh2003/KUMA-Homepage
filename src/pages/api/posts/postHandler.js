import dbConnect from "src/libs/mongoose.js"
import BlogPost from "src/libs/model/BlogPost.js"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "src/libs/aws-config"

async function handler(req, res) {
  if (req.method === "POST") {
    const { title, content, isNew } = req.body
    let s3Key = req.body.s3Key

    try {
      await dbConnect()

      if (isNew) {
        s3Key = `editorContent-${Date.now()}.html` // Save as HTML file
        const bucketParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Body: content, // This is now HTML
          ContentType: "text/html", // Set ContentType to HTML
        }
        await s3Client.send(new PutObjectCommand(bucketParams))

        const newPost = new BlogPost({ title, s3_key: s3Key })
        await newPost.save()
        res.status(201).json(newPost)
      } else {
        const bucketParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Body: content, // This is HTML
          ContentType: "text/html", // Set ContentType to HTML
        }
        await s3Client.send(new PutObjectCommand(bucketParams))
        res.status(200).json({ message: "Post updated successfully" })
      }
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({
        message: "Failed to create or update the post",
        error: error.message ? error.message : error,
      })
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}

export default handler
