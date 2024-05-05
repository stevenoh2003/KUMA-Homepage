import dbConnect from "../../../libs/mongoose"
import User from "src/libs/model/User.js" // Verify the path
import bcrypt from "bcryptjs"
import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"
import { Upload } from "@aws-sdk/lib-storage"
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

  // Set up the directory to temporarily store files
  const uploadDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  // Configure and parse the incoming form data
  const form = new IncomingForm({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload error", error: err.toString() })
    }

    console.log(fields) // Debugging: Ensure correct form data is received

    // Extract form fields and sanitize
    const { name, email, password, discordId } = fields
    const cleanName = Array.isArray(name) ? name[0] : name
    const cleanEmail =
      Array.isArray(email) && email.length > 0 ? email[0] : null
    const cleanPassword = Array.isArray(password) ? password[0] : password
    const cleanDiscordId = Array.isArray(discordId) ? discordId[0] : discordId

    // Check for the uploaded file
    const file = files.profilePic && files.profilePic[0]
    if (!file) {
      return res.status(400).json({ message: "Profile picture is required" })
    }

    try {
      // Connect to the database
      await dbConnect()
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" })
      }

      // Define the S3 upload parameters
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalFilename}`,
        Body: fs.createReadStream(file.filepath),
        ContentType: file.mimetype,
        ACL: "public-read",
      }

      // Upload to S3 using the Upload class from lib-storage
      const upload = new Upload({
        client: s3Client,
        params,
      })
      await upload.done()

      // Remove the local file after uploading to S3
      fs.unlink(file.filepath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting local file:", unlinkErr)
        }
      })

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(cleanPassword, 12)

      // Create a new user in MongoDB
      const newUser = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        discordId: cleanDiscordId,
        profilePicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${params.Key}`,
      })

      // Log the new user for debugging purposes
      console.log(newUser)

      // Respond with the created user (excluding sensitive info)
      res.status(201).json({
        message: "User created successfully!",
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
