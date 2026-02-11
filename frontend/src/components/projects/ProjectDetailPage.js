import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineUserAdd,
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineCheck,
  HiOutlineCalendar
} from 'react-icons/hi'
import { projectAPI, taskAPI } from '../../services/api'
import Modal from '../common/Modal'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useUIFeedback } from '../../contexts/UIFeedbackContext'
import Celebration from '../common/Celebration'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('tasks')
  const [filter, setFilter] = useState('all')

  // Task modal
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    due_date: ''
  })
  const [savingTask, setSavingTask] = useState(false)

  // Member modal
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [memberUsername, setMemberUsername] = useState('')

  // Edit project modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [projectForm, setProjectForm] = useState({ name: '', description: '' })
  const { celebrate, showConfetti } = useUIFeedback()

  const loadProject = useCallback(async () => {
    try {
      const res = await projectAPI.get(id)
      setProject(res.data)
      setProjectForm({
        name: res.data.name,
        description: res.data.description || ''
      })
    } catch (err) {
      toast.error('Projeto não encontrado')
      navigate('/projects')
    }
  }, [id, navigate])

  const loadTasks = useCallback(async () => {
    try {
      const res = await taskAPI.list(id)
      setTasks(res.data.results || res.data)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    Promise.all([loadProject(), loadTasks()]).finally(() => setLoading(false))
  }, [loadProject, loadTasks])

  // Task CRUD
  const openCreateTask = () => {
    setEditTask(null)
    setTaskForm({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      due_date: ''
    })
    setShowTaskModal(true)
  }

  const openEditTask = task => {
    setEditTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || ''
    })
    setShowTaskModal(true)
  }

  const handleTaskSubmit = async e => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      toast.error('Título da tarefa é obrigatório')
      return
    }
    setSavingTask(true)
    const payload = { ...taskForm }
    if (!payload.due_date) delete payload.due_date
    try {
      if (editTask) {
        await taskAPI.update(id, editTask.id, payload)
        toast.success('Tarefa atualizada!')
      } else {
        await taskAPI.create(id, payload)
        toast.success('Tarefa criada!')
      }
      setShowTaskModal(false)
      loadTasks()
      loadProject()
    } catch (err) {
      toast.error('Erro ao salvar tarefa')
    } finally {
      setSavingTask(false)
    }
  }

  const handleToggleComplete = async task => {
    try {
      const res = await taskAPI.toggleComplete(id, task.id)
      const completedNow = res?.data?.completed ?? !task.completed
      loadTasks()
      loadProject()
      if (completedNow) celebrate()
    } catch (err) {
      toast.error('Erro ao atualizar tarefa')
    }
  }

  const handleDeleteTask = async task => {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return
    try {
      await taskAPI.delete(id, task.id)
      toast.success('Tarefa excluída')
      loadTasks()
      loadProject()
    } catch (err) {
      toast.error('Erro ao excluir tarefa')
    }
  }

  // Member
  const handleAddMember = async e => {
    e.preventDefault()
    if (!memberUsername.trim()) return
    try {
      await projectAPI.addMember(id, { username: memberUsername })
      toast.success('Membro adicionado!')
      setMemberUsername('')
      setShowMemberModal(false)
      loadProject()
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.username?.[0] ||
        'Erro ao adicionar membro'
      toast.error(msg)
    }
  }

  const handleRemoveMember = async userId => {
    if (!window.confirm('Remover este membro do projeto?')) return
    try {
      await projectAPI.removeMember(id, userId)
      toast.success('Membro removido')
      loadProject()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao remover membro')
    }
  }

  // Edit project
  const handleEditProject = async e => {
    e.preventDefault()
    if (!projectForm.name.trim()) return
    try {
      await projectAPI.update(id, projectForm)
      toast.success('Projeto atualizado!')
      setShowEditModal(false)
      loadProject()
    } catch (err) {
      toast.error('Erro ao atualizar projeto')
    }
  }

  const handleDeleteProject = async () => {
    if (
      !window.confirm(
        `Excluir o projeto "${project.name}"? Todas as tarefas serão perdidas.`
      )
    )
      return
    try {
      await projectAPI.delete(id)
      toast.success('Projeto excluído')
      navigate('/projects')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao excluir projeto')
    }
  }

  // Filtered tasks
  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true
    if (filter === 'completed') return t.completed
    if (filter === 'pending') return !t.completed
    return t.status === filter
  })

  if (loading) {
    return (
      <div className="loading-page" style={{ minHeight: '50vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    )
  }

  if (!project) return null

  const progress =
    project.tasks_count > 0
      ? Math.round((project.completed_tasks_count / project.tasks_count) * 100)
      : 0

  return (
    <div className="animate-fade-in">
      <Celebration show={showConfetti} />
      {/* Header */}
      <div className="project-detail-header">
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/projects')}
            style={{ marginBottom: 'var(--space-sm)' }}
          >
            <HiOutlineArrowLeft size={16} /> Voltar
          </button>
          <h1 className="project-detail-title">{project.name}</h1>
          {project.description && (
            <p className="project-detail-desc">{project.description}</p>
          )}
          {/* Progress */}
          <div style={{ marginTop: 'var(--space-md)', maxWidth: 300 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4
              }}
            >
              <span
                style={{
                  fontSize: 'var(--font-xs)',
                  color: 'var(--color-text-tertiary)'
                }}
              >
                Progresso
              </span>
              <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>
                {progress}%
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="project-detail-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowEditModal(true)}
          >
            <HiOutlinePencil size={16} /> Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDeleteProject}
          >
            <HiOutlineTrash size={16} /> Excluir
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="project-tabs">
        <button
          className={`project-tab ${tab === 'tasks' ? 'active' : ''}`}
          onClick={() => setTab('tasks')}
        >
          <HiOutlineClipboardList size={16} />
          Tarefas
          <span className="project-tab-count">{tasks.length}</span>
        </button>
        <button
          className={`project-tab ${tab === 'members' ? 'active' : ''}`}
          onClick={() => setTab('members')}
        >
          <HiOutlineUserGroup size={16} />
          Membros
          <span className="project-tab-count">
            {project.members?.length || 0}
          </span>
        </button>
      </div>

      {/* Tab content: Tasks */}
      {tab === 'tasks' && (
        <div>
          <div className="tasks-header">
            <div className="tasks-filters">
              <select
                className="filter-select"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="pending">Pendentes</option>
                <option value="completed">Concluídas</option>
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluídas (status)</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm" onClick={openCreateTask}>
              <HiOutlinePlus size={16} /> Nova Tarefa
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">Nenhuma tarefa encontrada</h3>
              <p className="empty-state-text">
                {tasks.length === 0
                  ? 'Crie sua primeira tarefa para este projeto.'
                  : 'Nenhuma tarefa com este filtro.'}
              </p>
              {tasks.length === 0 && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={openCreateTask}
                >
                  <HiOutlinePlus size={16} /> Criar Tarefa
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map((task, index) => (
                <div
                  className="task-item"
                  key={task.id}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <button
                    className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                    onClick={() => handleToggleComplete(task)}
                    aria-label={
                      task.completed
                        ? 'Marcar como incompleta'
                        : 'Marcar como concluída'
                    }
                  >
                    {task.completed && <HiOutlineCheck size={14} />}
                  </button>
                  <div className="task-content">
                    <div
                      className={`task-title ${task.completed ? 'completed' : ''}`}
                    >
                      {task.title}
                    </div>
                    <div className="task-meta">
                      <span className={`badge badge-${task.priority}`}>
                        {task.priority === 'low'
                          ? 'Baixa'
                          : task.priority === 'medium'
                            ? 'Média'
                            : 'Alta'}
                      </span>
                      <span
                        className={`badge badge-${task.status.replace('_', '-')}`}
                      >
                        {task.status === 'todo'
                          ? 'A Fazer'
                          : task.status === 'in_progress'
                            ? 'Em Progresso'
                            : 'Concluída'}
                      </span>
                      {task.due_date && (() => {
                        // Parse date string 'YYYY-MM-DD' as local date (avoid UTC shift)
                        const [y, m, d] = task.due_date.split('-')
                        const localDate = new Date(Number(y), Number(m) - 1, Number(d))
                        const todayLocal = new Date()
                        // zero time component for comparison
                        todayLocal.setHours(0,0,0,0)
                        const isOverdue = localDate < todayLocal && !task.completed
                        return (
                          <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
                            <HiOutlineCalendar size={12} />
                            {format(localDate, 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openEditTask(task)}
                      title="Editar"
                    >
                      <HiOutlinePencil size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => handleDeleteTask(task)}
                      title="Excluir"
                      style={{ color: 'var(--color-danger)' }}
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab content: Members */}
      {tab === 'members' && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 'var(--space-md)'
            }}
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowMemberModal(true)}
            >
              <HiOutlineUserAdd size={16} /> Adicionar Membro
            </button>
          </div>
          <div className="members-list">
            {project.members?.map(m => (
              <div className="member-item" key={m.id}>
                <div className="avatar">
                  {m.username?.slice(0, 2).toUpperCase()}
                </div>
                <div className="member-info">
                  <div className="member-name">{m.username}</div>
                  <div className="member-email">{m.email}</div>
                </div>
                <span className={`badge badge-${m.role}`}>{m.role}</span>
                {m.role !== 'admin' && (
                  <button
                    className="btn-icon"
                    onClick={() => handleRemoveMember(m.user_id)}
                    title="Remover"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title={editTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowTaskModal(false)}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleTaskSubmit}
              disabled={savingTask}
            >
              {savingTask ? (
                <span className="spinner" />
              ) : editTask ? (
                'Salvar'
              ) : (
                'Criar'
              )}
            </button>
          </>
        }
      >
        <form onSubmit={handleTaskSubmit}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Implementar login"
              value={taskForm.title}
              onChange={e =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-textarea"
              placeholder="Descreva a tarefa..."
              value={taskForm.description}
              onChange={e =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
          >
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={taskForm.status}
                onChange={e =>
                  setTaskForm({ ...taskForm, status: e.target.value })
                }
              >
                <option value="todo">A Fazer</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluída</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Prioridade</label>
              <select
                className="form-select"
                value={taskForm.priority}
                onChange={e =>
                  setTaskForm({ ...taskForm, priority: e.target.value })
                }
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Data de Entrega</label>
            <input
              type="date"
              className="form-input"
              value={taskForm.due_date}
              onChange={e =>
                setTaskForm({ ...taskForm, due_date: e.target.value })
              }
            />
          </div>
        </form>
      </Modal>

      {/* Member Modal */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        title="Adicionar Membro"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowMemberModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleAddMember}>
              Adicionar
            </button>
          </>
        }
      >
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label className="form-label">Nome de Usuário</label>
            <input
              type="text"
              className="form-input"
              placeholder="Digite o username do membro"
              value={memberUsername}
              onChange={e => setMemberUsername(e.target.value)}
              autoFocus
            />
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Projeto"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleEditProject}>
              Salvar
            </button>
          </>
        }
      >
        <form onSubmit={handleEditProject}>
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input
              type="text"
              className="form-input"
              value={projectForm.name}
              onChange={e =>
                setProjectForm({ ...projectForm, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-textarea"
              value={projectForm.description}
              onChange={e =>
                setProjectForm({ ...projectForm, description: e.target.value })
              }
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
