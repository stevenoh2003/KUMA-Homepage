import mongoose from "mongoose"

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  s3_key: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
})

const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema)

export default BlogPost
