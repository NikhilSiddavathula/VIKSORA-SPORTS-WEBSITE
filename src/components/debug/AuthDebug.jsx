import React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, loading, error } = useAuth();
  
  const debugInfo = {
    // Auth context state
    isAuthenticated,
    loading,
    error,
    user: user ? { ...user, id: user.id || 'No ID' } : null,
    
    // localStorage data
    token: localStorage.getItem('token') ? 'Present' : 'Missing',
    tokenLength: localStorage.getItem('token')?.length || 0,
    userProfile: localStorage.getItem('userProfile') ? 'Present' : 'Missing',
    isAdmin: localStorage.getItem('isAdmin') || 'Not set',
    
    // Environment
    apiUrl: import.meta.env.VITE_API_BASE_URL,
    currentUrl: window.location.href,
    domain: window.location.hostname,
    
    // Browser info
    userAgent: navigator.userAgent,
    localStorage: typeof(Storage) !== "undefined" ? 'Supported' : 'Not supported'
  };
  
  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isAdmin');
    window.location.reload();
  };
  
  const testApiConnection = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/health`);
      const data = await response.json();
      console.log('API Health Check:', data);
      alert(`API Status: ${data.status || 'Unknown'}`);
    } catch (error) {
      console.error('API Connection Error:', error);
      alert(`API Connection Failed: ${error.message}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          🔍 Authentication Debug Panel
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Authentication State
        </Typography>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '0.875rem',
          overflow: 'auto'
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
        
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            onClick={clearAuth}
            color="warning"
          >
            Clear Authentication
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={testApiConnection}
            color="primary"
          >
            Test API Connection
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => window.location.href = '/admin/login'}
            color="secondary"
          >
            Go to Admin Login
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => console.log('Debug Info:', debugInfo)}
            color="info"
          >
            Log to Console
          </Button>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body2" color="text.secondary">
          <strong>How to use:</strong><br />
          1. Check if token and user data are present<br />
          2. Verify API URL is correct for your domain<br />
          3. Test API connection<br />
          4. Clear auth if stuck in bad state<br />
          5. Check browser console for detailed logs
        </Typography>
      </Paper>
    </Box>
  );
};

export default AuthDebug;