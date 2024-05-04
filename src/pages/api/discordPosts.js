// pages/api/discordPosts.js
import axios from "axios"

// Define a map of tag names to emojis
const tagEmojiMap = {
  Robotics: "🤖",
  "Machine Learning": "🧠",
  Software: "🌐",
  Hardware: "📊",
  "Unknown Tag": "❓",
}

// Fetch the first message of a thread
async function fetchFirstMessage(threadId, discordToken) {
  try {
    // Retrieve up to 10 messages (or adjust limit as needed)
    const response = await axios.get(
      `https://discord.com/api/v10/channels/${threadId}/messages?limit=10`,
      {
        headers: { Authorization: `Bot ${discordToken}` },
      }
    )

    // Check and sort messages to find the first one
    if (response.data && response.data.length > 0) {
      const messages = response.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )
      return messages[0].content || "No description available."
    } else {
      console.log(`No messages found in thread ${threadId}`)
      return "No description available."
    }
  } catch (error) {
    console.error(
      `Error fetching first message for thread ${threadId}:`,
      error.message
    )
    return "No description available."
  }
}

export default async function handler(req, res) {
  const { DISCORD_BOT_TOKEN, DISCORD_FORUM_CHANNEL_ID, DISCORD_GUILD_ID } =
    process.env

  if (!DISCORD_BOT_TOKEN || !DISCORD_FORUM_CHANNEL_ID || !DISCORD_GUILD_ID) {
    console.error("Missing environment variables")
    return res
      .status(500)
      .json({ message: "Missing Discord environment variables" })
  }

  try {
    // Fetch forum channel data to obtain tag definitions
    const forumChannelResponse = await axios.get(
      `https://discord.com/api/v10/channels/${DISCORD_FORUM_CHANNEL_ID}`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
      }
    )

    const tagMap = forumChannelResponse.data.available_tags.reduce(
      (acc, tag) => {
        acc[tag.id] = tag.name
        return acc
      },
      {}
    )

    // Fetch active threads from the guild
    const guildResponse = await axios.get(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/threads/active`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
      }
    )

    if (!guildResponse.data || !guildResponse.data.threads) {
      console.error("Unexpected response format", guildResponse.data)
      return res.status(500).json({ message: "Unexpected response format" })
    }

    // Fetch and map each thread's first message
    const posts = await Promise.all(
      guildResponse.data.threads
        .filter((thread) => thread.parent_id === DISCORD_FORUM_CHANNEL_ID)
        .map(async (thread) => {
          const description = await fetchFirstMessage(
            thread.id,
            DISCORD_BOT_TOKEN
          )
          return {
            title: thread.name,
            date: new Date(thread.created_at).toLocaleDateString(),
            authorId: thread.owner_id,
            id: thread.id,
            tags: (thread.applied_tags || []).map(
              (tagId) =>
                tagEmojiMap[tagMap[tagId]] || tagEmojiMap["Unknown Tag"]
            ),
            url: `https://discord.com/channels/${DISCORD_GUILD_ID}/${thread.id}`,
            description,
          }
        })
    )

    return res.status(200).json(posts)
  } catch (error) {
    console.error(
      "Error fetching Discord posts:",
      error.toJSON ? error.toJSON() : error
    )
    return res.status(500).json({
      message: "Error fetching Discord posts",
      error: error.message,
    })
  }
}
