// libs/model/Project.js
import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  projectName: String,
  projectDescription: String,
  technologyUsed: String,
  projectPhotoUrl: String,
  discordChannel: Boolean,
  discordId: String,
  discordChannelId: String,
  userId: String,
})

// Check if the model exists using mongoose.modelNames() which returns all model names registered on mongoose instance.
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema)

export default Project
