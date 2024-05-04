// components/ImageUploadModal.js
import React, { useState, useRef, useEffect } from "react"

const ImageUploadModal = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [resizePercent, setResizePercent] = useState(100) // Default to 100% of the container width
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Handle image file change
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)

    // Create a preview URL for the image
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(file)
  }

  // Handle resizing input change
  // components/ImageUploadModal.js
  const handleResizePercentChange = (event) => {
    const value = event.target.value

    // Allow empty string or numeric values only
    if (value === "" || (!isNaN(value) && value >= 0 && value <= 100)) {
      setResizePercent(value) // Store as string to handle empty input
    }
  }

  // Resize the image using a canvas
  const resizeImage = (image, percentWidth) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Calculate the new width in pixels based on the percentage of the container width
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

  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (selectedFile) {
      const image = new Image()
      image.src = previewUrl

      // Wait for the image to load before resizing
      image.onload = async () => {
        // Resize the image using the specified percentage width
        const imageUrl = resizeImage(image, resizePercent)

        // Convert the base64 image to a blob
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const formData = new FormData()
        formData.append("image", blob, selectedFile.name)

        // Send the resized image to the server
        const serverResponse = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        })

        const data = await serverResponse.json()
        if (serverResponse.ok) {
          onUpload(data.url)
          onClose() // Close the modal
        } else {
          console.error("Image upload failed:", data.message)
        }
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 9999 }} // High z-index to ensure it stays on top
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
