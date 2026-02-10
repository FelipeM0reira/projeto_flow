import React from 'react';
import '../styles/ThemeSwitcher.css';

const ThemeSwitcher = ({ currentTheme, onThemeChange, disabled }) => {
  const handleToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
  };

  return (
    <div className="theme-switcher">
      <button 
        onClick={handleToggle}
        disabled={disabled}
        className={`theme-toggle ${currentTheme}`}
        title={disabled ? "Selecione um usuário primeiro" : "Alternar tema"}
      >
        <span className="theme-icon">
          {currentTheme === 'light' ? '🌞' : '🌙'}
        </span>
        <span className="theme-label">
          {currentTheme === 'light' ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
