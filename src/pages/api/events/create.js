import dbConnect from "../../../libs/mongoose"
import Event from "src/libs/model/Event"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  await dbConnect()

  const { title, date, notionLink, location, startTime, endTime, userId } =
    req.body

  try {
    // Create a new event
    const newEvent = new Event({
      name: title,
      date: new Date(date),
      notion_id: notionLink || null,
      location,
      startTime,
      endTime,
      createdBy: userId, // Ensure userId is correctly used
    })

    await newEvent.save()
    return res.status(201).json(newEvent)
  } catch (error) {
    console.error("API Error:", error)
    return res.status(500).json({
      message: "Failed to create the event",
      error: error.message || error,
    })
  }
}
