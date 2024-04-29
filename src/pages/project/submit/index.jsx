import React, { useState } from "react"
import { PhotoIcon } from "@heroicons/react/24/solid"
import axios from "axios"

const CollaborationRequestForm = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    technologyUsed: "",
    discordId: "",
    createChannel: false,
    projectPic: null,
  })
  const [errorMessage, setErrorMessage] = useState("") // State for storing error messages

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] })) // Ensure files[0] exists
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }
const handleSubmit = async (event) => {
  event.preventDefault()

  const data = new FormData()
  Object.keys(formData).forEach((key) => {
    if (key === "projectPic" && formData[key] !== null) {
      data.append(key, formData[key], formData[key].name)
    } else {
      data.append(key, formData[key])
    }
  })

  try {
    if (formData["createChannel"] && formData["discordId"]) {
      const resChannel = await fetch("/api/create-channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName: formData["projectName"],
          userId: formData["discordId"],
        }),
      })
      const dataChannel = await resChannel.json()
      if (!dataChannel.success) {
        setErrorMessage(
          "Failed to create channel. Please check if the Discord ID is correct."
        )
        return // Stop the execution if channel creation fails
      }

      // Add the channel ID to the FormData
      data.append("discordChannelId", dataChannel.channelId)
      alert("Channel created successfully!")
    }

    // Submit project data along with the new Discord channel ID if available
    const response = await axios.post("/api/submit_project", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    alert("Project submitted successfully!")
    console.log(response.data)
  } catch (error) {
    console.error("Failed to submit:", error)
    alert("Error submitting form.")
  }
}


  return (
    <div className="max-w-4xl w-full md:w-1/2 mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Project Collaboration Request
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Share information about your project to attract collaborators.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-1 gap-x-6 gap-y-8">
              <input
                type="text"
                name="projectName"
                placeholder="Enter project name"
                onChange={handleChange}
                value={formData.projectName}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <textarea
                id="projectDescription"
                name="projectDescription"
                placeholder="Describe the project"
                onChange={handleChange}
                value={formData.projectDescription}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <input
                type="text"
                name="technologyUsed"
                placeholder="List technologies used (e.g., React, Node.js, etc.)"
                onChange={handleChange}
                value={formData.technologyUsed}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <label
                    htmlFor="projectPic"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a project photo</span>
                    <input
                      id="projectPic"
                      name="projectPic"
                      type="file"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                  {formData.projectPic && (
                    <div>
                      <p>Uploaded: {formData.projectPic.name}</p>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, projectPic: null }))
                        }
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <label htmlFor="createChannel" className="flex items-center">
                <input
                  type="checkbox"
                  name="createChannel"
                  checked={formData.createChannel}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2">
                  Create private Discord channel for members
                </span>
              </label>
              {formData.createChannel && (
                <>
                  <input
                    type="text"
                    name="discordId"
                    placeholder="Discord User ID"
                    onChange={handleChange}
                    value={formData.discordId}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CollaborationRequestForm
