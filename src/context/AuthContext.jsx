import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import axios from 'axios';

// Create context with a default value
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  signup: async () => {},
  login: async () => {},
  adminLogin: async () => {},
  logout: () => {},
  updateUser: () => {},
  clearErrors: () => {},
  resetLoading: () => {}
});

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// ✅ FIXED: Updated to use the correct backend URL consistently
const getBackendUrl = () => {
  // Use the environment variable first, then fallback to custom domain
  const urls = [
    import.meta.env.VITE_API_BASE_URL,
    'https://api.viksorasports.com', // Custom domain
    'https://viksora-backend.vercel.app', // Canonical fallback URL
  ].filter(Boolean);
  
  const url = urls[0] || 'https://api.viksorasports.com';
  console.log('Available backend URLs:', urls);
  console.log('Backend URL being used:', url);
  return url;
};

// Create axios instance
const backendUrl = getBackendUrl();
console.log('Creating axios instance with baseURL:', backendUrl);
const api = axios.create({
  baseURL: backendUrl,
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

// Add response interceptor to handle authentication errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for non-admin API calls
    // Admin panel should handle its own errors gracefully
    if (error.response?.status === 401 && !error.config?.url?.includes('/admin/')) {
      console.log('AuthContext: 401 error detected for non-admin endpoint, clearing auth state');
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('isAdmin');
      // Dispatch LOGOUT to update the state
      if (dispatchRef.current) {
        dispatchRef.current({ type: 'LOGOUT' });
      }
    }
    return Promise.reject(error);
  }
);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isMounted = useRef(true);
  const dispatchRef = useRef();
  dispatchRef.current = dispatch;

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    
    console.log('AuthContext: Loading user on mount...');
    console.log('- Token exists:', token ? 'Yes' : 'No');
    console.log('- Admin flag:', isAdmin);
    
    // Try to get user data from local storage
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthContext: Found stored user:', parsedUser);
        
        // Verify token is not expired
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) {
            console.log('AuthContext: Token expired, clearing storage');
            localStorage.removeItem('token');
            localStorage.removeItem('userProfile');
            localStorage.removeItem('isAdmin');
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
          }
        }
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: parsedUser },
        });
        console.log('AuthContext: User authenticated from storage');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('userProfile');
      }
    }
    
    const loadUser = async () => {
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < currentTime) throw new Error('Token expired');
        }
        const response = await api.get('/api/auth/me');
        if (isMounted.current) {
          // Merge server data with local data if available
          const localUser = localStorage.getItem('userProfile');
          const userData = localUser ? JSON.parse(localUser) : {};
          
          // Create a merged object with server data as base and local data overriding
          const mergedUser = {
            ...response.data.user,
            ...userData
          };
          
          // Update local storage with merged data
          localStorage.setItem('userProfile', JSON.stringify(mergedUser));
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: mergedUser },
          });
        }
      } catch (error) {
        if (isMounted.current) {
          localStorage.removeItem('token');
          dispatch({
            type: 'AUTH_FAILURE',
            payload: error.response?.data?.message || error.message || 'Session expired',
          });
        }
      }
    };
    loadUser();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Signup
  const signup = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('Attempting signup with API URL:', backendUrl);
      console.log('Form data:', formData);
      
      const response = await api.post('/api/auth/signup', formData);
      console.log('Signup response:', response.data);
      const { token, user } = response.data;
      
      // Store both token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userProfile', JSON.stringify(user));
      
      console.log('Signup successful');
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return user;
      
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Server configuration error. Please contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Login
  const login = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('Attempting login with API URL:', backendUrl);
      console.log('Form data:', formData);
      
      const response = await api.post('/api/auth/login', formData);
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      
      // Store both token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userProfile', JSON.stringify(user));
      
      // Check if user is an admin
      if (user.role === 'admin') {
        console.log('Admin user detected, will redirect to admin dashboard');
        localStorage.setItem('isAdmin', 'true');
      }
      
      console.log('Login successful');
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return user;
      
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Server configuration error. Please contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Google OAuth login - Temporarily disabled
  /*
  const googleLogin = async (googleToken) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('Making Google OAuth request to:', '/api/auth/google');
      const response = await api.post('/api/auth/google', { token: googleToken });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      // Check if user is an admin
      if (user.role === 'admin') {
        console.log('Admin user detected via Google OAuth, will redirect to admin dashboard');
      }
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return user;
    } catch (error) {
      console.error('Google OAuth error:', error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || error.message || 'Google login failed',
      });
      throw error;
    }
  };
  */

  // Admin login
  const adminLogin = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('Attempting admin login with API URL:', backendUrl);
      console.log('Form data:', formData);
      
      const response = await api.post('/api/auth/admin-login', formData);
      console.log('Admin login response:', response.data);
      const { token, user } = response.data;
      
      // Verify user has admin role
      if (user.role !== 'admin') {
        console.error('User does not have admin role:', user.role);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Store both token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userProfile', JSON.stringify(user));
      localStorage.setItem('isAdmin', 'true');
      
      console.log('Admin login successful');
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      return { user, token };
      
    } catch (error) {
      console.error('Admin login error:', error);
      let errorMessage = 'Admin login failed';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Server configuration error. Please contact support.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAdmin');
    console.log('AuthContext: Logged out, cleared all localStorage items');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Reset loading
  const resetLoading = () => {
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  // Update user
  const updateUser = (userData) => {
    // Save to local storage
    localStorage.setItem('userProfile', JSON.stringify(userData));
    
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user: userData }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signup,
        login,
        // googleLogin, // Temporarily disabled
        adminLogin,
        logout,
        updateUser,
        clearErrors,
        resetLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
