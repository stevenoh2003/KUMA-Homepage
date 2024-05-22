// src/pages/api/posts/[title].js
import dbConnect from "src/libs/mongoose"
import BlogPost from "src/libs/model/BlogPost"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "src/libs/aws-config"
import { NotionAPI } from "notion-client"

export default async function handler(req, res) {
  const { title } = req.query

  await dbConnect()

  try {
    const post = await BlogPost.findOne({ title: decodeURIComponent(title) })
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    if (post.notion_id) {
      const notion = new NotionAPI()
      const recordMap = await notion.getPage(post.notion_id)
      res.status(200).json({
        title: post.title,
        notion_id: post.notion_id,
        recordMap: recordMap,
        created_at: post.created_at,
        owner: post.owner,
        thumbnail_url: post.thumbnail_url,
        isPublic: post.isPublic,
      })
    } else if (post.s3_key) {
      const { Body } = await s3Client.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: post.s3_key,
        })
      )

      const content = await new Promise((resolve, reject) => {
        let data = ""
        Body.on("data", (chunk) => (data += chunk))
        Body.on("end", () => resolve(data))
        Body.on("error", reject)
      })

      res.status(200).json({
        title: post.title,
        content: content,
        created_at: post.created_at,
        owner: post.owner,
        thumbnail_url: post.thumbnail_url,
        isPublic: post.isPublic,
      })
    } else {
      res.status(404).json({ message: "No content available" })
    }
  } catch (error) {
    console.error("Failed to fetch post data:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch post data", error: error.message })
  }
}
