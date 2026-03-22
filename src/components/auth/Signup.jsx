// client/src/components/auth/Signup.jsx
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
} from '@mui/material';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import CountryDropdown from '../common/CountryDropdown';
// import OAuth from './OAuth'; // Temporarily disabled

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    state: '',
  });
  
  const { name, email, phone, password, confirmPassword, country, state } = formData;
  const { signup, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      country: e.target.value,
      state: '' // Reset state when country changes
    });
  };

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      await signup({
        name,
        email,
        phone,
        password,
        country,
        state
      });
      
      toast.success('Account created successfully!');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Signup error:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={6} sx={{ padding: 6, width: '100%', maxWidth: 500, minHeight: 650 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Sign Up for VIKSORASPORTS
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ mt: 2 }}
            noValidate
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
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
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
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
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
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

            {/* Country and State Dropdown */}
            <CountryDropdown
              country={country}
              state={state}
              onCountryChange={handleCountryChange}
              onStateChange={handleStateChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={onChange}
              helperText="Password must be at least 6 characters long"
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
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : 'Sign Up'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link
                to="/login"
                style={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontWeight: '500',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Already have an account? Login
              </Link>
            </Box>
          </Box>
          
          {/* Temporarily disabled Google OAuth */}
          {/* 
          <Divider sx={{ my: 3 }}>OR</Divider>
          <OAuth mode="signup" />
          */}
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup;