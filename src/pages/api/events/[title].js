import dbConnect from "src/libs/mongoose"
import Event from "src/libs/model/Event"
import { NotionAPI } from "notion-client"

export default async function handler(req, res) {
  const { title } = req.query

  await dbConnect()

  try {
    const event = await Event.findOne({
      name: decodeURIComponent(title),
    }).populate("createdBy", "name profilePicUrl")
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    if (event.notion_id) {
      const notion = new NotionAPI()
      const recordMap = await notion.getPage(event.notion_id)
      res.status(200).json({
        name: event.name,
        notion_id: event.notion_id,
        recordMap: recordMap,
        date: event.date,
        createdBy: event.createdBy,
        location: event.location,
        created_at: event.created_at,
      })
    } else {
      res.status(404).json({ message: "No Notion content available" })
    }
  } catch (error) {
    console.error("Failed to fetch event data:", error)
    res
      .status(500)
      .json({ message: "Failed to fetch event data", error: error.message })
  }
}
