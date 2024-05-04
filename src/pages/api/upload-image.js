// pages/api/upload-image.js
import { IncomingForm } from "formidable"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "../../libs/aws-config"
import fs from "fs"
import path from "path"

export const config = {
  api: {
    bodyParser: false, // Disables Next.js's default body parser to use Formidable
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const uploadDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload error", error: err.toString() })
    }

    const file = files.image && files.image[0]

    try {
      const fileStream = fs.createReadStream(file.filepath)
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${file.originalFilename}`,
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

      const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`

      res
        .status(201)
        .json({ message: "Image uploaded successfully", url: imageUrl })
    } catch (error) {
      console.error("Error during image upload:", error)
      res
        .status(500)
        .json({ message: "Image upload failed", error: error.message })
    }
  })
}
