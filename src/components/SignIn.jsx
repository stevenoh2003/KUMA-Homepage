import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

const SignIn = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result.error) {
      alert("Failed to login: " + result.error)
    } else {
      router.push("/")
    }
  }
  return (
    <main className="w-full flex">
      {/* Left panel with the GIF background */}
      <div className="relative flex-1 hidden items-center justify-center h-screen lg:flex">
        <div className="relative z-10 w-full max-w-md">
          <div className="mt-16 space-y-3">
            <h3 className="text-black text-3xl font-bold">
              {t("signIn.welcomeBack")}
            </h3>
            <p className="text-indigo-600">{t("signIn.logInToContinue")}</p>
          </div>
        </div>
        {/* GIF as the background */}

      </div>

      {/* Right panel (login form) */}
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 text-gray-600 sm:px-0">
          <div>
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                {t("signIn.logIn")}
              </h3>
              <p>
                {t("signIn.noAccount")}
                <a
                  href="/auth/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {t("signIn.signUp")}
                </a>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="font-medium">
                {t("signIn.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-medium">
                {t("signIn.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-lg rounded-lg"
              />
            </div>
            <button className="w-30 px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              {t("signIn.signIn")}
            </button>
          </form>
          {session && (
            <p className="text-center">
              {t("signIn.loggedInAs")} {session.user.email}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

export default SignIn
