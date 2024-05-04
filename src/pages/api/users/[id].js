import dbConnect from "src/libs/mongoose"
import User from "src/libs/model/User"
import mongoose from "mongoose"

export default async function handler(req, res) {
  const { id } = req.query

  await dbConnect()

  try {
    // Ensure the ID is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" })
    }

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
