// pages/api/auth/signup.js
import dbConnect from "../../../libs/mongoose"
import User from "src/libs/model/User.js"
import bcrypt from "bcryptjs"
import { IncomingForm } from 'formidable'; // Adjusted import for formidable
import fs from "fs"
import path from "path"
import s3 from "../../../libs/aws-config"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "uploads")
    const form = new IncomingForm()
    form.keepExtensions = true
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err)
        return res
          .status(500)
          .json({ message: "File upload error", error: err })
      }

      console.log(files) // Log to inspect the structure of 'files'

      const { name, email, password } = fields
      const file = files.profilePic

      if (!file) {
        return res.status(400).json({ message: "No file uploaded." })
      }

      console.log("File path:", file.filepath) // Check if filepath exists
      console.log("File:", file)

      await dbConnect()

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" })
      }
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const fileContent = fs.readFileSync(file.filepath)

      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalFilename}`,
        Body: fileContent,
        ContentType: file.mimetype,
        ACL: "public-read",
      }

      try {
        const { Location } = await s3.upload(params).promise()
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({
          name,
          email,
          password: hashedPassword,
          profilePicUrl: Location,
        })

        await user.save()
        res.status(201).json({ message: "User created successfully!" })
      } catch (error) {
        console.error("Upload or DB error:", error)
        res
          .status(500)
          .json({ message: "Failed to create user", error: error.message })
      }
    })
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
