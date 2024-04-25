import React, { useState } from "react"
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid"

const CollaborationRequestForm = () => {
  const [createChannel, setCreateChannel] = useState(false)
  const [userId, setUserId] = useState("")
  const [file, setFile] = useState(null) // State for storing the uploaded file

  const handleSubmit = async (event) => {
    event.preventDefault()
    const channelName = event.target.elements["project-name"].value

    if (createChannel && userId) {
      console.log("Creating channel with user ID:", userId)
      try {
        const res = await fetch("/api/create-channel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ channelName, userId }),
        })

        const data = await res.json()
        if (data.success) {
          alert("Channel created successfully!")
        } else {
          alert("Failed to create channel.")
        }
      } catch (error) {
        console.error("Failed to submit:", error)
        alert("Error submitting form.")
      }
    } else {
      alert("Submit form without creating a channel.")
    }
  }
    const handleFileChange = (event) => {
      const file = event.target.files[0] // Get the file from the event
      if (file) {
        setFile(file) // Update the state with the new file
      }
    }

    const handleDeleteFile = () => {
      setFile(null) // Clear the file from state, allowing for a re-upload
    }

  return (
    <div className="max-w-4xl w-full md:w-1/2 mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Project Collaboration Request
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Share information about your project to attract collaborators.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="project-name"
                    id="project-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="project-description"
                    name="project-description"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Describe the project"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="technology-used"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Technology Used
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="technology-used"
                    id="technology-used"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="List technologies used (e.g., React, Node.js, etc.)"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="project-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a project photo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    {file && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-900">
                          Uploaded: {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={handleDeleteFile}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <p className="text-xs leading-5 text-gray-600">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="discord-channel" className="flex items-center">
                  <input
                    type="checkbox"
                    name="discord-channel"
                    id="discord-channel"
                    checked={createChannel}
                    onChange={(e) => setCreateChannel(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    Create private Discord channel for members
                  </span>
                </label>
                {createChannel && (
                  <div className="mt-4">
                    <label
                      htmlFor="user-id"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Enter User ID to add to the channel:
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="user-id"
                        id="user-id"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Discord User ID"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
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
