import Logo from "../assets/pictures/kuma-lab-4.png"

import Image from "next/image"

export default () => {
  const footerNavs = [
    {
      href: "/",
      name: "Home",
    },
    {
      href: "/blog",
      name: "Blog",
    },
    {
      href: "/project",
      name: "Project",
    },
    {
      href: "/events",
      name: "Events",
    },

  ]

  return (
    <footer
      className="text-gray-500 px-4 py-5 max-w-screen-xl mx-auto md:px-8"
      style={{ backgroundColor: "#f2f3ef" }}
    >
      <div className="max-w-lg sm:mx-auto sm:text-center">
        <Image alt="Logo" src={Logo} className="w-32 sm:mx-auto" />
        <p className="leading-relaxed mt-2 text-[15px]">
          Network, Collaborate, Share.
        </p>
      </div>
      <ul className="items-center justify-center mt-8 space-y-5 sm:flex sm:space-x-4 sm:space-y-0">
        {footerNavs.map((item, idx) => (
          <li className=" hover:text-gray-800">
            <a key={idx} href={item.href}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 items-center justify-between sm:flex">
        <div className="mt-4 sm:mt-0">
          &copy; 2024 kuma All rights reserved.
        </div>
        <div className="mt-6 sm:mt-0">
          <ul className="flex items-center space-x-4">
            <li className="w-10 h-10 border rounded-full flex items-center justify-center">
              <a href="https://www.instagram.com/kuma.tech2024/">
                <img src="/logos/icons8-instagram.svg" alt="Instagram Logo" />
              </a>
            </li>

            <li className="w-10 h-10 border rounded-full flex items-center justify-center">
              <a href="javascript:void()">
                <img src="/logos/icons8-x-50.png" alt="Instagram Logo" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <style jsx>{`
        .svg-icon path,
        .svg-icon polygon,
        .svg-icon rect {
          fill: currentColor;
        }
      `}</style>
    </footer>
  )
}
