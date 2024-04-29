// pages/api/project/[id].js
import dbConnect from "../../../libs/mongoose"
import Project from "../../../libs/model/Project" // Update this path if necessary

export default async function handler(req, res) {
  const { id } = req.query // Get the ID from the query parameter

  try {
    await dbConnect()

    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.status(200).json(project)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch project", error: error.message })
  }
}
