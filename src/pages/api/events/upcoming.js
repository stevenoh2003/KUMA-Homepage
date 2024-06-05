import dbConnect from "../../../libs/mongoose"
import Event from "src/libs/model/Event"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  await dbConnect()
  console.log("Connected to database") // Debug log

  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(3)
      .populate("createdBy", "name")
    console.log("Fetched events:", events) // Debug log

    return res.status(200).json(events)
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return res.status(500).json({
      message: "Failed to fetch events",
      error: error.message || error,
    })
  }
}
