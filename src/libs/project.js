// models/Email.js

import mongoose from "mongoose"

const emailSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
    unique: true, // Consider setting unique to true to prevent duplicate entries
  },
})

export default mongoose.models.Email || mongoose.model("Email", emailSchema)
