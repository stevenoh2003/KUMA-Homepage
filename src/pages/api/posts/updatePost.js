import dbConnect from "src/libs/mongoose.js";
import BlogPost from "src/libs/model/BlogPost.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "src/libs/aws-config";

async function handler(req, res) {
  const { method } = req;
  if (method === "POST") {
    const { title, content } = req.body;

    await dbConnect();
    let post = await BlogPost.findOne({ title: title });

    try {
      let s3Key;
      if (post) {
        // Update existing post
        s3Key = post.s3_key; // Use existing S3 key
      } else {
        // Create new post
        s3Key = `editorContent-${Date.now()}.html`; // New S3 key for new posts
        post = new BlogPost({ title, s3_key: s3Key });
      }

      const bucketParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
        Body: content,
        ContentType: "text/html",
      };
      await s3Client.send(new PutObjectCommand(bucketParams));
      await post.save();
      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ message: "Failed to update the post", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;
