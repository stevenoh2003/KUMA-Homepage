import React from "react"
import { useTranslation } from "react-i18next" // Import the useTranslation hook
const slides = [
  {
    imageUrl: "https://kuma2024.s3.ap-southeast-2.amazonaws.com/mane.jpeg",
    caption: "真似っこロボット",
  },
  {
    imageUrl:
      "https://kuma2024.s3.ap-southeast-2.amazonaws.com/Screenshot+2024-05-10+at+14.43.14.png",
    caption: "Robot-sketched drawings",
  },
  {
    imageUrl: "https://kuma2024.s3.ap-southeast-2.amazonaws.com/cointbot.jpg",
    caption: "CoinBot",
  },
  {
    imageUrl: "https://kuma2024.s3.ap-southeast-2.amazonaws.com/tart.png",
    caption: "Intelligent Retail Rolley",
  },
]

const colors = ["#0088FE", "#00C49F", "#FFBB28"]
const delay = 2500

function Slideshow() {
  const { t } = useTranslation() // Initialize the translation hook

  const [index, setIndex] = React.useState(0)
  const timeoutRef = React.useRef(null)

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  React.useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    )

    return () => {
      resetTimeout()
    }
  }, [index])

  return (
    <div className="mb-32 mt-32">
      <h1 className="mt-2 ml-6 mb-4 sm:ml-20 sm:mb-20 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Past Projects from Our Members
      </h1>
      <div className="slideshow">
        <div
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {slides.map((slide, idx) => (
            <div
              className="slide"
              key={idx}
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundColor: colors[idx % colors.length],
              }}
            >
              <div className="caption">{slide.caption}</div>
            </div>
          ))}
        </div>

        <div className="slideshowDots">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`slideshowDot${index === idx ? " active" : ""}`}
              onClick={() => setIndex(idx)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Slideshow
