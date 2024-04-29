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

        const email = credentials.email.toLowerCase()
        const user = await User.findOne({ email })
        if (!user) {
          return null // Or handle more gracefully
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isValid) {
          return null // Or handle more gracefully
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.profilePicUrl,
          discordId: user.discordId, // Include discordId here
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.image = user.image
        token.discordId = user.discordId // Add discordId to the JWT
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image,
        discordId: token.discordId, // Add discordId to the session object
      }
      return session
    },
  },
})
