import { useState, useCallback, useEffect } from 'react'
import api from '@/services/api'

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  theme_preference: 'light' | 'dark' | 'auto'
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.get('/auth/me/')
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/login/', { username, password })
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await api.post('/auth/logout/')
      localStorage.removeItem('token')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      setIsLoading(true)
      try {
        const response = await api.post('/auth/register/', {
          email,
          username,
          password
        })
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
      } catch (error) {
        throw new Error('Registration failed')
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register
  }
}
