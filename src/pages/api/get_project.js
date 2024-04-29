// pages/api/get_project.js
import dbConnect from "../../libs/mongoose"
import Project from "src/libs/model/Project" // Verify your import path

export default async function handler(req, res) {
  const { page = 1, limit = 12 } = req.query // Default to page 1 and 12 items per page

  try {
    await dbConnect()

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit

    // Fetch projects with pagination
    const projects = await Project.find({})
      .skip(parseInt(skip))
      .limit(parseInt(limit))

    // Get total number of documents
    const count = await Project.countDocuments()

    res.status(200).json({
      data: projects,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch projects", error: error.message })
  }
}
