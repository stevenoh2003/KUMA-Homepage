import { useState } from "react"
import { useRouter } from "next/router"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { title: "Home", path: "/", current: router.pathname === "/" },
    { title: "Blog", path: "/blog", current: router.pathname === "/blog" },
    {
      title: "Project",
      path: "/project",
      current: router.pathname === "/project",
    },
    {
      title: "Events",
      path: "/events",
      current: router.pathname === "/events",
    },
  ]

  const isHomePage = router.pathname === "/"
  const navBarStyle = isHomePage
    ? { backgroundColor: "#f2f3ef" }
    : { backgroundColor: "#1F2937", color: "#fff" }

  return (
    <nav className="bg-transparent w-full py-2 relative" style={navBarStyle}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-600"
            aria-label="Open menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-center absolute md:static top-full left-0 w-full z-20 bg-white shadow-md py-3 md:shadow-none md:bg-transparent`}
          style={
            isHomePage
              ? { backgroundColor: "#f2f3ef" }
              : { backgroundColor: "#1F2937" }
          }
        >
          <ul className="flex flex-col md:flex-row md:space-x-10 justify-center items-center w-full">
            {navigation.map((item, idx) => (
              <li
                key={idx}
                className={`text-center md:text-left ${
                  item.current ? "text-blue-500" : ""
                }`}
              >
                <a
                  href={item.path}
                  className={`block py-2 px-4 text-sm md:text-base ${
                    isHomePage ? "text-gray-900" : "text-white"
                  } hover:bg-indigo-600 hover:text-white hover:rounded-md transition-colors duration-200`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
