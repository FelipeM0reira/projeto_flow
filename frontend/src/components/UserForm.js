import React, { useState } from 'react';
import '../styles/UserForm.css';

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    theme_preference: 'light'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      await onSubmit(formData);
      setSuccess('Usuário criado com sucesso!');
      setFormData({
        username: '',
        email: '',
        password: '',
        theme_preference: 'light'
      });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar usuário');
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="form-group">
        <label htmlFor="username">Nome de Usuário:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Digite o nome de usuário"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite o email"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite a senha"
        />
      </div>

      <div className="form-group">
        <label htmlFor="theme_preference">Tema Preferido:</label>
        <select
          id="theme_preference"
          name="theme_preference"
          value={formData.theme_preference}
          onChange={handleChange}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
        </select>
      </div>

      <button type="submit" className="submit-btn">
        Criar Usuário
      </button>
    </form>
  );
};

export default UserForm;
