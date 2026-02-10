import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.password_confirm) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    if (form.password !== form.password_confirm) {
      toast.error('As senhas não conferem');
      return;
    }
    if (form.password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (err) {
      const errors = err.response?.data;
      if (errors && typeof errors === 'object') {
        const firstError = Object.values(errors).flat()[0];
        toast.error(typeof firstError === 'string' ? firstError : 'Erro ao criar conta');
      } else {
        toast.error('Erro ao criar conta');
      }
    } finally {
      setLoading(false);
    }
  };

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

          <h1 className="auth-title">Crie sua conta</h1>
          <p className="auth-subtitle">Comece a gerenciar seus projetos agora</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="first_name">Nome</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className="form-input"
                  placeholder="João"
                  value={form.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="last_name">Sobrenome</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className="form-input"
                  placeholder="Silva"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">
                <HiOutlineUser style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Usuário *
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
              <label className="form-label" htmlFor="email">
                <HiOutlineMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="joao@exemplo.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                <HiOutlineLockClosed style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Senha *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password_confirm">
                <HiOutlineLockClosed style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Confirmar Senha *
              </label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                className="form-input"
                placeholder="Digite a senha novamente"
                value={form.password_confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Criar conta'}
            </button>
          </form>

          <div className="auth-footer">
            Já tem uma conta?{' '}
            <Link to="/login">Entrar</Link>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h2>Trabalhe melhor em equipe</h2>
          <p>
            Colabore, organize e entregue projetos no prazo. Tudo de forma simples e intuitiva.
          </p>
        </div>
        <div className="auth-decoration auth-decoration-1" />
        <div className="auth-decoration auth-decoration-2" />
        <div className="auth-decoration auth-decoration-3" />
      </div>
    </div>
  );
}
