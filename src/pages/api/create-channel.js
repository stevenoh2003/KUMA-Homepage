// pages/api/create-channel.js
import axios from "axios"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { channelName, userId } = req.body // userId should be passed from the client
    const serverId = process.env.DISCORD_SERVER_ID
    const botToken = process.env.DISCORD_BOT_TOKEN

    try {
      // Create the channel with default private settings (no one can see)
      const response = await axios.post(
        `https://discord.com/api/v9/guilds/${serverId}/channels`,
        {
          name: channelName,
          type: 0, // 0 is the type for a text channel
          permission_overwrites: [
            {
              id: serverId,
              type: 0, // Role type
              deny: 0x400, // Deny VIEW_CHANNEL permission
            },
            {
              id: userId, // Granting access to the user
              type: 1, // Member type
              allow: 0x400, // Allow VIEW_CHANNEL permission
            },
          ],
        },
        {
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      // Optionally set up permissions for the bot and other specifics here

      return res
        .status(200)
        .json({ success: true, channelId: response.data.id })
    } catch (error) {
      console.error("Error creating channel:", error)
      return res
        .status(500)
        .json({ success: false, message: "Failed to create channel" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
