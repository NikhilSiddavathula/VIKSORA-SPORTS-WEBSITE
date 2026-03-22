import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getGameImagePath, handleImageError } from '../../utils/imageUtils';

const GameImage = ({ 
  game, 
  alt, 
  height = '100%', 
  width = '100%',
  showFallback = true,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => getGameImagePath(game));

  const handleError = (e) => {
    console.log(`Image failed to load for ${game?.name}:`, e.target.src);
    
    // Use the centralized error handling
    handleImageError(e, game?.name, () => {
      setImageError(true);
    });
  };

  const handleLoad = () => {
    setImageLoaded(true);
    console.log(`Image loaded successfully for ${game?.name}:`, imageSrc);
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: width,
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: imageError ? 'rgba(0,0,0,0.1)' : 'transparent',
        overflow: 'hidden'
      }}
    >
      {!imageLoaded && !imageError && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            zIndex: 1
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}
      
      {imageError && showFallback ? (
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            textAlign: 'center',
            height: '100%',
            width: '100%'
          }}
        >
          <Typography variant="h3" sx={{ mb: 1 }}>
            {game?.icon || '🏆'}
          </Typography>
          <Typography variant="body2">
            {game?.name || 'Game'}
          </Typography>
        </Box>
      ) : (
        <img
          src={imageSrc}
          alt={alt || game?.name || 'Game image'}
          onError={handleError}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.5s ease',
            opacity: imageLoaded ? 1 : 0
          }}
          {...props}
        />
      )}
    </Box>
  );
};

export default GameImage;