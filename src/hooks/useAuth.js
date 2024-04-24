// hooks/useAuth.js
import { useState, useEffect } from "react"
import jwt from "jsonwebtoken"

function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      const decoded = jwt.decode(token)
      // Check if the token is expired
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded)
      } else {
        localStorage.removeItem("token")
        setUser(null)
      }
    }
  }, [])

  return { user }
}

export default useAuth
