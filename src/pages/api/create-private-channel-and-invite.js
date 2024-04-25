// pages/api/create-private-channel-and-invite.js
import axios from "axios"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { channelName } = req.body
    const serverId = process.env.DISCORD_SERVER_ID
    const botToken = process.env.DISCORD_BOT_TOKEN

    try {
      // Create a private channel
      const channelResponse = await axios.post(
        `https://discord.com/api/v9/guilds/${serverId}/channels`,
        {
          name: channelName,
          type: 0, // 0 for a text channel
          permission_overwrites: [
            {
              id: serverId,
              type: 0, // 0 means role
              deny: 1024, // Denies VIEW_CHANNEL permission to @everyone
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

      const channelId = channelResponse.data.id

      // Generate an invite to the private channel
      const inviteResponse = await axios.post(
        `https://discord.com/api/v9/channels/${channelId}/invites`,
        {
          max_age: 86400, // Invite valid for 1 day
          max_uses: 100, // Invite can be used 100 times
          unique: true,
        },
        {
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      const inviteCode = inviteResponse.data.code
      const inviteLink = `https://discord.gg/${inviteCode}`

      return res
        .status(200)
        .json({ success: true, channelId: channelId, inviteLink: inviteLink })
    } catch (error) {
      console.error("Error creating channel or invite:", error)
      return res
        .status(500)
        .json({ success: false, message: "Failed to create channel or invite" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
