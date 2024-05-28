import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import "react-notion-x/src/styles.css"
import { NotionRenderer } from "react-notion-x"
import Footer from "src/components/Footer"
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
)
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  { ssr: false }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
)

const EventPage = () => {
  const router = useRouter()
  const { title } = router.query
  const [eventData, setEventData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (title) {
      fetch(`/api/events/${encodeURIComponent(title)}`)
        .then((response) => response.json())
        .then((data) => setEventData(data))
        .catch((error) => setError("Failed to fetch event data"))
    }
  }, [title])

  if (error) {
    return <div>{error}</div>
  }

  if (!eventData) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-85 flex justify-center items-center">
          <div className="relative flex items-center space-x-2">
            <h1 className="text-4xl text-white mx-4 font-semibold">
              {eventData.name}
            </h1>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center mt-4 mb-4 mx-auto max-w-screen-lg px-4 sm:px-0 md:px-14">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div></div>
          </div>
          {/* <div className="text-right flex flex-col space-y-1 sm:space-y-0 sm:space-x-2 sm:flex-row items-center">
            <p className="text-xs sm:text-sm md:text-base text-gray-500">
              {new Date(eventData.date).toLocaleDateString()}{" "}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-gray-500">
              {new Date(eventData.created_at).toLocaleTimeString()}{" "}
            </p>
          </div> */}
        </div>
      </div>
      <hr style={{ color: "black", backgroundColor: "black", height: 1 }} />
      <div className="max-w-screen-xl mx-auto px-4 py-4 md:px-8 text-gray-600">
        {eventData.notion_id ? (
          <NotionRenderer
            recordMap={eventData.recordMap}
            fullPage={false}
            darkMode={false}
            components={{
              Code,
              Collection,
              Equation,
              Pdf,
              Modal,
            }}
          />
        ) : (
          <p>No Notion content available</p>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default EventPage
