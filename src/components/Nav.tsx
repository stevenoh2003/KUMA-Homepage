import { useState } from "react"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"
import { UserCircleIcon } from "@heroicons/react/24/solid"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const navigation = [
    { title: "Home", path: "/", current: router.pathname === "/" },
    { title: "Blog", path: "/blog", current: router.pathname === "/blog" },
    {
      title: "Project",
      path: "/project",
      current: router.pathname === "/project",
    },
  ]

  const isHomePage = router.pathname === "/"
  const navBarStyle = isHomePage
    ? { backgroundColor: "#f2f3ef", color: "#1F2937" }
    : { backgroundColor: "#1F2937", color: "#fff" }

  const linkStyle = (isHomePage, current) => {
    if (isHomePage) {
      return "text-gray-900 hover:bg-indigo-600 hover:text-white hover:rounded-md"
    } else if (current) {
      return "text-white bg-indigo-600 rounded-md"
    } else {
      return "text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"
    }
  }

  // Inline styles to match the dropdown menu background to the navbar
  const dropdownBackgroundStyle = isHomePage
    ? { backgroundColor: "#f2f3ef", color: "#1F2937" }
    : { backgroundColor: "#1F2937", color: "#fff" }

  return (
    <nav className="bg-transparent w-full py-2 relative" style={navBarStyle}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Open menu"
          >
            <svg
              className="h-8 w-8"
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

        {/* Dropdown Navigation */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-center absolute md:static top-full left-0 w-full z-20 shadow-md py-3 md:shadow-none md:bg-transparent`}
          style={dropdownBackgroundStyle}
        >
          <ul className="flex flex-col md:flex-row md:space-x-10 justify-center items-center w-full">
            {navigation.map((item, idx) => (
              <li key={idx} className={`text-center md:text-left`}>
                <a
                  href={item.path}
                  className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                    isHomePage,
                    item.current
                  )} transition-colors duration-200`}
                >
                  {item.title}
                </a>
              </li>
            ))}
            {!session ? (
              <>
                <li>
                  <a
                    href="/auth/signin"
                    className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                      isHomePage,
                      false
                    )}`}
                  >
                    Log In
                  </a>
                </li>
                <li>
                  <a
                    href="/auth/signup"
                    className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                      isHomePage,
                      false
                    )}`}
                  >
                    Sign Up
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/profile"
                    className={`py-2 text-sm md:text-base ${linkStyle(
                      isHomePage,
                      false
                    )}`}
                  >
                    <UserCircleIcon className="h-8 w-8 mr-2" />
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => signOut()}
                    className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                      isHomePage,
                      false
                    )}`}
                  >
                    Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
