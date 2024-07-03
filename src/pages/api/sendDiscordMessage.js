// pages/api/sendDiscordMessage.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { DISCORD_BLOG_CHANNEL_ID, DISCORD_BOT_TOKEN, message } = req.body;

    console.log('Channel ID:', DISCORD_BLOG_CHANNEL_ID);
    console.log('Bot Token:', DISCORD_BOT_TOKEN);

    const url = `https://discord.com/api/v9/channels/${DISCORD_BLOG_CHANNEL_ID}/messages`;

    try {
      const response = await axios.post(
        url,
        {
          content: message,
        },
        {
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error sending message to Discord:', error.response?.data || error.message);
      res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
