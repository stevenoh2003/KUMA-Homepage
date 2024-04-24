import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "../../../libs/mongoose"
import bcrypt from "bcryptjs"
import User from "src/libs/model/User.js"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        await dbConnect()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error("No user found with the email")
        }

        const isValid = bcrypt.compareSync(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Incorrect password")
        }

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // A custom sign-in page
    error: "/auth/error", // Error page
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Assign user id to the token if the user object is available
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      // Ensure token has 'id' before attempting to assign it to session
      if (token?.id) {
        session.user.id = token.id
      } else {
        session.error = "Session token is missing ID"
      }
      return session
    },
  },
})
