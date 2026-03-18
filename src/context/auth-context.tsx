"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "ADMIN" | "TECH"

export interface User {
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    try {
      const storedUser = localStorage.getItem("servigo-user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      localStorage.removeItem("servigo-user")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (user: User) => {
    localStorage.setItem("servigo-user", JSON.stringify(user))
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem("servigo-user")
    setUser(null)
    router.push("/login")
  }

  const value = { user, loading, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
