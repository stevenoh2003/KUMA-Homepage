import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { RotatingLines } from "react-loader-spinner"
import { useTranslation } from "react-i18next" // Import the useTranslation hook
import AOS from "aos"
import "aos/dist/aos.css" // Import AOS styles

export default function Example() {
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)
  const { t } = useTranslation() // Initialize the translation hook

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    const elements = ref.current.querySelectorAll(".fade-in-section")
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative isolate overflow-hidden px-6 py-24 max-[500px]:py-4 lg:overflow-visible lg:px-0"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div
          className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8"
          data-aos="fade-up"
        >
          <div className="lg:pr-4 fade-in-section flex items-center">
            <div className="lg:max-w-lg my-10">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                {t("ourVision.step1Title", "Our Vision")}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {t(
                  "ourVision.title",
                  "Building a Global Community of Innovators"
                )}
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                {t(
                  "ourVision.description",
                  <>
                    Our vision is to build and design a state-of-the-art
                    physical laboratory in Tokyo. We aim to create a{" "}
                    <span className="text-indigo-600 font-bold">
                      vibrant community
                    </span>{" "}
                    where members from diverse backgrounds can engage in{" "}
                    <span className="text-red-600 font-bold">
                      creative research
                    </span>{" "}
                    and have access to cutting-edge tools such as{" "}
                    <span className="text-green-600 font-bold">GPUs</span> and{" "}
                    <span className="text-blue-600 font-bold">robot arms</span>.
                    This environment will surpass cultural barriers, allowing
                    any motivated individual, including undergraduate students,
                    to pursue{" "}
                    <span className="text-purple-600 font-bold">
                      groundbreaking work
                    </span>{" "}
                    and innovate without limits. We believe in the power of{" "}
                    <span className="text-orange-600 font-bold">diversity</span>{" "}
                    and{" "}
                    <span className="text-pink-600 font-bold">inclusivity</span>{" "}
                    to drive innovation and create a brighter future.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
        <div
          className="relative hidden sm:block -ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden fade-in-section"
          data-aos="fade-left"
        >
          {isLoading && (
            <div
              className="absolute inset-0 flex justify-center items-center" // Full overlay on the parent div
              style={{ height: "100%", width: "100%" }}
            >
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="#4f46e5"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          <Image
            className="w-[32rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[40rem]"
            src="/openlab.webp"
            alt={t(
              "ourVision.robotImageAlt",
              "An animated robot demonstrating our cutting-edge technology"
            )}
            width={800} // Correct width based on image aspect ratio
            height={500} // Correct height based on image aspect ratio
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
