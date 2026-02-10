import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { authAPI } from '../services/api'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { user, updateUser } = useAuth()

  const [theme, setTheme] = useState(() => {
    return user?.theme_preference || localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (user?.theme_preference && user.theme_preference !== theme) {
      setTheme(user.theme_preference)
    }
  }, [user?.theme_preference]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)

    if (user) {
      try {
        await authAPI.updateTheme({ theme_preference: newTheme })
        updateUser({ theme_preference: newTheme })
      } catch (err) {
        // Revert on error
        setTheme(theme)
      }
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
