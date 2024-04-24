// pages/protected.js
import { verifyToken } from "../libs/auth"

export const getServerSideProps = async (context) => {
  const token = context.req.cookies.token || null
  const user = verifyToken(token)

  if (!user) {
    // Redirect if not authenticated
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: { user }, // Pass user data to the page
  }
}

const ProtectedPage = ({ user }) => {
  return <div>Welcome to a protected page, {user.email}</div>
}

export default ProtectedPage
