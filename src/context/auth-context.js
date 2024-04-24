import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const isAuthenticated = !!session

  const contextValue = {
    session,
    isLoading,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
