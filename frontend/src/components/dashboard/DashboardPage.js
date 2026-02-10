import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineFolder,
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineTrendingUp,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardAPI.get();
      setData(response.data);
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page" style={{ minHeight: '50vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  const stats = [
    {
      icon: <HiOutlineFolder />,
      color: 'purple',
      value: data?.total_projects || 0,
      label: 'Projetos',
    },
    {
      icon: <HiOutlineClipboardCheck />,
      color: 'green',
      value: data?.completed_tasks || 0,
      label: 'Tarefas Concluídas',
    },
    {
      icon: <HiOutlineClock />,
      color: 'blue',
      value: data?.pending_tasks || 0,
      label: 'Tarefas Pendentes',
    },
    {
      icon: <HiOutlineExclamation />,
      color: 'red',
      value: data?.overdue_tasks || 0,
      label: 'Tarefas Atrasadas',
    },
  ];

  const totalTasks = data?.total_tasks || 0;
  const statusData = data?.tasks_by_status || {};

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Olá, {user?.first_name || user?.username}! 👋
          </h1>
          <p className="page-subtitle">
            Aqui está o resumo dos seus projetos e tarefas
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="dashboard-stats">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard grid */}
      <div className="dashboard-grid">
        {/* Tasks by status */}
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <HiOutlineTrendingUp /> Tarefas por Status
          </div>
          <div className="status-breakdown">
            {[
              { key: 'todo', label: 'A Fazer', cls: 'todo' },
              { key: 'in_progress', label: 'Em Progresso', cls: 'in-progress' },
              { key: 'done', label: 'Concluída', cls: 'done' },
            ].map(({ key, label, cls }) => {
              const count = statusData[key] || 0;
              const pct = totalTasks > 0 ? (count / totalTasks) * 100 : 0;
              return (
                <div className="status-row" key={key}>
                  <span className="status-row-label">{label}</span>
                  <div className="status-row-bar">
                    <div
                      className={`status-row-fill ${cls}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="status-row-count">{count}</span>
                </div>
              );
            })}
          </div>

          {totalTasks > 0 && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${
                      ((data?.completed_tasks || 0) / totalTasks) * 100
                    }%`,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--color-text-tertiary)',
                  marginTop: 4,
                }}
              >
                {Math.round(((data?.completed_tasks || 0) / totalTasks) * 100)}%
                completo
              </p>
            </div>
          )}
        </div>

        {/* Recent projects */}
        <div className="dashboard-card">
          <div className="dashboard-card-title">
            <HiOutlineCalendar /> Projetos Recentes
          </div>
          {data?.recent_projects?.length > 0 ? (
            data.recent_projects.map((project) => (
              <div
                className="recent-project"
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <span className="recent-project-name">{project.name}</span>
                <span className="recent-project-date">
                  {format(new Date(project.created_at), "dd MMM ''yy", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-xl) 0' }}>
              <p className="empty-state-text">Nenhum projeto ainda</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/projects')}
              >
                Criar primeiro projeto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
