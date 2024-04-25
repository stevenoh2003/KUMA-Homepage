// lib/aws-config.js
import AWS from "aws-sdk"

const config = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
}

AWS.config.update(config)

const s3 = new AWS.S3()

export default s3
