// client/src/services/adminService.js
import axios from 'axios';

// Get backend URL
const getBackendUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://api.viksorasports.com';
};

// Create axios instance with authentication
const api = axios.create({
  baseURL: getBackendUrl(),
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API request wrapper with error handling
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const method = options.method || 'get';
    const data = options.data || null;
    
    // Ensure endpoint starts with /api if not already
    const cleanEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    
    let config = {
      method,
      url: cleanEndpoint,
    };
    
    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }
    
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    
    // Handle authentication errors more carefully
    if (error.response && error.response.status === 401) {
      console.warn(`Authentication error for ${endpoint}:`, error.response.data);
      // Don't automatically clear token and redirect for admin API calls
      // Let the AdminPanel component handle this gracefully with fallback data
      // Only clear token if it's clearly invalid (multiple consecutive failures)
    }
    
    throw error;
  }
};

// User management
export const fetchUsers = () => apiRequest('/api/admin/users');
export const createUser = (userData) => apiRequest('/api/admin/users', { method: 'post', data: userData });
export const updateUser = (userId, userData) => apiRequest(`/api/admin/users/${userId}`, { method: 'put', data: userData });
export const deleteUser = (userId) => apiRequest(`/api/admin/users/${userId}`, { method: 'delete' });

// Trainer applications
export const fetchTrainerApplications = () => {
  console.log('Fetching trainer applications...');
  return apiRequest('/api/admin/trainer-applications')
    .then(response => {
      console.log('Trainer applications response:', response);
      return response;
    })
    .catch(error => {
      console.error('Error fetching trainer applications:', error);
      throw error;
    });
};
export const createTrainerApplication = (applicationData) => apiRequest('/api/admin/trainer-applications', { method: 'post', data: applicationData });
export const deleteTrainerApplication = (appId) => apiRequest(`/api/admin/trainer-applications/${appId}`, { method: 'delete' });
export const approveTrainerApplication = (appId) => apiRequest(`/api/admin/trainer-applications/${appId}/approve`, { method: 'post' });
export const rejectTrainerApplication = (appId) => apiRequest(`/api/admin/trainer-applications/${appId}/reject`, { method: 'post' });

// Sponsorships
export const fetchSponsorships = () => apiRequest('/api/admin/sponsorships');
export const approveSponsorship = (sponsorshipId) => apiRequest(`/api/admin/sponsorships/${sponsorshipId}/approve`, { method: 'post' });
export const rejectSponsorship = (sponsorshipId) => apiRequest(`/api/admin/sponsorships/${sponsorshipId}/reject`, { method: 'post' });

// Payments
export const fetchPayments = () => apiRequest('/api/admin/payments');

// Collaboration requests
export const fetchCollaborationRequests = () => apiRequest('/api/admin/collaboration-requests');
export const updateCollaborationRequest = (requestId, status) => 
  apiRequest(`/api/admin/collaboration-requests/${requestId}`, { method: 'put', data: { status } });

// Contact submissions
export const fetchContactSubmissions = () => apiRequest('/api/admin/contact-submissions');
export const updateContactSubmission = (submissionId, status) => 
  apiRequest(`/api/admin/contact-submissions/${submissionId}`, { method: 'put', data: { status } });

// Courses
export const fetchCourses = () => apiRequest('/api/admin/courses');
export const createCourse = (courseData) => apiRequest('/api/admin/courses', { method: 'post', data: courseData });
export const updateCourse = (courseId, courseData) => apiRequest(`/api/admin/courses/${courseId}`, { method: 'put', data: courseData });
export const deleteCourse = (courseId) => apiRequest(`/api/admin/courses/${courseId}`, { method: 'delete' });

// Sessions
export const fetchSessions = () => apiRequest('/api/admin/sessions');
export const createSession = (sessionData) => apiRequest('/api/admin/sessions', { method: 'post', data: sessionData });
export const updateSession = (sessionId, sessionData) => apiRequest(`/api/admin/sessions/${sessionId}`, { method: 'put', data: sessionData });
export const deleteSession = (sessionId) => apiRequest(`/api/admin/sessions/${sessionId}`, { method: 'delete' });

// One-on-One Sessions (aliases for compatibility)
export const fetchOneOnOneSessions = () => apiRequest('/api/admin/sessions');
export const createOneOnOneSession = (sessionData) => apiRequest('/api/admin/sessions', { method: 'post', data: sessionData });
export const updateOneOnOneSession = (sessionId, sessionData) => apiRequest(`/api/admin/sessions/${sessionId}`, { method: 'put', data: sessionData });
export const deleteOneOnOneSession = (sessionId) => apiRequest(`/api/admin/sessions/${sessionId}`, { method: 'delete' });

// Games
export const fetchGames = () => apiRequest('/api/admin/games');
export const createGame = (gameData) => apiRequest('/api/admin/games', { method: 'post', data: gameData });
export const updateGame = (gameId, gameData) => apiRequest(`/api/admin/games/${gameId}`, { method: 'put', data: gameData });
export const deleteGame = (gameId) => apiRequest(`/api/admin/games/${gameId}`, { method: 'delete' });
export const seedGames = () => apiRequest('/api/admin/games/seed', { method: 'post' });

// Sponsorship Requests (aliases for compatibility)
export const fetchSponsorshipRequests = () => apiRequest('/api/admin/sponsorships');
export const updateSponsorshipRequest = (reqId, status) => apiRequest(`/api/admin/sponsorships/${reqId}/${status}`, { method: 'post' });

// Admin dashboard stats
export const fetchDashboardStats = () => apiRequest('/api/admin/dashboard');

// Admin profile management
export const updateAdminProfile = (profileData) => apiRequest('/api/admin/profile', { method: 'put', data: profileData });
export const changeAdminPassword = (passwordData) => apiRequest('/api/admin/password', { method: 'put', data: passwordData });

// Admin user management
export const fetchAdminUsers = () => apiRequest('/api/admin/admins');
export const createAdminUser = (adminData) => apiRequest('/api/admin/admins', { method: 'post', data: adminData });

export default apiRequest;
