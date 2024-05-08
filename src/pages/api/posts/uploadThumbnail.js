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

    // Extract desired image filename and type
    const { filename, filetype } = fields
    const cleanFilename = Array.isArray(filename) ? filename[0] : filename
    const cleanFiletype = Array.isArray(filetype) ? filetype[0] : filetype

    // Validate the fields
    if (!cleanFilename || !cleanFiletype) {
      return res
        .status(400)
        .json({ message: "Filename and filetype are required." })
    }

    try {
      // Generate a pre-signed POST URL for direct upload to S3
      const s3Key = `thumbnails/${Date.now()}_${cleanFilename}`
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Fields: { "Content-Type": cleanFiletype, ACL: "public-read" },
        Conditions: [
          ["content-length-range", 0, 10000000], // Limit to 5MB
          { "Content-Type": cleanFiletype },
          { ACL: "public-read" },
        ],
        Expires: 60, // URL expires in 60 seconds
      })

      // Create the public URL to the uploaded file
      const thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`

      // Send back the pre-signed URL info and thumbnail URL
      res.status(200).json({ presignedPost, thumbnailUrl })
    } catch (error) {
      console.error("Error creating presigned post:", error)
      res
        .status(500)
        .json({
          message: "Failed to generate presigned URL",
          error: error.message,
        })
    }
  })
}
