import axios from 'axios'

const raw = process.env.REACT_APP_API_URL || 'http://localhost:8000'
const API_URL = raw.replace(/\/$/, '') + '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add JWT token
api.interceptors.request.use(config => {
  const tokens = localStorage.getItem('tokens')
  if (tokens) {
    const { access } = JSON.parse(tokens)
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Interceptor to handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens') || '{}')
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: tokens.refresh
        })
        const newTokens = {
          access: response.data.access,
          refresh: response.data.refresh || tokens.refresh
        }
        localStorage.setItem('tokens', JSON.stringify(newTokens))
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('tokens')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const authAPI = {
  register: data => api.post('/auth/register/', data),
  login: data => api.post('/auth/login/', data),
  me: () => api.get('/auth/me/'),
  updateProfile: data => api.patch('/auth/profile/', data),
  updateTheme: data => api.patch('/auth/theme/', data),
  refreshToken: refresh => api.post('/auth/token/refresh/', { refresh })
}

// Project endpoints
export const projectAPI = {
  list: () => api.get('/projects/'),
  get: id => api.get(`/projects/${id}/`),
  create: data => api.post('/projects/', data),
  update: (id, data) => api.patch(`/projects/${id}/`, data),
  delete: id => api.delete(`/projects/${id}/`),
  getMembers: id => api.get(`/projects/${id}/members/`),
  addMember: (id, data) => api.post(`/projects/${id}/add_member/`, data),
  removeMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/remove_member/${userId}/`)
}

// Task endpoints
export const taskAPI = {
  list: projectId => api.get(`/projects/${projectId}/tasks/`),
  get: (projectId, taskId) =>
    api.get(`/projects/${projectId}/tasks/${taskId}/`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks/`, data),
  update: (projectId, taskId, data) =>
    api.patch(`/projects/${projectId}/tasks/${taskId}/`, data),
  delete: (projectId, taskId) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}/`),
  toggleComplete: (projectId, taskId) =>
    api.patch(`/projects/${projectId}/tasks/${taskId}/toggle_complete/`)
}

// Dashboard endpoint
export const dashboardAPI = {
  get: () => api.get('/dashboard/')
}

export default api
