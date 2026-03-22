import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  minHeight: '50px',
  minWidth: '50px',
}));

const LogoImage = styled('img')({
  height: '50px',
  maxWidth: '200px',
  objectFit: 'contain',
  display: 'block',
  transition: 'opacity 0.3s ease',
});

const LogoText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main || '#0066CC'}, ${theme.palette.primary.dark || '#004499'})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  fontSize: '1.5rem',
  letterSpacing: '-0.5px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

const Logo = ({ onClick, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Multiple logo sources to try
  const logoSources = [
    'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758200189/Blue_Master_Logo_Horizontal_Logo_15x_ezczjt.png', // Primary Cloudinary logo
    '/images/logo.png', // Original logo fallback
    'https://images.unsplash.com/photo-1657483203411-d0d74a8d2d7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxsb2dvJTIwc3BvcnRzJTIwdGV4dCUyMHByb2Zlc3Npb25hbCUyMGNvbXBhbnl8ZW58MHwwfHxibHVlfDE3NTgxOTk4MjZ8MA&ixlib=rb-4.1.0&q=85', // Generic fallback logo
  ];
  
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    if (currentLogoIndex < logoSources.length - 1) {
      // Try next logo source
      setCurrentLogoIndex(prev => prev + 1);
    } else {
      // All sources failed, show text logo
      setImageError(true);
      setImageLoaded(false);
    }
  };

  // Reset when logo sources change
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [currentLogoIndex]);

  return (
    <LogoContainer onClick={onClick} {...props}>
      {!imageError && (
        <LogoImage
          src={logoSources[currentLogoIndex]}
          alt={currentLogoIndex === 0 ? "VIKSORASPORTS Logo" : currentLogoIndex === 1 ? "VIKSORASPORTS Logo" : "VIKSORASPORTS Logo - Marek Piwnicki on Unsplash"}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            display: imageLoaded ? 'block' : 'none',
            width: 'auto',
            height: '50px'
          }}
        />
      )}
      
      {(imageError || !imageLoaded) && (
        <LogoText variant="h6">
          VIKSORASPORTS
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;