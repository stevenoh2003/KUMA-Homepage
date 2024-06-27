import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogPost",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
})

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export default Comment
