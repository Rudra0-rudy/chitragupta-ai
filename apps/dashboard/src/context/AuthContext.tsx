import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface User {
  email: string
  name: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const MOCK_TOKEN = 'mock-jwt-token-chitragupta-ai-2024'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    if (token === MOCK_TOKEN && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, _password: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockUser: User = {
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    }

    localStorage.setItem('auth_token', MOCK_TOKEN)
    localStorage.setItem('auth_user', JSON.stringify(mockUser))
    setUser(mockUser)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setIsAuthenticated(false)
    setUser(null)
  }

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
