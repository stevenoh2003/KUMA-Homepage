import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import TimePicker from "rc-time-picker"
import moment from "moment"
import "rc-time-picker/assets/index.css"

const CreateEvent = () => {
  const { data: session, status } = useSession()
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    notionLink: "",
    locationType: "Virtual",
    location: "",
    startTime: null,
    endTime: null,
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTimeChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const extractNotionId = (url) => {
    const regex = /https:\/\/(?:\S+\.)?notion\.site\/(\S+)\??/
    const match = url.match(regex)
    return match ? match[1] : ""
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (status !== "authenticated") {
      setError("You must be logged in to create an event.")
      return
    }

    try {
      const notionId = extractNotionId(formData.notionLink)
      const response = await axios.post(
        "/api/events/create",
        {
          title: formData.title,
          date: formData.date,
          notionLink: notionId,
          location:
            formData.locationType === "Virtual" ? "Virtual" : formData.location,
          startTime: formData.startTime
            ? formData.startTime.format("HH:mm")
            : "",
          endTime: formData.endTime ? formData.endTime.format("HH:mm") : "",
          userId: session.user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      )

      if (response.status === 201) {
        router.push("/events")
      } else {
        setError(response.data.message || "An error occurred.")
      }
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response?.data?.message || error.message
      )
      setError(error.response?.data?.message || error.message)
    }
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md space-y-8 px-4 text-gray-600">
        <div className="mt-5 space-y-2">
          <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
            {t("createEvent.createEvent", "Create Event")}
          </h3>
        </div>
        <form onSubmit={handleSubmit} method="POST" className="space-y-5">
          <div>
            <label htmlFor="title" className="font-medium">
              {t("createEvent.title", "Event Title")}
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="date" className="font-medium">
              {t("createEvent.date", "Event Date")}
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="startTime" className="font-medium">
              {t("createEvent.startTime", "Start Time")}
            </label>
            <TimePicker
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={(value) => handleTimeChange("startTime", value)}
              use12Hours
              format="h:mm a"
              showSecond={false}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
              inputReadOnly
            />
          </div>
          <div>
            <label htmlFor="endTime" className="font-medium">
              {t("createEvent.endTime", "End Time")}
            </label>
            <TimePicker
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={(value) => handleTimeChange("endTime", value)}
              use12Hours
              format="h:mm a"
              showSecond={false}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
              inputReadOnly
            />
          </div>
          <div>
            <label htmlFor="notionLink" className="font-medium">
              {t("createEvent.notionLink", "Notion Link")}
            </label>
            <input
              id="notionLink"
              name="notionLink"
              type="text"
              value={formData.notionLink}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
            />
          </div>
          <div>
            <label className="font-medium">
              {t("createEvent.locationType", "Event Location Type")}
            </label>
            <div className="mt-2">
              <label className="mr-4">
                <input
                  type="radio"
                  name="locationType"
                  value="Virtual"
                  checked={formData.locationType === "Virtual"}
                  onChange={handleChange}
                  className="mr-2"
                />
                {t("createEvent.Virtual", "Virtual")}
              </label>
              <label>
                <input
                  type="radio"
                  name="locationType"
                  value="inPerson"
                  checked={formData.locationType === "inPerson"}
                  onChange={handleChange}
                  className="mr-2"
                />
                {t("createEvent.inPerson", "In Person")}
              </label>
            </div>
          </div>
          {formData.locationType === "inPerson" && (
            <div>
              <label htmlFor="location" className="font-medium">
                {t("createEvent.location", "Location")}
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
                required={formData.locationType === "inPerson"}
              />
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
            >
              {t("createEvent.createEventButton", "Create Event")}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreateEvent
