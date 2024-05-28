import { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import LogoNew from "../assets/pictures/bear-black-big.png"
import { FaDiscord } from "react-icons/fa" // Import Discord icon
import { useTranslation } from "react-i18next"
import Link from "next/link"

const Hero = () => {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { t, i18n } = useTranslation() // Initialize useTranslation hook

  const handleEmail = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch("/api/submitEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })
      const data = await response.json()
      if (response.ok) {
        console.log(data.message) // Log success message
        setShowModal(false) // Close modal after successful submission
        window.location.href = "https://discord.gg/MgUg5sF7v8" // Redirect to Discord in the same tab
      } else {
        throw new Error(data.error || "Something went wrong.")
      }
    } catch (error) {
      console.error("Failed to submit email:", error)
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "#f2f3ef",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="flex flex-col items-center justify-center px-8 py-20"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div className="mb-6">
            <Image alt="Logo" src={LogoNew} width={250} height={250} priority />
          </div>
          <div
            className={`text-center ${
              i18n.language === "ja" ? "w-full" : "w-full sm:w-8/12"
            } mb-6`}
          >
            <h1 className="text font-bold text-gray-900 text-2xl sm:text-6xl sm:my-4">
              {i18n.language === "ja" && (
                <>
                  <span style={{ color: "#4f46e5" }}>Kuma </span>
                </>
              )}
              {t("hero.title")}{" "}
              {i18n.language === "en" && (
                <>
                  <span style={{ color: "#4f46e5" }}>Kuma</span>
                </>
              )}
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="w-full p-10 flex flex-col sm:flex-row justify-center items-center">
            <Link
              href="/auth/signin"
              className="w-full text-center sm:w-auto rounded-md bg-indigo-600 px-10 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-4 sm:mb-0 sm:mr-4"
            >
              {t("hero.button.getStarted")}
            </Link>
            <a
              href="https://discord.gg/SWKRdkQCby"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center rounded-md bg-blue-500 px-10 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <FaDiscord className="inline-block mr-2" /> Discord
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
