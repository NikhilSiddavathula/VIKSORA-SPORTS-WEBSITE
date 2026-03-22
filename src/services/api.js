// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.viksorasports.com/api';

const api = {
  get: async (endpoint) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Network error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please ensure the backend server is running.');
      }
      throw error;
    }
  },
  post: async (endpoint, data) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Network error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please ensure the backend server is running.');
      }
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Network error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please ensure the backend server is running.');
      }
      throw error;
    }
  },
};

export default api;