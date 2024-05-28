import dbConnect from "src/libs/mongoose"
import Event from "src/libs/model/Event"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const events = await Event.find({}).populate(
        "createdBy",
        "name profilePicUrl"
      )
      res.status(200).json(events)
    } catch (error) {
      console.error("Failed to fetch events:", error)
      res.status(500).json({ message: "Failed to fetch events" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
