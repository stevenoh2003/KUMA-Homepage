import React from 'react'
import waseda from "../assets/pictures/waseda.png"
import Image from "next/image"
const LogoGrid = () => {
return (
  <div className="py-14" style={{ backgroundColor: "#f2f3ef" }}>
    <div className="max-w-screen-xl mx-auto px-4 md:px-8">
      <h3 className="font-semibold text-sm text-gray-600 text-center">
        Trusted by members from around the world{" "}
      </h3>
      <div className="mt-6">
        <ul className="flex gap-x-10 gap-y-6 flex-wrap items-center justify-center md:gap-x-16">
          {/* LOGO 1 */}
          <li>
            <Image alt="Logo" src={waseda} className="w-28" priority />
          </li>

          {/* LOGO 2 */}
        </ul>
      </div>
    </div>
  </div>
)
}

export default LogoGrid