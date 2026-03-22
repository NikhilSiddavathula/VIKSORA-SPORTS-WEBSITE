// client/src/components/updates/ScrollingSportsUpdates.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  Link,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  styled,
  keyframes
} from '@mui/material';
import {
  EventNote,
  Schedule,
  Source,
  TrendingUp,
  ImportantDevices,
  Sports,
  EmojiEvents,
  Announcement,
  Refresh
} from '@mui/icons-material';
import sportsUpdatesService from '../../services/sportsUpdatesService';

// Continuous scrolling animation
const scrollAnimation = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ScrollContainer = styled(Box)(({ theme, speed = 50 }) => ({
  height: '400px',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30px',
    background: `linear-gradient(to bottom, ${theme.palette.background.default}, transparent)`,
    zIndex: 2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30px',
    background: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
    zIndex: 2,
  }
}));

const ScrollingContent = styled(Box)(({ theme, speed = 50 }) => ({
  animation: `${scrollAnimation} ${speed}s linear infinite`,
  padding: theme.spacing(1)
}));

const UpdateCard = styled(Paper)(({ theme, importance }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  borderLeft: `4px solid ${
    importance === 'high' 
      ? theme.palette.error.main 
      : importance === 'medium' 
        ? theme.palette.warning.main 
        : theme.palette.info.main
  }`,
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.action.hover,
  },
  animation: `${fadeIn} 0.6s ease-out`,
}));

const CategoryIcon = ({ category }) => {
  const iconMap = {
    'Official Announcement': <Announcement />,
    'Tournament': <EmojiEvents />,
    'Technology': <ImportantDevices />,
    'League Update': <Sports />,
    'Championship': <EmojiEvents />,
    'Rule Change': <EventNote />,
    'Development': <TrendingUp />,
    'Regulations': <EventNote />,
    'Rankings': <TrendingUp />,
    'Competition Format': <Sports />,
    'New Tournament': <EmojiEvents />,
    'Olympic Qualification': <EmojiEvents />
  };
  
  return iconMap[category] || <EventNote />;
};

