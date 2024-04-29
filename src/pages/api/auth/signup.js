import dbConnect from "../../../libs/mongoose"
import User from "src/libs/model/User.js" // Verify the path
import bcrypt from "bcryptjs"
import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "../../../libs/aws-config"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
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
    console.log(fields) // Log to see what is received in fields

    const { name, email, password, discordId } = fields
    const cleanName = Array.isArray(name) ? name[0] : name
    const cleanEmail =
      Array.isArray(email) && email.length > 0 ? email[0] : null

    const cleanPassword = Array.isArray(password) ? password[0] : password
    console.log(discordId)
    const cleanDiscordId = Array.isArray(discordId) ? discordId[0] : discordId

    const file = files.profilePic && files.profilePic[0]

    try {
      await dbConnect()
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" })
      }

      const fileStream = fs.createReadStream(file.filepath)
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalFilename}`,
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

      const hashedPassword = await bcrypt.hash(cleanPassword, 12)
      const newUser = await User.create({
        name: cleanName, // Use 'name', not 'cleanName'
        email: cleanEmail, // Use 'email', not 'cleanEmail'
        password: hashedPassword,
        discordId: cleanDiscordId,
        profilePicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`,
      })

      console.log(newUser)

      res
        .status(201)
        .json({
          message: "User created successfully!",
          user: {
            id: newUser._id,
            name,
            email, discordId,
            profilePicUrl: newUser.profilePicUrl,
          },
        }) // Exclude password
    } catch (error) {
      console.error("Error during user creation:", error)
      res
        .status(500)
        .json({ message: "Failed to create user", error: error.message })
    }
  })
}
