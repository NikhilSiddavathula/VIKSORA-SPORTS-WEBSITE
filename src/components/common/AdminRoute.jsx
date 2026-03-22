// client/src/components/common/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  
  // Debug logging
  console.log('AdminRoute: Checking access...');
  console.log('- Loading:', loading);
  console.log('- Is Authenticated:', isAuthenticated);
  console.log('- User:', user);
  console.log('- User Role:', user?.role);
  console.log('- Token exists:', localStorage.getItem('token') ? 'Yes' : 'No');
  console.log('- Admin flag:', localStorage.getItem('isAdmin'));

  if (loading) {
    console.log('AdminRoute: Still loading...');
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('AdminRoute: Not authenticated, redirecting to login');
    // Redirect to admin login page with return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'admin') {
    console.log('AdminRoute: User is not admin, showing access denied');
    // Show unauthorized message for non-admin users
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        p: 3
      }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You don't have permission to access this page. Admin privileges required.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Current role: {user?.role || 'No role'}
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  console.log('AdminRoute: Access granted, rendering admin dashboard');
  return children;
};

export default AdminRoute;