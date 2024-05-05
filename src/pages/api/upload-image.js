import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "../../libs/aws-config"

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser to use Formidable
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

  // Set up the form with the specified upload directory
  const form = new IncomingForm({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload error", error: err.toString() })
    }

    // Access the uploaded image file
    const file = files.image && files.image[0]
    if (!file) {
      return res.status(400).json({ message: "Image file is required." })
    }

    try {
      // Set S3 parameters for file upload
      const s3Key = `uploads/${Date.now()}_${file.originalFilename}`
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: fs.createReadStream(file.filepath),
        ContentType: file.mimetype,
        ACL: "public-read",
      })

      // Upload the file using the imported `s3Client`
      await s3Client.send(uploadCommand)

      // Delete the local file after successfully uploading to S3
      fs.unlink(file.filepath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting local file:", unlinkErr)
        }
      })

      // Create the full image URL to send back in the response
      const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`

      // Respond with the image URL and success message
      res
        .status(201)
        .json({ message: "Image uploaded successfully", url: imageUrl })
    } catch (error) {
      // Log any errors that occur during the upload process
      console.error("Error during image upload:", error)
      res
        .status(500)
        .json({ message: "Image upload failed", error: error.message })
    }
  })
}
