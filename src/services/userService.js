// src/services/userService.js

// Fixed: Use Vite's environment variable syntax instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic request function with authentication
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized. Please login again.');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
};

// User profile API functions
export const fetchUserProfile = () => apiRequest('/api/user/profile');

// User courses API functions
export const fetchUserCourses = () => apiRequest('/api/user/courses');

// User progress API functions
export const fetchUserProgress = () => apiRequest('/api/user/progress');
