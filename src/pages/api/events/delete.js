import dbConnect from "../../../libs/mongoose"
import Event from "../../../libs/model/Event"

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  await dbConnect()

  const { id } = req.body

  try {
    const event = await Event.findById(id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    await Event.deleteOne({ _id: id })
    return res.status(200).json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("API Error:", error)
    return res.status(500).json({
      message: "Failed to delete the event",
      error: error.message || error,
    })
  }
}
