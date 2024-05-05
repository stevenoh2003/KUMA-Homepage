import { IncomingForm } from "formidable"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
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

  const form = new IncomingForm()

  form.parse(req, async (err, fields) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Form parsing error", error: err.toString() })
    }

    // Extract desired image information (file type and name)
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
      // Generate the S3 key
      const s3Key = `uploads/${Date.now()}_${cleanFilename}`

      // Create a pre-signed POST URL
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Fields: { "Content-Type": cleanFiletype, ACL: "public-read" },
        Conditions: [
          ["content-length-range", 0, 5000000], // Limit to 5MB
          { "Content-Type": cleanFiletype },
          { ACL: "public-read" },
        ],
        Expires: 60, // URL expires in 60 seconds
      })

      // Return the pre-signed URL and other required fields
      res.status(201).json({
        message: "Pre-signed URL created successfully",
        presignedPost,
        imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`,
      })
    } catch (error) {
      // Log any errors during the pre-signed URL creation
      console.error("Error during presigned URL generation:", error)
      res
        .status(500)
        .json({
          message: "Pre-signed URL generation failed",
          error: error.message,
        })
    }
  })
}
