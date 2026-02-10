import React, { useState, useEffect } from 'react';
import './styles/App.css';
import ThemeSwitcher from './components/ThemeSwitcher';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import api from './services/api';

function App() {
  const [theme, setTheme] = useState('light');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      setUsers(response.data.results || response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    
    if (selectedUser) {
      try {
        await api.updateUserTheme(selectedUser.id, newTheme);
        fetchUsers();
      } catch (error) {
        console.error('Erro ao atualizar tema do usuário:', error);
      }
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setTheme(user.theme_preference);
  };

  const handleUserCreate = async (userData) => {
    try {
      await api.createUser(userData);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  const handleUserDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
        setTheme('light');
      }
      fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <h1>Theme Switcher Application</h1>
        <ThemeSwitcher 
          currentTheme={theme} 
          onThemeChange={handleThemeChange}
          disabled={!selectedUser}
        />
      </header>

      <main className="App-main">
        <div className="container">
          <div className="sidebar">
            <h2>Usuários</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <UserList 
                users={users}
                selectedUser={selectedUser}
                onUserSelect={handleUserSelect}
                onUserDelete={handleUserDelete}
              />
            )}
          </div>

          <div className="content">
            <h2>Criar Novo Usuário</h2>
            <UserForm onSubmit={handleUserCreate} />
            
            {selectedUser && (
              <div className="user-info">
                <h3>Usuário Selecionado</h3>
                <p><strong>Nome:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Tema:</strong> {selectedUser.theme_preference}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
