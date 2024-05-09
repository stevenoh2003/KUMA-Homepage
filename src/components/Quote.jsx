import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Audio } from "react-loader-spinner"
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
      className="relative isolate overflow-hidden px-6 py-16 sm:py-64 lg:overflow-visible lg:px-0"
    >
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="relative h-3/5 lg:top-4 mr-20 lg:col-start-1 lg:row-span-2 lg:row-start-1 max-[800px]:hidden fade-in-section">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center">
              <Audio
                height="80"
                width="80"
                radius="9"
                color="purple"
                ariaLabel="three-dots-loading"
              />
            </div>
          )}
          <Image
            className="w-[48rem] max-w-none bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            src="https://kuma2024.s3.ap-southeast-2.amazonaws.com/ezgif.com-gif-to-webp-converter.webp"
            alt={t("imageAlt")} // Translating alt text
            width={1000} // Ensure you set these to the actual image dimensions
            height={600}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>
        <div className="sm:mx-auto sm:flex max-[600px]:items-center max-[600px]:justify-center max-[900px]:px-12 lg:mt-32 lg:col-span-1 bg-gray-50 lg:col-start-2 shadow-xl pt-8 pb-16 rounded-lg lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:pl-8 fade-in-section">
          <div className="lg:pr-4 mt-12 sm:flex sm:flex-col sm:justify-center">
            <div className="lg:max-w-lg mb-10">
              <h1 className="mt-2 text-3xl font-bold text-indigo-600 sm:text-4xl">
                {t("quote.title")}
              </h1>
            </div>
            <blockquote className="relative">
              <svg
                className="absolute -top-6 -start-11 size-16 text-gray-200 dark:text-neutral-700"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                  fill="currentColor"
                ></path>
              </svg>
              <div className="relative z-10">
                <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
                  <em>{t("quote.quote")}</em>
                </p>
                <footer className="mt-6 text-base font-semibold text-gray-800 dark:text-neutral-400">
                  {t("quote.author")}
                </footer>
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}
