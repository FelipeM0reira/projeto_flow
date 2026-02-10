import React from 'react';
import '../styles/UserList.css';

const UserList = ({ users, selectedUser, onUserSelect, onUserDelete }) => {
  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p className="no-users">Nenhum usuário encontrado</p>
      ) : (
        <ul>
          {users.map(user => (
            <li 
              key={user.id}
              className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
            >
              <div 
                className="user-info"
                onClick={() => onUserSelect(user)}
              >
                <span className="username">{user.username}</span>
                <span className={`theme-badge ${user.theme_preference}`}>
                  {user.theme_preference === 'light' ? '☀️' : '🌙'}
                </span>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Deseja deletar o usuário ${user.username}?`)) {
                    onUserDelete(user.id);
                  }
                }}
                title="Deletar usuário"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
