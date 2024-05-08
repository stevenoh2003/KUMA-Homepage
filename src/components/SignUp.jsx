import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import Link from "next/link"
const SignUp = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    discordID: "",
    profilePic: null,
  })

  const router = useRouter() // Initialize useRouter for redirection
const [error, setError] = useState("")

const handleChange = (event) => {
  const { name, value, type, files } = event.target
  if (type === "file") {
    const file = files[0]
    if (file.size > 10000000) {
      // 10MB limit
      setError("Please upload a file smaller than 10MB")
      return // Stop further processing
    } else {
      setError("") // Clear any existing errors if the file size is valid
    }
    setFormData((prev) => ({
      ...prev,
      [name]: file,
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

      // alert(message)
      console.log(message)
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
              {t("signUp.welcomeMessage")}
            </h3>
            <p className="text-gray-300">{t("signUp.description")}</p>
          </div>
        </div>
        <img
          src="/network.gif" // Adjust the path to your GIF file
          alt="Background GIF"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 text-gray-600 sm:px-0">
          <div className="">
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                {t("signUp.signUp")}
              </h3>
              <p>
                {t("signUp.haveAccount")}{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {t("signUp.logIn")}
                </Link>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} method="POST" className="space-y-5">
            <div>
              <label htmlFor="name" className="font-medium">
                {t("signUp.name")}
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
                {t("signUp.profilePicture")}
              </label>
              <input
                id="profilePic"
                name="profilePic"
                type="file"
                onChange={handleChange}
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 rounded-lg"
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            <div>
              <label htmlFor="email" className="font-medium">
                {t("signUp.email")}
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
                {t("signUp.password")}
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
                {t("signUp.createAccount")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default SignUp
