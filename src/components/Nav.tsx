import { useState } from "react"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"
import { useTranslation } from "react-i18next"
import Image from "next/image"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { i18n } = useTranslation()

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

  const switchLanguage = () => {
    const lang = i18n.language === "en" ? "ja" : "en"
    i18n.changeLanguage(lang)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-transparent w-full py-2 relative" style={navBarStyle}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left Side (Profile and Login/Logout) */}
        <div className="flex items-center space-x-4 flex-none">
          {session ? (
            <>
              <a
                href="/profile"
                className={`flex items-center py-2 text-sm md:text-base`}
                style={{
                  transition: "color 0.2s ease",
                  color: isHomePage ? "#1F2937" : "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.firstChild.style.color = "#6B46C1" // Purple
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.firstChild.style.color = isHomePage
                    ? "#1F2937"
                    : "#fff"
                }}
              >
                <UserCircleIcon className="h-8 w-8 mr-2" />
              </a>
              <button
                onClick={() => signOut()}
                className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                  isHomePage,
                  false
                )}`}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <a
                href="/auth/signin"
                className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                  isHomePage,
                  false
                )}`}
              >
                Log In
              </a>
              <a
                href="/auth/signup"
                className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                  isHomePage,
                  false
                )}`}
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Center (Navigation Links) */}
        <ul className="hidden md:flex space-x-8 justify-center flex-grow">
          {navigation.map((item, idx) => (
            <li key={idx} className="text-center">
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
        </ul>

        {/* Right Side (Language Switcher) */}
        <div className="flex-none hidden md:block">
          <button
            className="text-white rounded-full py-2 px-4 flex items-center justify-center"
            onClick={switchLanguage}
          >
            <Image
              src="/icons8-globe-50.png"
              width="40"
              height="40"
              alt="Language Icon"
            />
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-500 hover:text-gray-700"
          aria-label="Open menu"
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Slide-in Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-gray-800 text-white z-50 shadow-lg transition-transform transform translate-x-0">
          <ul className="flex flex-col p-6 space-y-4">
            {navigation.map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.path}
                  className={`block py-2 px-4 text-sm md:text-base ${linkStyle(
                    false,
                    item.current
                  )}`}
                  onClick={toggleMenu} // Close the menu when an item is clicked
                >
                  {item.title}
                </a>
              </li>
            ))}
            {session ? (
              <>
                <li>
                  <a
                    href="/profile"
                    className="block py-2 px-4 text-sm md:text-base"
                    onClick={toggleMenu}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      signOut()
                      toggleMenu()
                    }}
                    className="block py-2 px-4 text-sm md:text-base"
                  >
                    Log Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a
                    href="/auth/signin"
                    className="block py-2 px-4 text-sm md:text-base"
                    onClick={toggleMenu}
                  >
                    Log In
                  </a>
                </li>
                <li>
                  <a
                    href="/auth/signup"
                    className="block py-2 px-4 text-sm md:text-base"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </a>
                </li>
              </>
            )}
            {/* Add the language switcher to the menu */}
            <li>
              <button
                className="block py-2 px-4 text-sm md:text-base"
                onClick={() => {
                  switchLanguage()
                  toggleMenu()
                }}
              >
                Switch Language
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
