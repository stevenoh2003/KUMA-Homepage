import { useState } from "react"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"
import { useTranslation } from "react-i18next"
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { t, i18n } = useTranslation()

  const navigation = [
    { title: t("nav.home"), path: "/", current: router.pathname === "/" },
    {
      title: t("nav.blog"),
      path: "/blog",
      current: router.pathname === "/blog",
    },
    {
      title: t("nav.project"),
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

  const languageButtonStyle = isHomePage
    ? "text-black"
    : "text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-transparent w-full py-2 relative" style={navBarStyle}>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 flex items-center justify-between relative">
        {/* Semi-transparent overlay */}
        {isMenuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
            onClick={toggleMenu}
          />
        )}

        {/* Switch Language Icon (Left for Small Screens) */}
        <div className="md:hidden flex-none z-50">
          <button
            className={`text-lg rounded-full py-2 px-4 flex items-center justify-center ${languageButtonStyle}`}
            onClick={switchLanguage}
          >
            {i18n.language === "en" ? "日本語" : "English"}
          </button>
        </div>

        {/* Right Side (Language Switcher - for Desktop) */}
        <div className="flex-none hidden md:block z-50">
          <button
            className={`text-lg rounded-full py-2 px-4 flex items-center justify-center ${languageButtonStyle}`}
            onClick={switchLanguage}
          >
            {i18n.language === "en" ? "日本語" : "English"}
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-700 z-50"
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
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-gray-800 text-white z-50 shadow-lg transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition duration-300 ease-in-out`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu} aria-label="Close menu">
            <XMarkIcon className="h-8 w-8 text-gray-400 hover:text-white" />
          </button>
        </div>
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
          {!session && (
            <>
              <li>
                <a
                  href="/auth/signin"
                  className="block py-2 px-4 text-sm md:text-base hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={toggleMenu}
                >
                  {t("nav.login")}
                </a>
              </li>
              <li>
                <a
                  href="/auth/signup"
                  className="block py-2 px-4 text-sm md:text-base hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={toggleMenu}
                >
                  {t("nav.signup")}
                </a>
              </li>
            </>
          )}
          {session && (
            <>
              <li>
                <a
                  href="/profile"
                  className="block py-2 px-4 text-sm md:text-base hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={toggleMenu}
                >
                  {t("nav.profile")}
                </a>
              </li>
              <li>
                <a
                  className="block py-2 px-4 text-sm md:text-base hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={() => signOut()}
                >
                  {t("nav.logout")}
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}
