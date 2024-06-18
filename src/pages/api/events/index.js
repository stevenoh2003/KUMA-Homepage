import dbConnect from "src/libs/mongoose"
import Event from "src/libs/model/Event"

const MAX_RETRIES = 5
const RETRY_DELAY = 1000 // in milliseconds

async function fetchEventsWithRetry(retries) {
  try {
    const events = await Event.find({}).populate(
      "createdBy",
      "name profilePicUrl"
    )
    return events
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `Fetch events failed. Retrying in ${RETRY_DELAY}ms...`,
        error
      )
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return fetchEventsWithRetry(retries - 1)
    } else {
      throw error
    }
  }
}

export default async function handler(req, res) {
  try {
    await dbConnect()
  } catch (error) {
    console.error("Database connection failed:", error)
    return res.status(500).json({ message: "Database connection failed" })
  }

  if (req.method === "GET") {
    try {
      const events = await fetchEventsWithRetry(MAX_RETRIES)
      res.status(200).json(events)
    } catch (error) {
      console.error("Failed to fetch events after retries:", error)
      res.status(500).json({ message: "Failed to fetch events after retries" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
