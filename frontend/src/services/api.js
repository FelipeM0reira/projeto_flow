import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // Users
  getUsers: () => api.get('/users/'),
  
  getUser: (id) => api.get(`/users/${id}/`),
  
  createUser: (userData) => api.post('/users/', userData),
  
  updateUser: (id, userData) => api.put(`/users/${id}/`, userData),
  
  deleteUser: (id) => api.delete(`/users/${id}/`),
  
  // Theme
  getUserTheme: (id) => api.get(`/users/${id}/get_theme/`),
  
  updateUserTheme: (id, theme) => 
    api.patch(`/users/${id}/theme/`, { theme_preference: theme }),
};

export default apiService;
