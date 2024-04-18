import dbConnect from "../../libs/mongoose"
import Email from "../../libs/email"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === "POST") {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({ error: "Email is required" })
      }

      const newEmail = new Email({ email })
      await newEmail.save()
      res.status(201).json({ message: "Email submitted successfully" })
    } catch (error) {
      console.error("API Error:", error)
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end("Method Not Allowed")
  }
}
