import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { RotatingLines } from "react-loader-spinner"
import { useTranslation } from "react-i18next" // Import the useTranslation hook

export default function Example() {
  const [isLoading, setIsLoading] = useState(true)
  const ref = useRef(null)
  const { t } = useTranslation() // Initialize the translation hook

  useEffect(() => {
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
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4 fade-in-section">
            <div className="lg:max-w-lg my-10">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                Step #1
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("step1.title")}
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                {t("step1.description")}
              </p>
            </div>
            <div className="lg:max-w-lg my-10">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                Step #2
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("step2.title")}
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                {t("step2.description")}
              </p>
            </div>
            <div className="lg:max-w-lg my-10">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                Step #3
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {t("step3.title")}
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                {t("step3.description")}
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden sm:block -ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden fade-in-section">
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
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            src="/robotgif.webp"
            alt={t("robotImageAlt")} // Example of another translated text
            width={1000} // Correct width based on image aspect ratio
            height={600} // Correct height based on image aspect ratio
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