const ScrollingSportsUpdates = ({
  gameName,
  height = 400,
  speed = 50,
  showHeader = true,
  maxUpdates = 20
}) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const scrollRef = useRef();

  useEffect(() => {
    let mounted = true;

    const fetchUpdates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try Indian official sources first, then international
        let fetchedUpdates = await sportsUpdatesService.getSportUpdates(gameName, 'indian');
        
        // If no Indian updates, try international sources
        if (fetchedUpdates.length === 0) {
          fetchedUpdates = await sportsUpdatesService.getSportUpdates(gameName, 'international');
        }
        
        // Format updates for the component
        const formattedUpdates = fetchedUpdates.slice(0, maxUpdates).map((update, index) => ({
          id: update.id || `${gameName.toLowerCase().replace(/\s+/g, '-')}-${index}-${update.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}`,
          title: update.title,
          content: update.content,
          summary: update.content ? update.content.substring(0, 150) + '...' : '',
          publishedDate: new Date(update.date),
          source: update.source,
          sourceUrl: update.url || '#',
          category: update.type === 'official' ? 'Official Announcement' : 'Sports Update',
          importance: update.priority || 'medium',
          tags: [gameName, update.source]
        }));
        
        if (mounted) {
          // Duplicate updates for continuous scrolling effect
          const duplicatedUpdates = [
            ...formattedUpdates,
            ...formattedUpdates,
            ...formattedUpdates
          ];
          setUpdates(duplicatedUpdates);
        }
      } catch (err) {
        console.error('Failed to fetch sports updates:', err);
        if (mounted) {
          setError('Failed to load updates. Displaying sample content.');
          // Set fallback updates with consistent dates
          const fallbackUpdates = [
            {
              id: `${gameName.toLowerCase()}-fallback-1`,
              title: `${gameName} Training Programs Updated`,
              content: `New training methodologies for ${gameName} have been introduced.`,
              summary: `New training methodologies for ${gameName} have been introduced.`,
              publishedDate: new Date('2024-12-01T10:00:00Z'),
              source: 'VIKSORASPORTS',
              sourceUrl: '#',
              category: 'Training Update',
              importance: 'medium',
              tags: [gameName, 'Training']
            },
            {
              id: `${gameName.toLowerCase()}-fallback-2`,
              title: `Upcoming ${gameName} Championships`,
              content: `Several ${gameName} competitions are scheduled for the coming months.`,
              summary: `Several ${gameName} competitions are scheduled for the coming months.`,
              publishedDate: new Date('2024-12-02T14:00:00Z'),
              source: 'VIKSORASPORTS',
              sourceUrl: '#',
              category: 'Championship',
              importance: 'high',
              tags: [gameName, 'Championship']
            }
          ];
          const duplicatedFallback = [...fallbackUpdates, ...fallbackUpdates, ...fallbackUpdates];
          setUpdates(duplicatedFallback);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUpdates();

    // Refresh updates every 5 minutes for real-time experience
    const interval = setInterval(fetchUpdates, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [gameName, maxUpdates]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': return theme.palette.error.main;
      case 'medium': return theme.palette.warning.main;
      default: return theme.palette.info.main;
    }
  };

  const handleUpdateClick = (update) => {
    if (update.sourceUrl && update.sourceUrl !== '#') {
      window.open(update.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log(`Refreshing updates for ${gameName}...`);

      // Call the refresh API endpoint
      const refreshedUpdates = await sportsUpdatesService.refreshSportUpdates(gameName);

      if (refreshedUpdates && refreshedUpdates.length > 0) {
        // Format refreshed updates
        const formattedUpdates = refreshedUpdates.slice(0, maxUpdates).map((update, index) => ({
          id: update.id || `${gameName.toLowerCase().replace(/\s+/g, '-')}-${index}-${update.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}`,
          title: update.title,
          content: update.content,
          summary: update.content ? update.content.substring(0, 150) + '...' : '',
          publishedDate: new Date(update.date),
          source: update.source,
          sourceUrl: update.url || '#',
          category: update.type === 'official' ? 'Official Announcement' : 'Sports Update',
          importance: update.priority || 'medium',
          tags: [gameName, update.source]
        }));

        // Duplicate updates for continuous scrolling effect
        const duplicatedUpdates = [
          ...formattedUpdates,
          ...formattedUpdates,
          ...formattedUpdates
        ];
        setUpdates(duplicatedUpdates);
        console.log(`Successfully refreshed ${formattedUpdates.length} updates for ${gameName}`);
      } else {
        console.log(`No new updates found for ${gameName}`);
      }
    } catch (error) {
      console.error(`Error refreshing updates for ${gameName}:`, error);
      // If refresh fails, try to fetch fresh data
      try {
        const fetchedUpdates = await sportsUpdatesService.getSportUpdates(gameName, 'indian');
        if (fetchedUpdates && fetchedUpdates.length > 0) {
          const formattedUpdates = fetchedUpdates.slice(0, maxUpdates).map((update, index) => ({
            id: update.id || `${gameName.toLowerCase().replace(/\s+/g, '-')}-${index}-${update.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10)}`,
            title: update.title,
            content: update.content,
            summary: update.content ? update.content.substring(0, 150) + '...' : '',
            publishedDate: new Date(update.date),
            source: update.source,
            sourceUrl: update.url || '#',
            category: update.type === 'official' ? 'Official Announcement' : 'Sports Update',
            importance: update.priority || 'medium',
            tags: [gameName, update.source]
          }));

          const duplicatedUpdates = [
            ...formattedUpdates,
            ...formattedUpdates,
            ...formattedUpdates
          ];
          setUpdates(duplicatedUpdates);
        }
      } catch (fallbackError) {
        console.error('Fallback fetch also failed:', fallbackError);
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          height, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ height: height - 20, display: 'flex', alignItems: 'center' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {showHeader && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventNote color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Latest {gameName} Updates
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              size="small"
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                '&.Mui-disabled': {
                  color: theme.palette.action.disabled,
                }
              }}
              title="Refresh updates"
            >
              {refreshing ? (
                <CircularProgress size={20} />
              ) : (
                <Refresh />
              )}
            </IconButton>
            <Chip
              label="Live"
              size="small"
              color="error"
              sx={{ animation: `${fadeIn} 2s ease infinite alternate` }}
            />
          </Box>
        </Box>
      )}
      
      <ScrollContainer height={height}>
        <ScrollingContent speed={speed} ref={scrollRef}>
          {updates.map((update, index) => (
            <UpdateCard 
              key={`${update.id}-${index}`}
              importance={update.importance}
              onClick={() => handleUpdateClick(update)}
              elevation={2}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getImportanceColor(update.importance),
                    width: 40,
                    height: 40
                  }}
                >
                  <CategoryIcon category={update.category} />
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip 
                      label={update.category}
                      size="small"
                      variant="outlined"
                      color={
                        update.importance === 'high' ? 'error' :
                        update.importance === 'medium' ? 'warning' : 'info'
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(update.publishedDate)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={600}
                    sx={{ 
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {update.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 1
                    }}
                  >
                    {update.summary || update.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Source fontSize="small" color="action" />
                    <Link 
                      variant="caption" 
                      color="primary"
                      underline="hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateClick(update);
                      }}
                    >
                      {update.source}
                    </Link>
                    
                    {update.tags && (
                      <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                        {update.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            variant="filled"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 20,
                              bgcolor: theme.palette.action.selected,
                              color: theme.palette.text.secondary
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </UpdateCard>
          ))}
        </ScrollingContent>
      </ScrollContainer>
      
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          textAlign: 'center',
          mt: 1
        }}
      >
        Updates from official sports organizations • Continuous scrolling
      </Typography>
    </Box>
  );
};

export default ScrollingSportsUpdates;