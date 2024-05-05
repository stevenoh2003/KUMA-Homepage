import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"

const SignIn = () => {
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
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md">
          <div className="mt-16 space-y-3">
            <h3 className="text-white text-3xl font-bold">Welcome Back!</h3>
            <p className="text-gray-300">
              Log in to your account and continue where you left off.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
            filter: "blur(118px)",
          }}
        ></div>
      </div>
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 text-gray-600 sm:px-0">
          <div>
            
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Log in
              </h3>
              <p>
                Don't have an account?{" "}
                <a
                  href="/auth/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="font-medium">
                Email
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
                Password
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
              Sign in
            </button>
            {/* <div className="text-center">
              <a href="javascript:void(0)" className="hover:text-indigo-600">
                Forgot password?
              </a>
            </div> */}
          </form>
          {session && (
            <p className="text-center">Logged in as {session.user.email}</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default SignIn
