import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlinePlus,
  HiOutlineFolder,
  HiOutlineUserGroup,
  HiOutlineClipboardList,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi';
import { projectAPI } from '../../services/api';
import Modal from '../common/Modal';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.list();
      setProjects(response.data.results || response.data);
    } catch (err) {
      toast.error('Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditProject(null);
    setForm({ name: '', description: '' });
    setShowModal(true);
  };

  const openEdit = (e, project) => {
    e.stopPropagation();
    setEditProject(project);
    setForm({ name: project.name, description: project.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }
    setSaving(true);
    try {
      if (editProject) {
        await projectAPI.update(editProject.id, form);
        toast.success('Projeto atualizado!');
      } else {
        await projectAPI.create(form);
        toast.success('Projeto criado!');
      }
      setShowModal(false);
      loadProjects();
    } catch (err) {
      toast.error('Erro ao salvar projeto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e, project) => {
    e.stopPropagation();
    if (!window.confirm(`Excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await projectAPI.delete(project.id);
      toast.success('Projeto excluído');
      loadProjects();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erro ao excluir projeto');
    }
  };

  if (loading) {
    return (
      <div className="loading-page" style={{ minHeight: '50vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Projetos</h1>
          <p className="page-subtitle">Gerencie todos os seus projetos</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus size={18} />
          Novo Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <HiOutlineFolder />
          </div>
          <h3 className="empty-state-title">Nenhum projeto ainda</h3>
          <p className="empty-state-text">
            Crie seu primeiro projeto para começar a organizar suas tarefas.
          </p>
          <button className="btn btn-primary" onClick={openCreate}>
            <HiOutlinePlus size={18} />
            Criar Projeto
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project, index) => {
            const progress =
              project.tasks_count > 0
                ? Math.round(
                    (project.completed_tasks_count / project.tasks_count) * 100
                  )
                : 0;

            return (
              <div
                className="project-card"
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="project-card-header">
                  <h3 className="project-card-name">{project.name}</h3>
                  <div className="project-card-actions">
                    <button
                      className="btn-icon"
                      onClick={(e) => openEdit(e, project)}
                      title="Editar"
                    >
                      <HiOutlinePencil size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={(e) => handleDelete(e, project)}
                      title="Excluir"
                      style={{ color: 'var(--color-danger)' }}
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </div>

                <p className="project-card-desc">
                  {project.description || 'Sem descrição'}
                </p>

                <div className="project-card-stats">
                  <div className="project-stat">
                    <HiOutlineClipboardList className="project-stat-icon" />
                    {project.tasks_count || 0} tarefas
                  </div>
                  <div className="project-stat">
                    <HiOutlineUserGroup className="project-stat-icon" />
                    {project.members_count || 0} membros
                  </div>
                  <div className="project-progress">
                    <div className="project-progress-label">
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editProject ? 'Editar Projeto' : 'Novo Projeto'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? <span className="spinner" /> : editProject ? 'Salvar' : 'Criar'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="project-name">
              Nome do Projeto *
            </label>
            <input
              id="project-name"
              type="text"
              className="form-input"
              placeholder="Ex: Redesign do Site"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="project-desc">
              Descrição
            </label>
            <textarea
              id="project-desc"
              className="form-textarea"
              placeholder="Descreva o projeto..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
