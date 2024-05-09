import dbConnect from "src/libs/mongoose"
import User from "src/libs/model/User"
import { IncomingForm } from "formidable"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import s3Client from "src/libs/aws-config"

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

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Form parsing error", error: err.toString() })
    }

    // Extract and validate fields
    const userId =
      fields.userId && !Array.isArray(fields.userId) ? fields.userId : null
    const fileName =
      fields.fileName && !Array.isArray(fields.fileName)
        ? fields.fileName
        : null
    const fileType =
      fields.fileType && !Array.isArray(fields.fileType)
        ? fields.fileType
        : null

    if (!userId || !fileName || !fileType) {
      return res.status(400).json({ message: "Missing or invalid parameters" })
    }

    // Sanitize file name for URL usage
    const safeFileName = encodeURIComponent(fileName).replace(
      /[!'()*]/g,
      escape
    )

    await dbConnect()

    // Retrieve user from the database
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate S3 key and pre-signed POST URL
    const s3Key = `profile-pictures/${Date.now()}_${safeFileName}`
    try {
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Fields: { "Content-Type": fileType, ACL: "public-read" },
        Conditions: [
          ["content-length-range", 0, 10000000], // Limit to 5MB
          { "Content-Type": fileType },
          { ACL: "public-read" },
        ],
        Expires: 60, // URL expires in 60 seconds
      })

      // Update user profile with the new profile picture URL
      const updates = {
        profilePicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`,
      }
      await User.findByIdAndUpdate(userId, { $set: updates }, { new: true })

      res.status(200).json({
        message: "Profile updated successfully!",
        presignedPost,
        updates,
      })
    } catch (error) {
      console.error("Error during presigned URL generation:", error)
      res.status(500).json({
        message: "Pre-signed URL generation failed",
        error: error.message,
      })
    }
  })
}
