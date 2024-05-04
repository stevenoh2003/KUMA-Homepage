// pages/api/discordForumThreadMessages.js
import axios from "axios"

// Fetch the first few messages from a given thread
async function fetchThreadMessages(threadId, discordToken, limit = 10) {
  try {
    const response = await axios.get(
      `https://discord.com/api/v10/channels/${threadId}/messages?limit=${limit}`,
      {
        headers: { Authorization: `Bot ${discordToken}` },
      }
    )

    // Return the messages in chronological order
    return response.data || []
  } catch (error) {
    console.error(
      `Error fetching messages from thread ${threadId}:`,
      error.message
    )
    return []
  }
}

export default async function handler(req, res) {
  const { DISCORD_BOT_TOKEN, DISCORD_FORUM_CHANNEL_ID } = process.env

  if (!DISCORD_BOT_TOKEN || !DISCORD_FORUM_CHANNEL_ID) {
    console.error("Missing environment variables")
    return res
      .status(500)
      .json({ message: "Missing Discord environment variables" })
  }

  try {
    // Fetch the active threads within the specified forum channel
    const response = await axios.get(
      `https://discord.com/api/v10/channels/${DISCORD_FORUM_CHANNEL_ID}/threads/active`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
      }
    )

    if (!response.data || !response.data.threads) {
      console.error("Unexpected response format", response.data)
      return res.status(500).json({ message: "Unexpected response format" })
    }

    // For each thread, retrieve its messages
    const threadMessages = await Promise.all(
      response.data.threads.map(async (thread) => {
        const messages = await fetchThreadMessages(
          thread.id,
          DISCORD_BOT_TOKEN,
          5
        ) // Adjust limit as needed
        console.log(`[Thread: ${thread.name}]`)
        messages.forEach((message) => {
          console.log(
            `[${message.id}] ${message.author.username}: ${message.content}`
          )
        })

        return { thread: thread.name, messages }
      })
    )

    return res.status(200).json({ threadMessages })
  } catch (error) {
    console.error(
      "Error fetching Discord forum thread messages:",
      error.toJSON ? error.toJSON() : error
    )
    return res.status(500).json({
      message: "Error fetching Discord forum thread messages",
      error: error.message,
    })
  }
}
