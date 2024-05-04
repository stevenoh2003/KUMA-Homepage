// pages/api/user/update.js

import dbConnect from "../../../libs/mongoose"
import User from "src/libs/model/User.js"
import { getSession } from "next-auth/react"
import { IncomingForm } from "formidable"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
import { promises as fsPromises } from "fs"
import { v4 as uuidv4 } from "uuid"

const s3Client = new S3Client({ region: process.env.S3_REGION })

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  const form = new IncomingForm({ keepExtensions: true, uploadDir: "/tmp" })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err)
      return res
        .status(500)
        .json({ message: "File parsing error", error: err.message })
    }

    await dbConnect()

    // Retrieve and update the user's name if provided
    const nameUpdate = Array.isArray(fields.name) ? fields.name[0] : fields.name

    // Prepare the update object
    const updateData = {}
    if (nameUpdate) {
      updateData.name = nameUpdate
    }

    try {
      let imageUrl

      // Handle file upload if provided
      if (files.file && files.file.filepath) {
        const file = files.file
        const fileStream = fs.createReadStream(file.filepath)
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${uuidv4()}-${file.originalFilename}`,
          Body: fileStream,
          ACL: "public-read",
        }

        const uploadResult = await s3Client.send(
          new PutObjectCommand(uploadParams)
        )
        imageUrl = uploadResult.Location
        await fsPromises.unlink(file.filepath) // Clean up the temp file storage

        // Update image URL in MongoDB if new image uploaded
        updateData.profilePicUrl = imageUrl
      }

      // Update user information in MongoDB
      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        updateData,
        { new: true }
      )

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" })
      }

      res.status(200).json(updatedUser)
    } catch (error) {
      console.error("Operation failed:", error)
      res
        .status(500)
        .json({ message: "Operation failed", error: error.message })
    }
  })
}
