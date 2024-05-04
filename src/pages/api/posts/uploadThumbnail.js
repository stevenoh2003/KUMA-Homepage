// src/pages/api/posts/uploadThumbnail.js
import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
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

  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // Configure formidable to handle file uploads
  const form = new IncomingForm({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error while parsing form:", err)
      return res
        .status(500)
        .json({ message: "File upload error", error: err.toString() })
    }

    // Retrieve the uploaded file
    const file = files.thumbnail && files.thumbnail[0]
    if (!file) {
      return res.status(400).json({ message: "No thumbnail file provided" })
    }

    const fileStream = fs.createReadStream(file.filepath)
    const s3Key = `thumbnails/${Date.now()}_${file.originalFilename}`

    // Set up S3 parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileStream,
      ContentType: file.mimetype,
      ACL: "public-read", // Make the uploaded file public
    }

    try {
      // Upload to S3
      await s3Client.send(new PutObjectCommand(params))

      // Delete the locally uploaded file
      fs.unlink(file.filepath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting local file:", unlinkErr)
        }
      })

      // Create the public URL to the uploaded file
      const thumbnailUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`

      // Send back the thumbnail URL
      res.status(200).json({ url: thumbnailUrl })
    } catch (error) {
      console.error("Error uploading to S3:", error)
      res
        .status(500)
        .json({ message: "Failed to upload thumbnail", error: error.message })
    }
  })
}
