// client/src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
// import OAuth from './OAuth'; // Temporarily disabled
// import EnhancedMobileForm from '../common/EnhancedMobileForm'; // Unused
import { usePerformanceTracking, trackInteraction } from '../../utils/performanceMonitoring';

const Login = () => {
  // Track component performance
  usePerformanceTracking('Login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state
  
  const { email, password } = formData;
  const { login, loading, error, isAuthenticated, user, resetLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // If user is admin, redirect to admin dashboard
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        // Otherwise, redirect to the original destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

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
    
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
      toast.success('Login successful!');
      // Redirection is handled by the useEffect above
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Login error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={6} sx={{ padding: 6, width: '100%', maxWidth: 500, minHeight: 450 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Login to VIKSORASPORTS
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 2 }}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.dark',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  height: 56,
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.dark',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                height: 56,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
                transition: 'all 0.2s ease-in-out',
              }}
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? <CircularProgress size={28} color="inherit" /> : 'Login'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link
                to="/signup"
                style={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: '500',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
          
          {/* Temporarily disabled Google OAuth */}
          {/* 
          <Divider sx={{ my: 3 }}>OR</Divider>
          <OAuth mode="login" />
          */}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;