import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDebug = () => {
  const { user, isAuthenticated, loading, adminLogin } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'admin@viksorasports.com',
    password: 'admin123'
  });
  const navigate = useNavigate();

  const getBackendUrl = () => {
    const urls = [
      import.meta.env.VITE_API_BASE_URL,
      'https://api.viksorasports.com',
      'https://viksora-backend.vercel.app',
    ].filter(Boolean);
    return urls[0] || 'https://api.viksorasports.com';
  };

  const testBackendConnection = async () => {
    setIsTestingConnection(true);
    const baseUrl = getBackendUrl();
    
    try {
      console.log('Testing backend connection to:', baseUrl);
      
      // Test basic connectivity
      const response = await axios.get(`${baseUrl}/api/debug`);
      setTestResults(prev => ({
        ...prev,
        connectivity: { success: true, data: response.data }
      }));
      
      // Test admin login endpoint info
      const adminInfoResponse = await axios.get(`${baseUrl}/api/auth/admin-login`);
      setTestResults(prev => ({
        ...prev,
        adminEndpoint: { success: true, data: adminInfoResponse.data }
      }));
      
      toast.success('✅ Backend connection successful!');
      
    } catch (error) {
      console.error('Backend test failed:', error);
      setTestResults(prev => ({
        ...prev,
        connectivity: { success: false, error: error.message },
        adminEndpoint: { success: false, error: error.message }
      }));
      toast.error('❌ Backend connection failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const testAdminLogin = async () => {
    try {
      console.log('Testing admin login with credentials:', testCredentials.email);
      const result = await adminLogin(testCredentials);
      toast.success('✅ Admin login successful!');
      console.log('Login result:', result);
      
      // Redirect to admin panel after successful login
      setTimeout(() => {
        navigate('/adminpanel');
      }, 1000);
      
    } catch (error) {
      console.error('Admin login test failed:', error);
      toast.error(`❌ Admin login failed: ${error.message}`);
    }
  };

  const authDebugInfo = {
    'Authentication State': isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated',
    'Loading State': loading ? '🔄 Loading' : '✅ Ready',
    'User Object': user ? '✅ Present' : '❌ Missing',
    'User Name': user?.name || 'N/A',
    'User Email': user?.email || 'N/A',
    'User Role': user?.role || 'N/A',
    'Token in LocalStorage': localStorage.getItem('token') ? '✅ Present' : '❌ Missing',
    'User Profile in LocalStorage': localStorage.getItem('userProfile') ? '✅ Present' : '❌ Missing',
    'Admin Flag in LocalStorage': localStorage.getItem('isAdmin') ? '✅ Present' : '❌ Missing',
    'Backend URL': getBackendUrl(),
    'Environment': import.meta.env.MODE || 'development'
  };

  useEffect(() => {
    console.log('AdminDebug: Component mounted');
    console.log('Current auth state:', { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        🔍 Admin Authentication Debug
      </Typography>
      
      <Grid container spacing={3}>
        {/* Authentication Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔐 Authentication Status
              </Typography>
              <List dense>
                {Object.entries(authDebugInfo).map(([key, value]) => (
                  <ListItem key={key} divider>
                    <ListItemText
                      primary={key}
                      secondary={
                        <Chip 
                          label={value} 
                          size="small"
                          color={value.includes('✅') ? 'success' : value.includes('❌') ? 'error' : 'default'}
                          variant="outlined"
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Backend Connection Test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌐 Backend Connection Test
              </Typography>
              
              <Button
                variant="contained"
                onClick={testBackendConnection}
                disabled={isTestingConnection}
                fullWidth
                sx={{ mb: 2 }}
              >
                {isTestingConnection ? <CircularProgress size={24} /> : 'Test Backend Connection'}
              </Button>
              
              {testResults.connectivity && (
                <Alert 
                  severity={testResults.connectivity.success ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">
                    <strong>Connectivity:</strong> {testResults.connectivity.success ? 'SUCCESS' : 'FAILED'}
                  </Typography>
                  {testResults.connectivity.error && (
                    <Typography variant="caption" display="block">
                      Error: {testResults.connectivity.error}
                    </Typography>
                  )}
                </Alert>
              )}
              
              {testResults.adminEndpoint && (
                <Alert 
                  severity={testResults.adminEndpoint.success ? 'success' : 'error'}
                >
                  <Typography variant="body2">
                    <strong>Admin Endpoint:</strong> {testResults.adminEndpoint.success ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </Typography>
                  {testResults.adminEndpoint.data?.example && (
                    <Typography variant="caption" display="block">
                      Suggested credentials: {testResults.adminEndpoint.data.example.email}
                    </Typography>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Login Test */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧪 Admin Login Test
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Default Admin Credentials:</strong><br/>
                  Email: admin@viksorasports.com<br/>
                  Password: admin123<br/>
                  <em>Run the admin creation script if this user doesn't exist yet.</em>
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Admin Email"
                  value={testCredentials.email}
                  onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="Admin Password"
                  type="password"
                  value={testCredentials.password}
                  onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={testAdminLogin}
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Test Admin Login'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Instructions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Troubleshooting Steps
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>1. Create Admin User (Backend):</strong><br/>
                Run this command in your server directory:
              </Typography>
              <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
                <Typography variant="code" component="pre">
                  cd server{'\n'}
                  node createAdmin.js
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>2. Test Backend Connection:</strong><br/>
                Click "Test Backend Connection" button above to verify server connectivity.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>3. Test Admin Login:</strong><br/>
                Use the "Test Admin Login" button with default credentials.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>4. Navigate to Admin Panel:</strong><br/>
                After successful login, visit: <strong>/adminpanel</strong>
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/login')}
                sx={{ mr: 2 }}
              >
                Go to Admin Login
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/adminpanel')}
                disabled={!isAuthenticated || user?.role !== 'admin'}
              >
                Go to Admin Panel
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDebug;