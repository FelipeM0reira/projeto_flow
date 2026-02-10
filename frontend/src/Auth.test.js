import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import LoginPage from './components/auth/LoginPage'
import RegisterPage from './components/auth/RegisterPage'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Mock api
jest.mock('./services/api', () => ({
  authAPI: {
    me: jest.fn().mockRejectedValue(new Error('Not authenticated')),
    login: jest.fn(),
    register: jest.fn(),
    updateTheme: jest.fn()
  }
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  },
  Toaster: () => null
}))

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
)

describe('LoginPage', () => {
  test('renders login form', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
    })
    expect(
      screen.getByPlaceholderText('Seu nome de usuário')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Sua senha')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  test('has link to register page', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('Criar conta')).toBeInTheDocument()
    })
  })

  test('renders username and password inputs', async () => {
    render(<LoginPage />, { wrapper: Wrapper })
    const usernameInput = await screen.findByPlaceholderText(
      'Seu nome de usuário'
    )
    const passwordInput = await screen.findByPlaceholderText('Sua senha')
    expect(usernameInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    expect(usernameInput.value).toBe('testuser')
    expect(passwordInput.value).toBe('password123')
  })
})

describe('RegisterPage', () => {
  test('renders register form', async () => {
    render(<RegisterPage />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('Crie sua conta')).toBeInTheDocument()
    })
    expect(
      screen.getByPlaceholderText('Seu nome de usuário')
    ).toBeInTheDocument()
    expect(screen.getByPlaceholderText('joao@exemplo.com')).toBeInTheDocument()
    expect(
      screen.getByText('Criar conta', { selector: 'button' })
    ).toBeInTheDocument()
  })

  test('has link to login page', async () => {
    render(<RegisterPage />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByText('Entrar')).toBeInTheDocument()
    })
  })

  test('renders all form fields', async () => {
    render(<RegisterPage />, { wrapper: Wrapper })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('João')).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText('Silva')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Mínimo 8 caracteres')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Digite a senha novamente')
    ).toBeInTheDocument()
  })
})
