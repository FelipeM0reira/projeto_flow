import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser
} from 'react-icons/hi'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.password) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      await login(form)
      toast.success('Bem-vindo de volta!')
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Erro ao fazer login'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-form-container animate-fade-in">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <HiOutlineUser />
            </div>
            <span className="auth-logo-text">ProjetoFlow</span>
          </div>

          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-subtitle">Entre na sua conta para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                <HiOutlineMail
                  style={{ marginRight: 6, verticalAlign: 'middle' }}
                />
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                placeholder="Seu nome de usuário"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <HiOutlineLockClosed
                  style={{ marginRight: 6, verticalAlign: 'middle' }}
                />
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Sua senha"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Entrar'}
            </button>
          </form>

          <div className="auth-footer">
            Não tem uma conta? <Link to="/register">Criar conta</Link>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h2>Organize seus projetos com eficiência</h2>
          <p>
            Gerencie tarefas, colabore com sua equipe e acompanhe o progresso
            dos seus projetos em um só lugar.
          </p>
        </div>
        <div className="auth-decoration auth-decoration-1" />
        <div className="auth-decoration auth-decoration-2" />
        <div className="auth-decoration auth-decoration-3" />
      </div>
    </div>
  )
}
