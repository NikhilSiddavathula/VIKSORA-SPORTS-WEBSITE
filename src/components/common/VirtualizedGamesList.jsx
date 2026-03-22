import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';
import LazyImage from './LazyImage';
import { getImagePath, getSportsImagePath, handleImageError as handleImageErrorUtil, getGameImagePath } from '../../utils/imageUtils';

const VirtualizedGamesList = ({ games, isMobile, isAuthenticated }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const containerRef = useRef(null);
  const [visibleGames, setVisibleGames] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10); // Show 10 items initially
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate how many items can fit in the container
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      // Calculate how many items can fit (with some padding)
      const itemWidth = isMobile ? 200 : 280;
      const itemsThatFit = Math.ceil(width / itemWidth) + 2; // +2 for buffer
      setEndIndex(Math.min(itemsThatFit, games.length));
    }
  }, [containerRef, isMobile, games.length]);

  // Intersection Observer for virtualization
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            if (index >= endIndex - 3 && endIndex < games.length) {
              // Load more items when we're near the end
              setEndIndex(prev => Math.min(prev + 5, games.length));
            } else if (index <= startIndex + 3 && startIndex > 0) {
              // Load previous items when we're near the start
              setStartIndex(prev => Math.max(prev - 5, 0));
            }
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    // Observe sentinel elements
    const sentinels = containerRef.current.querySelectorAll('.sentinel');
    sentinels.forEach(sentinel => observer.observe(sentinel));

    return () => {
      observer.disconnect();
    };
  }, [startIndex, endIndex, games.length]);

  const handleExploreClick = (gameName) => {
    // Navigate to the game details page regardless of authentication status
    navigate(`/game/${gameName}`);
  };

  // Calculate visible games based on startIndex and endIndex
  useEffect(() => {
    const newVisibleGames = games.slice(startIndex, endIndex);
    setVisibleGames(newVisibleGames);
  }, [games, startIndex, endIndex]);



  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollBehavior: 'smooth',
        pb: 2,
        width: '100%',
        minWidth: 'max-content',
        flexShrink: 0,
        boxSizing: 'border-box',
        '&::-webkit-scrollbar': {
          height: '10px',
          display: 'block',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
          margin: '0 10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#2196F3',
          borderRadius: '4px',
          border: '2px solid rgba(0,0,0,0.1)',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#1976D2',
        },
      }}
    >
      {games.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center', width: '100%' }}>
          <Typography variant="h6">No games available</Typography>
        </Box>
      ) : (
        <>
          {/* Render visible games */}
          {visibleGames.map((game, index) => (
            <Box
              key={game._id}
              data-index={startIndex + index}
              className="game-item"
              sx={{
                minWidth: isMobile ? 200 : 280,
                width: isMobile ? 200 : 280,
                mx: isMobile ? 0.5 : 1,
                flexShrink: 0,
                opacity: 1,
                transform: 'translateY(0)',
              }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <LazyImage
                  height={isMobile ? 140 : 160}
                  src={getGameImagePath(game)}
                  alt={game.name}
                  sx={{
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    objectFit: 'cover',
                    backgroundColor: '#f0f0f0',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant={isMobile ? "h6" : "h5"} 
                      component="h2" 
                      fontWeight={600}
                      noWrap
                    >
                      {game.name}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontSize: '1.5rem' }}>
                      {game.icon}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {game.categories && game.categories.slice(0, 2).map((category, idx) => (
                      <Chip
                        key={idx}
                        label={category}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                    {game.categories && game.categories.length > 2 && (
                      <Chip
                        label={`+${game.categories.length - 2}`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2, 
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: isMobile ? 2 : 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {game.description && game.description.length > 80
                      ? `${game.description.substring(0, 80)}...`
                      : game.description}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward />}
                    onClick={() => handleExploreClick(game.name)}
                    sx={{ 
                      mt: 'auto',
                      borderRadius: 30,
                      fontWeight: 600,
                    }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
          
          {/* Sentinel elements for intersection observer */}
          <Box className="sentinel" data-index={startIndex} sx={{ width: 1, height: 1 }} />
          <Box className="sentinel" data-index={endIndex - 1} sx={{ width: 1, height: 1 }} />
        </>
      )}
    </Box>
  );
};

export default VirtualizedGamesList;