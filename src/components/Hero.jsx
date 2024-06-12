import { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { FaDiscord } from "react-icons/fa"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import Slider from "react-slick"

// Import slick carousel css
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Import your images
import BackgroundImage1 from "../assets/pictures/1.png"
import BackgroundImage2 from "../assets/pictures/2.png"
import BackgroundImage3 from "../assets/pictures/3.png"

// Add global CSS to disable horizontal scrolling
const globalStyles = `
  body, html {
    overflow-x: hidden;
  }
`

const Hero = () => {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const { t, i18n } = useTranslation()

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
        console.log(data.message)
        setShowModal(false)
        window.location.href = "https://discord.gg/MgUg5sF7v8"
      } else {
        throw new Error(data.error || "Something went wrong.")
      }
    } catch (error) {
      console.error("Failed to submit email:", error)
    }
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    swipe: true,
    touchMove: true,
    cssEase: "linear", // Smooth scrolling effect
  }

  const slides = [
    {
      image: BackgroundImage3,
      title: t("roboticArtPossible", "ロボットアート、可能？"),
      description: t("roboticArtDescription", "6月20日 3PM、早稲田 Bdg. 19-2"),
      link: "events/Workshop%3A%20Intersection%20of%20Robot%20and%20Art",
    },
    {
      image: BackgroundImage2,
      title: t("exploreMachineIntelligence", "機械知能を探る"),
      description: t(
        "exploreMachineIntelligenceDescription",
        "毎週土曜日5PMのワークショップ"
      ),
      link: "/events",
    },

    {
      image: BackgroundImage1,
      title: t("communityJoin", "コミュニティに参加しませんか？"),
      description: t(
        "discordChannel",
        "私たちのディスコードチャンネルに参加してください"
      ),
      link: "https://discord.gg/GGnfYADaBa",
    },
  ]

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          backgroundColor: "#f2f3ef",
          position: "relative",
          overflow: "hidden",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div className="flex flex-col items-center justify-center px-4 md:px-16">
          <div className="w-full mt-10 mb-32 flex-grow overflow-hidden">
            <Slider
              {...sliderSettings}
              className="w-full rounded-2xl overflow-hidden relative"
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="relative h-[80vh] flex items-center justify-center overflow-hidden"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="rounded-2xl"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-10 rounded-2xl text-center text-white p-6">
                    <h2 className="text-5xl font-bold">{slide.title}</h2>
                    <p className="text-lg mt-5">{slide.description}</p>
                    <Link
                      className={`inline-block mt-4 px-6 py-2 text-md font-semibold bg-indigo-500 text-white rounded-md hover:bg-blue-600 ${
                        index === 2 ? "flex items-center" : ""
                      }`}
                      href={slide.link}
                    >
                      {index === 2 ? (
                        <>
                          <FaDiscord className="mr-2" />
                          {t("join", "参加する")}
                        </>
                      ) : (
                        t("readMore", "もっと読む")
                      )}
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
