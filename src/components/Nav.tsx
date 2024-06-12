import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import LogoNew from "../assets/pictures/kuma-lab-4.png"; // Import the logo
import Link from "next/link"
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const { t, i18n } = useTranslation();

  const navigation = [
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
    {
      title: t("nav.event"),
      path: "/events",
      current: router.pathname === "/events",
    },
  ];

  const isHomePage = router.pathname === "/";
  const navBarStyle = { backgroundColor: "#f2f3ef", color: "#1F2937" };

  const linkStyle = (isHomePage, current) => {
    if (isHomePage) {
      return "text-gray-900";
    } else if (current) {
      return "text-gray-900";
    } else {
      return "text-gray-900";
    }
  };

  const switchLanguage = () => {
    const lang = i18n.language === "en" ? "ja" : "en";
    i18n.changeLanguage(lang);
  };

  const languageButtonStyle = "text-gray-900";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-transparent w-full pt-4 relative" style={navBarStyle}>
      <div className="max-w-screen-xl mx-auto px-4 py-2 md:px-32 flex items-center justify-between relative">
        {/* Logo on the Left Side */}
          <a href="/">
              <Image src={LogoNew} alt="Logo" width={120} height={150} />
          </a>

        {/* Center Spacer */}
        <div className="flex-grow"></div>

        {/* Navigation Items for Large Screens */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              className={`text-lg ${linkStyle(isHomePage, item.current)}`}
            >
              {item.title}
            </a>
          ))}
          {!session && (
            <>
              <a
                href="/auth/signin"
                className="text-lg"
              >
                {t("nav.login")}
              </a>
              <a
                href="/auth/signup"
                className="text-lg"
              >
                {t("nav.signup")}
              </a>
            </>
          )}
          {session && (
            <>
              <a
                href="/profile"
                className="text-lg"
              >
                {t("nav.profile")}
              </a>
              <a
                className="text-lg"
                onClick={() => signOut()}
              >
                {t("nav.logout")}
              </a>
            </>
          )}
          <button
            className={`text-lg rounded-full py-2 px-4 ${languageButtonStyle}`}
            onClick={switchLanguage}
          >
            {i18n.language === "en" ? "日本語" : "English"}
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="flex md:hidden flex-none z-50">
          <button
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Open menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>
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
                className={`block py-2 px-4 text-sm md:text-base text-white hover:bg-indigo-600 hover:text-white hover:rounded-md`}
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
                  className="block py-2 px-4 text-sm md:text-base text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={toggleMenu}
                >
                  {t("nav.login")}
                </a>
              </li>
              <li>
                <a
                  href="/auth/signup"
                  className="block py-2 px-4 text-sm md:text-base text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"
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
                  className="block py-2 px-4 text-sm md:text-base text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={toggleMenu}
                >
                  {t("nav.profile")}
                </a>
              </li>
              <li>
                <a
                  className="block py-2 px-4 text-sm md:text-base text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={() => signOut()}
                >
                  {t("nav.logout")}
                </a>
              </li>

            </>
          )}
          <li>
                <a
                  className="block py-2 px-4 text-sm md:text-base text-white hover:bg-indigo-600 hover:text-white hover:rounded-md"
                  onClick={switchLanguage}
                >
                  {i18n.language === "en" ? "日本語" : "English"}
                </a>
              </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
