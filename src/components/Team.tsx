import React from "react"
import Image from "next/image"
import TaiPortrait from "src/assets/pictures/tai.jpeg"
import AlexPortrait from "../assets/pictures/alex.jpeg"
import StevenPortrait from "../assets/pictures/stevenoh.JPG" // Modified import path
import MaggiePortrait from "../assets/pictures/maggie.jpg"
import { useTranslation } from "react-i18next"

export default () => {
  const { t } = useTranslation()

  const team = [
    {
      avatar: StevenPortrait,
      name: "Steven Oh",
      title: "Product designer",
      linkedin: "https://www.linkedin.com/in/stevenoh2003/",
      // twitter: "javascript:void(0)",
    },
    {
      avatar: AlexPortrait,
      name: "Alex Matsumura",
      title: "Software engineer",
      linkedin: "https://www.linkedin.com/in/alex-matsumura-016bb326b/",
      // twitter: "javascript:void(0)",
    },
    {
      avatar: TaiPortrait,
      name: "Tai Inui",
      title: "Full stack engineer",
      linkedin: "https://www.linkedin.com/in/tai-inui-9a776a296/",
      // twitter: "javascript:void(0)",
    },
    {
      avatar: MaggiePortrait,
      name: "Magdeline Kuan",
      title: "Full stack engineer",
      // linkedin: "https://www.linkedin.com/in/tai-inui-9a776a296/",
      // twitter: "javascript:void(0)",
    },
  ]

  return (
    <section className="py-14 mb-24" style={{ backgroundColor: "#f2f3ef" }}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-xl space-y-3">
          <h3 className="text-indigo-600 font-semibold">{t("title")}</h3>
          <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
            {t("meetFounders")}
          </p>
          <p></p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-center">
                <div className="flex-none w-24 h-24">
                  <Image
                    src={item.avatar}
                    alt="Description"
                    className="w-full h-full rounded-full"
                    objectFit="contain"
                    priority
                  />
                </div>
                <div>
                  <h4 className="text-gray-700 font-semibold sm:text-lg">
                    {item.name}
                  </h4>
                  <div className="mt-3 flex gap-4 text-gray-400">
                    {/* <a href={item.linkedin}>
                      <svg
                        className="w-5 h-5 duration-150 hover:text-gray-500"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <g clip-path="url(#clip0_17_68)">
                          <path
                            fill="currentColor"
                            d="M44.447 0H3.544C1.584 0 0 1.547 0 3.46V44.53C0 46.444 1.584 48 3.544 48h40.903C46.407 48 48 46.444 48 44.54V3.46C48 1.546 46.406 0 44.447 0zM14.24 40.903H7.116V17.991h7.125v22.912zM10.678 14.87a4.127 4.127 0 01-4.134-4.125 4.127 4.127 0 014.134-4.125 4.125 4.125 0 010 8.25zm30.225 26.034h-7.115V29.766c0-2.653-.047-6.075-3.704-6.075-3.703 0-4.265 2.896-4.265 5.887v11.325h-7.107V17.991h6.826v3.13h.093c.947-1.8 3.272-3.702 6.731-3.702 7.21 0 8.541 4.744 8.541 10.912v12.572z"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_17_68">
                            <path fill="currentColor" d="M0 0h48v48H0z" />
                          </clipPath>
                        </defs>
                      </svg>
                    </a> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
