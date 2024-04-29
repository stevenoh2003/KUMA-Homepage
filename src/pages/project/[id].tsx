import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { useSession } from "next-auth/react"

const ProjectDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState(null)
  const { data: session, status } = useSession()

  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [selectedDiscordId, setSelectedDiscordId] = useState(null)
  const [members, setMembers] = useState([]) // State to store member list

  useEffect(() => {
    if (id) {
      fetchProject(id)
      fetchMembers(id) // Fetch members when project is fetched
    }
  }, [id])

  useEffect(() => {
    if (session && project) {
      setSelectedDiscordId(session.user.discordId)
      setSelectedChannelId(project.discordChannelId)
    }
  }, [session, project]) // Depend on project and session

  const fetchProject = async (projectId) => {
    try {
      const response = await axios.get(`/api/project/${projectId}`)
      setProject(response.data)
    } catch (error) {
      console.error("Error fetching project details:", error)
      alert("Failed to load the project details.")
    }
  }

  const fetchMembers = async (projectId) => {
    // Mock fetching members, replace with your actual API call
    setMembers(["Member 1", "Member 2", "Member 3"]) // Example member data
  }

  const handleDiscordIdSubmit = async () => {
    try {
      const response = await axios.post("/api/modify-channel", {
        channelId: selectedChannelId,
        userId: selectedDiscordId,
      })
      alert(response.data.message)
    } catch (error) {
      console.error("Error updating permissions:", error)
      alert("Failed to update permissions.")
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!project) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex">
      <aside className="w-1/4 p-4 bg-gray-100">
        <h3>Project Members</h3>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </aside>
      <main className="w-3/4 p-4">
        <h1>{project.projectName}</h1>
        <img
          src={project.projectPhotoUrl || "https://via.placeholder.com/500x300"}
          alt={project.projectName}
        />
        <p>{project.projectDescription}</p>
        <p>Technologies Used: {project.technologyUsed}</p>
        {session && (
          <div>
            <h2>Welcome, {session.user.name}!</h2>
            <p>Your email: {session.user.email}</p>
            <p>{project.discordChannelId}</p>
            <p>{session.user.discordId}</p>
          </div>
        )}
        <button
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg duration-150 hover:bg-indigo-700 active:shadow-lg"
          onClick={handleDiscordIdSubmit}
        >
          Join
        </button>
      </main>
    </div>
  )
}

export default ProjectDetails
