// model/User.js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    discordId: {type: String, required: false },

    profilePicUrl: { type: String, required: false },
  },
  { timestamps: true }
)

// Avoid overwriting existing model if already compiled in a previous operation
export default mongoose.models.User || mongoose.model("User", userSchema)
