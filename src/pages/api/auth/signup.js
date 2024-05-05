import dbConnect from "../../../libs/mongoose"
import User from "src/libs/model/User.js"
import bcrypt from "bcryptjs"
import { IncomingForm } from "formidable"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import s3Client from "../../../libs/aws-config"

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle multipart form data
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const form = new IncomingForm({ multiples: true, keepExtensions: true })

  form.parse(req, async (err, fields) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Form parsing error", error: err.toString() })
    }

    // Extract form fields
    const { name, email, password, discordId } = fields
    const filename = "profilePic.jpg" // Placeholder filename as it's uploaded directly from the client
    const filetype = "image/jpeg" // Assume JPEG; ensure correct type on the frontend

    const cleanName = Array.isArray(name) ? name[0] : name
    const cleanEmail = Array.isArray(email) ? email[0] : null
    const cleanPassword = Array.isArray(password) ? password[0] : password
    const cleanDiscordId = Array.isArray(discordId) ? discordId[0] : discordId

    try {
      // Connect to the database
      await dbConnect()
      const existingUser = await User.findOne({ email: cleanEmail })
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" })
      }

      // Generate a pre-signed POST URL for direct upload to S3
      const s3Key = `uploads/${Date.now()}_${filename}`
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Fields: { "Content-Type": filetype, ACL: "public-read" },
        Conditions: [
          ["content-length-range", 0, 5000000], // Limit to 5MB
          { "Content-Type": filetype },
          { ACL: "public-read" },
        ],
        Expires: 60, // URL expires in 60 seconds
      })

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(cleanPassword, 12)

      // Create a new user in MongoDB
      const newUser = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        discordId: cleanDiscordId,
        profilePicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`,
      })

      // Send pre-signed URL info and user data to the frontend
      res.status(201).json({
        message: "Pre-signed URL created successfully",
        presignedPost,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          discordId: newUser.discordId,
          profilePicUrl: newUser.profilePicUrl,
        },
      })
    } catch (error) {
      console.error("Error during user creation:", error)
      res
        .status(500)
        .json({ message: "Failed to create user", error: error.message })
    }
  })
}
