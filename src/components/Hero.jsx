import { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Logo from "../assets/pictures/logo.jpg"

const Hero = () => {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()

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
          height: "calc(100vh - 110px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="flex flex-col lg:flex-row items-center justify-center h-full relative z-10 px-10"
          style={{ maxWidth: "900px", margin: "0 auto" }}
        >
          <div className="flex justify-center lg:justify-end w-full lg:w-2/5 mb-6 lg:mb-0">
            <Image alt="Logo" src={Logo} width="320" height="320" priority />
          </div>
          <div className="flex items-center justify-center w-full lg:w-3/5">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Explore the Next Frontier with{" "}
                <span
                  style={{
                    color: "#4f46e5",
                  }}
                >
                  kuma.
                </span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-gray-600 hidden lg:block">
                A Waseda University-based community.
              </p>
              <div className="mt-6">
                <a
                  href="/auth/signin"
                  className="rounded-md bg-indigo-600 px-10 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/path/to/dynamic-background.jpg")',
            backgroundSize: "cover",
            zIndex: 1,
            opacity: 0.5,
          }}
        />
      </div>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              width: "500px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              position: "relative", // Needed to position the close button
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              &times; {/* HTML entity for the 'X' character */}
            </button>
            <form onSubmit={handleEmail}>
              <div className="text-lg font-semibold text-gray-900 mb-4">
                Join our Discord channel
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your school email"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  backgroundColor: "#4f46e5",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "block",
                  width: "auto",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Hero
