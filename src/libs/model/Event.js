import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: false },
  notion_id: { type: String, required: false },
  created_at: { type: Date, default: Date.now },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)

export default Event
