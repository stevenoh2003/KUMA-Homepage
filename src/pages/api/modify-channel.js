import axios from "axios"
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, channelId } = req.body
    const serverId = process.env.DISCORD_SERVER_ID
    const botToken = process.env.DISCORD_BOT_TOKEN

    if (channelId) {
      try {
        const permissionData = {
          allow: "1024", // VIEW_CHANNEL permission
          deny: "0", // No permissions denied
          type: 1, // Member type
        }

        const config = {
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
        }

        await axios.put(
          `https://discord.com/api/v9/channels/${channelId}/permissions/${userId}`,
          JSON.stringify(permissionData),
          config
        )

        console.log("User added to channel with ID:", channelId)
        return res.status(200).json({ success: true, channelId })
      } catch (error) {
        console.error("Error adding user to channel:", error)
        return res
          .status(500)
          .json({ success: false, message: "Failed to add user to channel" })
      }
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
