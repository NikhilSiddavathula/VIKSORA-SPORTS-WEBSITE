import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state
  
  const { email, password } = formData;
  const { adminLogin, loading, error, isAuthenticated, user, resetLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated as admin
  useEffect(() => {
    console.log('AdminLogin: Checking auth state...');
    console.log('- Is Authenticated:', isAuthenticated);
    console.log('- User:', user);
    console.log('- User Role:', user?.role);
    
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        console.log('AdminLogin: Admin already authenticated, redirecting to admin panel');
        // Direct redirect to admin panel for admin users
        navigate('/adminpanel', { replace: true });
        toast.success(`Welcome back, Admin ${user.name}!`);
      } else {
        console.log('AdminLogin: User authenticated but not admin');
        // If user is not admin, show error and redirect to home
        toast.error('Access denied. Admin credentials required.');
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Reset loading state when component unmounts
  useEffect(() => {
    return () => {
      if (loading) {
        resetLoading();
      }
    };
  }, [loading, resetLoading]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    console.log('AdminLogin: Starting login process...');
    setIsSubmitting(true);
    
    try {
      // Use the adminLogin function from AuthContext
      const loginResult = await adminLogin({ email, password });
      console.log('AdminLogin: Login successful:', loginResult);
      
      if (loginResult && loginResult.user && loginResult.user.role === 'admin') {
        console.log('AdminLogin: Admin role verified, redirecting...');
        toast.success(`Welcome Admin ${loginResult.user.name}! Redirecting to dashboard...`);
        
        // Wait a moment for the state to update
        setTimeout(() => {
          navigate('/adminpanel', { replace: true });
        }, 100);
      } else {
        console.error('AdminLogin: Invalid response or role:', loginResult);
        toast.error('Invalid admin credentials or insufficient privileges');
      }
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Admin login error:', err);
      toast.error('Admin login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Admin Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }} align="center">
          This area is restricted to administrators only
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
          <Box 
            component="form" 
            onSubmit={handleLogin} 
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
            noValidate
          >
            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? <CircularProgress size={24} color="inherit" /> : 'Login as Admin'}
            </Button>
            
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link to="/login">Return to User Login</Link>
            </Box>
          </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;