import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    const tokens = localStorage.getItem('tokens')
    if (!tokens) {
      setLoading(false)
      return
    }
    try {
      const response = await authAPI.me()
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch {
      localStorage.removeItem('tokens')
      localStorage.removeItem('user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async credentials => {
    const response = await authAPI.login(credentials)
    const { user: userData, tokens } = response.data
    localStorage.setItem('tokens', JSON.stringify(tokens))
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async data => {
    const response = await authAPI.register(data)
    const { user: userData, tokens } = response.data
    localStorage.setItem('tokens', JSON.stringify(tokens))
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('tokens')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = data => {
    setUser(prev => {
      const updated = { ...prev, ...data }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
