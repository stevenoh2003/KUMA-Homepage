// src/pages/api/user/update.js
import dbConnect from "src/libs/mongoose"
import User from "src/libs/model/User"
import { IncomingForm } from "formidable"
import bcrypt from "bcryptjs"
import s3Client from "src/libs/aws-config"

export const config = {
  api: {
    bodyParser: false, // Use IncomingForm for file uploads
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const form = new IncomingForm({ multiples: true, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parsing error:", err)
      return res
        .status(500)
        .json({ message: "Form parsing error", error: err.toString() })
    }

    const { name, email, newPassword } = fields
    const profilePicFile = files.file || null

    try {
      await dbConnect()
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update name if provided
      if (name) user.name = name

      // Handle profile image only if present
      if (profilePicFile) {
        // Assume logic here to upload file to S3 or similar and update `profilePicUrl`
      }

      // Update password if provided
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 12)
      }

      await user.save()
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
      })
    } catch (error) {
      console.error("Profile update error:", error)
      res
        .status(500)
        .json({ message: "Profile update failed", error: error.message })
    }
  })
}
