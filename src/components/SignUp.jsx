import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/router"

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    discordID: "",
    profilePic: null,
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

    // Create a FormData instance
    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("password", formData.password)
    data.append("discordId", formData.discordID)

    // Profile picture field may not always exist
    if (formData.profilePic) {
      data.append("profilePic", formData.profilePic)
    }

    try {
      // Submit the data to your backend API
      const response = await axios.post("/api/auth/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const { presignedPost, message } = response.data

      // If a presigned URL is provided, upload the image directly to S3
      if (presignedPost) {
        const s3Data = new FormData()
        Object.keys(presignedPost.fields).forEach((key) => {
          s3Data.append(key, presignedPost.fields[key])
        })
        s3Data.append("file", formData.profilePic)

        await axios.post(presignedPost.url, s3Data)
      }

      alert(message)
      router.push("/auth/signin")
    } catch (error) {
      console.error(
        "Error in signup:",
        error.response?.data?.message || error.message
      )
    }
  }

  return (
    <main className="w-full flex">
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md">
          <div className="mt-16 space-y-3">
            <h3 className="text-white text-3xl font-bold">
              Start growing your business quickly
            </h3>
            <p className="text-gray-300">
              Create an account and get access to all features for 30 days. No
              credit card required.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
            filter: "blur(118px)",
          }}
        ></div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 text-gray-600 sm:px-0">
          <div className="">
            <img
              src="https://floatui.com/logo.svg"
              width={150}
              className="lg:hidden"
            />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Sign up
              </h3>
              <p>
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} method="POST" className="space-y-5">
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
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
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
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 rounded-lg"
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
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
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
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
              />
            </div>
            <div>
              {" "}
              <button
                type="submit"
                className="w-30 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default SignUp
