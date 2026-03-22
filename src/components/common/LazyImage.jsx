import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { getImagePath, handleImageError as handleImageErrorUtil } from '../../utils/imageUtils';

const LazyImage = ({ 
  src, 
  alt, 
  width = '100%', 
  height = '100%', 
  sx = {}, 
  fallbackSrc,
  component = 'img',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    // Try fallback image first
    if (fallbackSrc && !hasError) {
      e.target.src = getImagePath(fallbackSrc);
      setHasError(true);
      return;
    }
    
    // Try using the utility function
    if (!handleImageErrorUtil(e.target, src)) {
      // Final fallback to placeholder image from Unsplash
      e.target.src = 'https://images.unsplash.com/photo-1630734242335-1555e4a438a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxwbGFjZWhvbGRlciUyMHNwb3J0cyUyMGdlbmVyaWN8ZW58MHwyfHx8MTc1ODE3OTY1Mnww&ixlib=rb-4.1.0&q=85';
      e.target.alt = 'Placeholder image - MJH SHIKDER on Unsplash';
    }
    
    setIsLoaded(true);
  };

  const Component = component;

  return (
    <Box sx={{ position: 'relative', width, height, ...sx }}>
      {!isLoaded && (
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      
      <Component
        ref={imgRef}
        src={getImagePath(src)}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          ...props.style
        }}
        {...props}
      />
    </Box>
  );
};

export default LazyImage;