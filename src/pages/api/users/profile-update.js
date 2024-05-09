import { IncomingForm } from "formidable"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import s3Client from "src/libs/aws-config"
import dbConnect from "src/libs/mongoose"
import User from "src/libs/model/User"

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing by Next.js
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  await dbConnect()

  const form = new IncomingForm()
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error while parsing form:", err)
      return res
        .status(500)
        .json({ message: "Form parsing error", error: err.toString() })
    }

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name
    const userId = Array.isArray(fields.userId)
      ? fields.userId[0]
      : fields.userId
    const file = files.file
    const fileName = fields.fileName // Extracted from the fields
    const fileType = fields.fileType // Extracted from the fields

    console.log(fileName)
    console.log(fileType)

    if (!userId || !name || !fileName || !fileType) {
      return res.status(400).json({
        message: "Name, User ID, FileName, and FileType are required.",
      })
    }

    try {
      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
      user.name = name

      let profilePicUrl = user.profilePicUrl
      let presignedPost = null // Declare presignedPost outside the if block

      if (file) {
        const s3Key = `profile/${Date.now()}_${fileName}`
        presignedPost = await createPresignedPost(s3Client, {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Fields: { "Content-Type": fileType, ACL: "public-read" },
          Conditions: [
            ["content-length-range", 0, 10000000], // Limit to 10MB
            { "Content-Type": fileType },
            { ACL: "public-read" },
          ],
          Expires: 60, // URL expires in 60 seconds
        })

        profilePicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`
        user.profilePicUrl = profilePicUrl
        console.log(presignedPost)
      }

      await user.save()
      res.status(200).json({
        message: "Profile updated successfully",
        name: user.name,
        profilePicUrl,
        presignedPostData: presignedPost ? presignedPost.fields : null, // Now presignedPost is accessible
      })
    } catch (error) {
      console.error("Failed to update user profile:", error)
      res.status(500).json({
        message: "Failed to update profile",
        error: error.message,
      })
    }
  })
}
