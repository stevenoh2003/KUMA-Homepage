// components/SendMessageButton.js
import { useState } from "react"
import axios from "axios"

const SendMessageButton = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const sendMessage = async () => {
    setLoading(true)
    try {
      const response = await axios.post("/api/sendDiscordMessage", {
        DISCORD_BLOG_CHANNEL_ID:
          process.env.NEXT_PUBLIC_DISCORD_BLOG_CHANNEL_ID,
        DISCORD_BOT_TOKEN: process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN,
        message: message || "Test message from Next.js",
      })

      if (response.data.success) {
        alert("Message sent successfully!")
      } else {
        alert("Failed to send message")
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      )
      alert("Error sending message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send Test Message"}
      </button>
    </div>
  )
}

export default SendMessageButton
