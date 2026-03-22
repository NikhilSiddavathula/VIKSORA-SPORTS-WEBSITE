import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const LogoTest = () => {
  const logoPath = '/images/logo.png';
  
  const handleImageLoad = (e) => {
    console.log('LogoTest: Logo loaded successfully');
    console.log('LogoTest: Natural dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
  };
  
  const handleImageError = (e) => {
    console.error('LogoTest: Logo failed to load from:', e.target.src);
    console.error('LogoTest: Error details:', e);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Logo Test Component
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test 1: Basic Logo Display
          </Typography>
          <img 
            src={logoPath} 
            alt="VIKSORASPORTS Logo Test" 
            style={{ height: '50px' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test 2: Logo with Error Handling
          </Typography>
          <img 
            src={logoPath} 
            alt="VIKSORASPORTS Logo Test with Error Handling" 
            style={{ height: '50px' }}
            onError={(e) => {
              console.error('LogoTest: Test 2 failed to load');
              // Try fallback
              e.target.src = 'https://via.placeholder.com/150x50/0066CC/FFFFFF?text=VIKSORASPORTS+FALLBACK';
              e.target.alt = 'VIKSORASPORTS Logo Fallback';
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test 3: Logo with Cache Busting
          </Typography>
          <img 
            src={`${logoPath}?t=${Date.now()}`} 
            alt="VIKSORASPORTS Logo Test with Cache Busting" 
            style={{ height: '50px' }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default LogoTest;