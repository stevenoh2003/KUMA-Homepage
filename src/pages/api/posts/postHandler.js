// src/pages/api/posts/postHandler.js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "src/libs/aws-config"

async function handler(req, res) {
  await dbConnect()
  const {
    title,
    description,
    content,
    notionLink,
    isNew,
    userId,
    thumbnailUrl,
    isPublic,
  } = req.body
  let s3Key = req.body.s3Key || null

  try {
    const existingPost = await BlogPost.findOne({ title })
    if (existingPost) {
      return res.status(409).json({
        message:
          "A blog post with this title already exists. Please choose a different title.",
      })
    }

    if (isNew) {
      if (content) {
        s3Key = `editorContent-${Date.now()}.html`
        const bucketParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Body: content,
          ContentType: "text/html",
        }
        await s3Client.send(new PutObjectCommand(bucketParams))
      }

      const newPost = new BlogPost({
        title: title,
        description: description,
        s3_key: s3Key, // Ensure s3_key is included even if null
        notion_id: notionLink || null,
        thumbnail_url: thumbnailUrl,
        owner: userId,
        isPublic: isPublic,
      })
      await newPost.save()
      return res.status(201).json(newPost)
    } else {
      // Handle updating posts if required
    }
  } catch (error) {
    console.error("API Error:", error)
    return res.status(500).json({
      message: "Failed to create or update the post",
      error: error.message || error,
    })
  }
}

export default handler
