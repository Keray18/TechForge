import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  setAuthData: (token: string, user: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Project API
export const projectAPI = {
  submitProject: async (projectData: any) => {
    const response = await api.post('/projects/submit', projectData);
    return response.data;
  },
  
  getClientProjects: async () => {
    const response = await api.get('/projects/client');
    // Backend returns { success: true, projects: [...] }
    return response.data;
  },
  
  getAllProjects: async () => {
    const response = await api.get('/projects');
    // Backend returns { success: true, projects: [...] }
    return response.data;
  },
  
  getProjectById: async (projectId: string) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },
  
  acceptProject: async (projectId: string) => {
    const response = await api.put(`/projects/${projectId}/accept`);
    return response.data;
  },
  
  rejectProject: async (projectId: string, rejectionReason?: string) => {
    const response = await api.put(`/projects/${projectId}/reject`, { rejectionReason });
    return response.data;
  },
  
  completeProject: async (projectId: string) => {
    const response = await api.put(`/projects/${projectId}/complete`);
    return response.data;
  }
};

// Notification API
export const notificationAPI = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    // Return the data directly since backend now returns { success: true, data: [...] }
    return response.data;
  },
  
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
  
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

export default api; 