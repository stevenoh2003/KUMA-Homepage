import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

import axios from "axios"
import * as Dialog from "@radix-ui/react-dialog"

const ProjectList = () => {
  const [projects, setProjects] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [discordId, setDiscordId] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedChannelId, setSelectedChannelId] = useState("")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `/api/get_project?page=${page}&limit=12`
        )
        setProjects(response.data.data)
        setTotalPages(response.data.totalPages)
      } catch (error) {
        console.error("Error fetching projects:", error)
        alert("Failed to load projects.")
      }
    }
    fetchProjects()
  }, [page])

  const handlePrevPage = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev))
  }

  const handleNextPage = () => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev))
  }

  const handleClose = () => {
    setIsOpen(false)
    setDiscordId("")
  }
  const router = useRouter()

  const handleRedirect = () => {
    router.push("/project/submit")
  }



  return (
    <section className="py-32">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="space-y-5 sm:text-center sm:max-w-md sm:mx-auto">
          <h1 className="text-gray-800 text-3xl font-extrabold sm:text-4xl">
            Latest Projects
          </h1>
          <p className="text-gray-600"></p>
        </div>
        <div className="flex justify-center">
          {" "}
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-700 active:shadow-lg"
            onClick={handleRedirect}
          >
            Create your collaboration
          </button>
        </div>
        <ul className="grid gap-x-8 gap-y-10 mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, key) => (
            <li
              className="w-full mx-auto group sm:max-w-sm"
              key={key}
              onClick={() => router.push(`/project/${project._id}`)}
            >
              <div
                style={{
                  height: "200px",
                  overflow: "hidden",
                  borderRadius: "8px",
                }}
              >
                <img
                  src={
                    project.projectPhotoUrl ||
                    "https://via.placeholder.com/870x500"
                  }
                  loading="lazy"
                  alt={project.projectName || "Project Image"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div className="mt-3 space-y-2">
                <h3 className="text-lg text-gray-800 font-semibold">
                  {project.projectName || "No Title"}
                </h3>
                <p>
                  {project.projectDescription || "No description available"}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-md disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-md disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProjectList
