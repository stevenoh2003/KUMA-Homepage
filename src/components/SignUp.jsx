import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/router" // Import useRouter for redirection

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    discordID: "",
  })

  const router = useRouter() // Initialize useRouter for redirection

const handleChange = (event) => {
  const { name, value, type, files } = event.target
  if (type === "file") {
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }))
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
}

const handleSubmit = async (event) => {
  event.preventDefault()

  // Create an instance of FormData
  const data = new FormData()

  // Append each form field to the FormData object
  data.append("name", formData.name)
  data.append("email", formData.email)
  data.append("password", formData.password)
  data.append("profilePic", formData.profilePic) // Ensure this is the file
  data.append("discordId", formData.discordId) // Ensure this is the file

  try {
    // Post the FormData to your API endpoint
    console.log(formData) // Log formData to ensure it's correctly populated
    const response = await axios.post("/api/auth/signup", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    alert(response.data.message)
    // Redirect to login page upon successful registration
    router.push("/auth/signin")
  } catch (error) {
    console.log(error.response.data.message)
  }
}

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Create your account
            </h3>
            <p>
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          method="POST"
          enctype="multipart/form-data"
          className="mt-8 space-y-5"
        >
          <div>
            <label htmlFor="name" className="font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 border-gray-300 text-gray-500 bg-transparent outline-none border focus:border-gray-400 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="profilePic" className="font-medium">
              Profile Picture
            </label>
            <input
              id="profilePic"
              name="profilePic"
              type="file"
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-400 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-400 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-gray-400 focus:border-gray-400 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="discordId" className="font-medium">
              Discord ID
            </label>
            <input
              id="discordId"
              name="discordId"
              type="discordId"
              value={formData.discordId}
              onChange={handleChange}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-gray-400 focus:border-gray-400 shadow-sm rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  )
}

export default SignUp
