import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlineLogout,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const getInitials = u => {
    if (u.first_name && u.last_name) {
      return (u.first_name[0] + u.last_name[0]).toUpperCase()
    }
    return u.username.slice(0, 2).toUpperCase()
  }

  return (
    <div className="app-layout">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">✦</div>
            <span className="sidebar-logo-text">ProjetoFlow</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Menu</span>

          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <HiOutlineViewGrid className="nav-link-icon" />
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <HiOutlineFolder className="nav-link-icon" />
            Projetos
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{getInitials(user)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user.first_name || user.username}
              </div>
              <div className="sidebar-user-email">{user.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        <header className="app-header">
          <div className="app-header-left">
            <button
              className="btn-icon mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Menu"
            >
              {sidebarOpen ? (
                <HiOutlineX size={22} />
              ) : (
                <HiOutlineMenu size={22} />
              )}
            </button>
          </div>

          <div className="app-header-right">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <HiOutlineMoon /> : <HiOutlineSun />}
            </button>

            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <HiOutlineLogout size={18} />
              <span className="hide-mobile">Sair</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
