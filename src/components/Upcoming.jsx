import React from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"
import Link from "next/link"
import LoadingPage from "./LoadingPage"

// Fetch events function
const fetchEvents = async () => {
  const { data } = await axios.get("/api/events/upcoming")
  console.log("Fetched events data:", data) // Debug log
  return data
}

const UpcomingEvents = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    data: events,
    error,
    isLoading,
  } = useQuery(["upcomingEvents"], fetchEvents)

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    console.error("Error fetching events:", error) // Debug log
    return <></>
  }

  return (
    <section className="py-20">
      <div className="mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-gray-800 text-2xl font-extrabold sm:text-3xl">
              {t("upcomingEvents.title", "Upcoming Events")}
            </h1>
            <p className="text-gray-600 mt-2">
              {t("upcomingEvents.subtitle", "Join us at our upcoming events.")}
            </p>
          </div>
          <Link href="/events" legacyBehavior>
            <a className="text-indigo-600 hover:text-indigo-500 font-medium">
              {t("upcomingEvents.viewAll", "View All Events")}
            </a>
          </Link>
        </div>

        <div className="overflow-y-hidden p-4 mt-12 flex space-x-6 overflow-x-auto md:overflow-x-hidden">
          {events.map((event) => (
            <div
              key={event.name}
              className="bg-white rounded-lg shadow-lg p-6 flex-none w-80 transform transition duration-300 hover:scale-105 cursor-pointer"
              onClick={() =>
                router.push(`/events/${encodeURIComponent(event.name)}`)
              }
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {event.name}
              </h3>
              <p className="text-gray-600 mt-2">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2">{event.location}</p>
              <p className="text-gray-600 mt-2">
                {`${event.startTime} - ${event.endTime}`}
              </p>
              <p className="text-indigo-600 mt-4 hover:underline">
                {t("upcomingEvents.viewDetails", "View Details")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEvents
