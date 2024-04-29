import dbConnect from "../../libs/mongoose"
import Project from "src/libs/model/Project.js" // Ensure the path is correct
import { IncomingForm } from "formidable"
import fs from "fs"
import path from "path"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "../../libs/aws-config"
import { getSession } from "next-auth/react"


export const config = {
  api: {
    bodyParser: false, // Disable the default bodyParser to use formidable
  },
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  const session = await getSession({ req })
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const uploadDir = path.join(process.cwd(), "uploads")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const form = new IncomingForm({ uploadDir, keepExtensions: true })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form Parse Error:", err)
      return res
        .status(500)
        .json({ message: "Error processing form data", error: err.toString() })
    }

    // console.log("Fields:", fields)
    // console.log("Files:", files)

    const {
      projectName,
      projectDescription,
      technologyUsed,
      createChannel,
      discordId,
      discordChannelId,
    } = fields

    const cleanProjectName = Array.isArray(projectName)
      ? projectName[0]
      : projectName
    const cleanProjectDescription = Array.isArray(projectDescription)
      ? projectDescription[0]
      : projectDescription
    const cleanTechnologyUsed = Array.isArray(technologyUsed)
      ? technologyUsed[0]
      : technologyUsed
    const cleanCreateChannel = Array.isArray(createChannel)
      ? createChannel[0]
      : createChannel
    const cleandiscordId = Array.isArray(discordId) ? discordId[0] : discordId
    const cleanDiscordChannelId = Array.isArray(discordChannelId)
      ? discordChannelId[0]
      : discordChannelId


    let fileUrl = null
    const file = files.projectPic && files.projectPic[0]

    if (!file || !file.filepath) {
      return res.status(400).json({ message: "No file uploaded." })
    }

    try {
      const fileStream = fs.createReadStream(file.filepath)
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalFilename}`,
        Body: fileStream,
        ContentType: file.mimetype,
        ACL: "public-read",
      }

      await s3Client.send(new PutObjectCommand(uploadParams))
      fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`

      // Optionally delete the local file after upload
      fs.unlink(file.filepath, (err) => {
        if (err) console.error("Error deleting file:", err)
      })
    } catch (uploadError) {
      console.error("File upload error:", uploadError)
      return res.status(500).json({
        message: "Failed to upload file",
        error: uploadError.message,
      })
    }

    try {
      await dbConnect()
      const newProject = await Project.create({
        projectName: cleanProjectName,
        projectDescription: cleanProjectDescription,
        technologyUsed: cleanTechnologyUsed,
        projectPhotoUrl: fileUrl,
        discordChannel: cleanCreateChannel === "true",
        discordChannelId: cleanDiscordChannelId,
        discordId: cleandiscordId,
        userId: session.user.id,
      })
      return res
        .status(201)
        .json({ message: "Project created successfully", project: newProject })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return res
        .status(500)
        .json({ message: "Failed to create project", error: dbError.message })
    }
  })
}
