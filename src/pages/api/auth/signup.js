// pages/api/auth/signup.js
import dbConnect from "../../../libs/mongoose"
import User from "../../../libs/model/user"
import bcrypt from "bcryptjs"

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body

    await dbConnect()

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" })
      }

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create a new user with the hashed password
      const user = new User({
        name,
        email,
        password: hashedPassword,
      })

      // Save the user in the database
      await user.save()

      res.status(201).json({ message: "User created successfully!" })
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create user", error: error.message })
    }
  } else {
    // Not a POST request
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
