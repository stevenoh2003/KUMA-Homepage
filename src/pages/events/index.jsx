import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"
import axios from "axios"
import Footer from "src/components/Footer"
import { useSession } from "next-auth/react"
import LoadingPage from "src/components/LoadingPage"

const adminEmails = [
  "stevenoh2003@gmail.com",
  "magdeline.kuan@gmail.com",
  "taiinui556@gmail.com",
  "alexander.matsumurac@gmail.com",
]

const EventList = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events")
        setEvents(response.data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setError("Failed to fetch events")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/events/delete", {
        data: { id },
        headers: {
          "Content-Type": "application/json",
        },
      })
      setEvents(events.filter((event) => event._id !== id))
    } catch (error) {
      console.error("Failed to delete event:", error)
      setError("Failed to delete event")
    }
  }

  if (loading) {
    return <LoadingPage/>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <section className="py-28">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between max-w-md">
          <div>
            <h1 className="text-gray-800 text-2xl font-extrabold sm:text-3xl">
              {t("eventList.title", "Upcoming Events")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t(
                "eventList.subtitle",
                "Join us at our upcoming events and be part of our community."
              )}
            </p>
          </div>
          {status === "authenticated" &&
            adminEmails.includes(session.user.email) && (
              <button
                onClick={() => router.push("/events/create")}
                className="px-3 py-3 text-indigo-600 bg-indigo-50 rounded-lg duration-150 hover:bg-indigo-100 active:bg-indigo-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("eventList.addNewEvent", "Add New Event")}
              </button>
            )}
        </div>
        <ul className="mt-12 divide-y space-y-3">
          {events.map((event, idx) => (
            <li
              key={event._id}
              className="px-4 py-5 duration-150 hover:border-white hover:rounded-xl hover:bg-gray-50 cursor-pointer"
              onClick={() =>
                router.push(`/events/${encodeURIComponent(event.name)}`)
              }
            >
              <div className="space-y-3">
                <div className="flex items-center gap-x-3">
                  <div>

                    <h3 className="text-base text-gray-800 font-semibold mt-1">
                      {event.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 sm:text-sm">
                  Date: {new Date(event.date).toLocaleDateString()}
                  <span className="ml-2">
                    {event.startTime} - {event.endTime}
                  </span>
                </p>
                <div className="text-sm text-gray-600 flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z"
                        fill="#9CA3AF"
                      />
                    </svg>
                    {event.location || "No location specified"}
                  </span>
                  {status === "authenticated" &&
                    adminEmails.includes(session.user.email) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(event._id)
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </section>
  )
}

export default EventList
