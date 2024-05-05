import React, { useState, useRef } from "react"
import axios from "axios"

const ImageUploadModal = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [resizePercent, setResizePercent] = useState(100)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Handle file change and generate preview
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)

    // Create a preview URL for the image
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(file)
  }

  // Handle resizing input change
  const handleResizePercentChange = (event) => {
    const value = event.target.value
    if (value === "" || (!isNaN(value) && value >= 0 && value <= 100)) {
      setResizePercent(value)
    }
  }

  // Resize the image using canvas
  const resizeImage = (image, percentWidth) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Calculate new width based on percentage
    const containerWidth = containerRef.current.offsetWidth
    const newWidth = Math.round((percentWidth / 100) * containerWidth)
    const scale = newWidth / image.width
    const newHeight = Math.round(image.height * scale)

    // Set canvas dimensions and draw the image
    canvas.width = newWidth
    canvas.height = newHeight
    ctx.drawImage(image, 0, 0, newWidth, newHeight)

    return canvas.toDataURL("image/jpeg")
  }

  // Handle form submission with pre-signed URL
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (selectedFile) {
      const image = new Image()
      image.src = previewUrl

      image.onload = async () => {
        // Resize image
        const resizedImageUrl = resizeImage(image, resizePercent)

        // Convert to Blob
        const response = await fetch(resizedImageUrl)
        const blob = await response.blob()

        try {
          // Request pre-signed URL from your backend API
          const presignedResponse = await axios.post("/api/upload-image", {
            filename: selectedFile.name,
            filetype: blob.type,
          })

          const { presignedPost } = presignedResponse.data

          // Upload to S3 using the pre-signed URL
          const formData = new FormData()
          Object.keys(presignedPost.fields).forEach((key) => {
            formData.append(key, presignedPost.fields[key])
          })
          formData.append("file", blob, selectedFile.name)

          const s3Response = await fetch(presignedPost.url, {
            method: "POST",
            body: formData,
          })

          if (s3Response.ok) {
            onUpload(presignedResponse.data.imageUrl)
            onClose()
          } else {
            console.error("Image upload failed to S3")
          }
        } catch (error) {
          console.error(
            "Error obtaining presigned URL or uploading image:",
            error
          )
        }
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 9999 }}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
        ref={containerRef}
      >
        <h3 className="text-lg font-semibold">Upload and Resize Image</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Selected"
                style={{ width: `${resizePercent}%` }}
                className="mb-4"
              />
              <label>
                Resize Width (as % of container):
                <input
                  value={resizePercent}
                  onChange={handleResizePercentChange}
                  className="mt-2 ml-2 px-3 py-1 border rounded-md"
                  placeholder="Enter width percentage (0-100)"
                />
              </label>
            </div>
          )}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Upload
          </button>
          <button
            type="button"
            className="mt-4 ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>
        </form>
      </div>
      {/* Hidden canvas for resizing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}

export default ImageUploadModal
