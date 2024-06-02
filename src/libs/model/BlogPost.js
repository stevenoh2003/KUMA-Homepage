// src/libs/model/BlogPost.js
import mongoose from "mongoose"

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  s3_key: { type: String, required: false },
  notion_id: { type: String, required: false },
  thumbnail_url: { type: String },
  created_at: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: false },
  tags: [{ type: String }], // Add the tags field as an array of strings
})

const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema)

export default BlogPost
