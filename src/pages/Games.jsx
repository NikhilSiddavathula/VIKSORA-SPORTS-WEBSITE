import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Badge,
  Fab,
  Zoom,
  useTheme,
  keyframes,
  styled,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Paper,
  Divider
} from '@mui/material';
import {
  Search,
  SportsBaseball,
  FilterList,
  ArrowForward,
  Favorite,
  Star,
  Visibility,
  Close,
  Payment,
  QrCodeScanner,
  CheckCircle,
  Error as ErrorIcon,
  PhoneAndroid,
  CreditCard
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { sportsData } from '../data/viksoraSportsMockData'; // Import sports data
import { getGameImagePath, handleImageError, gameImageMap } from '../utils/imageUtils'; // Import image utilities

// Create animations
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
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;
const GameCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.5s, box-shadow 0.5s',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 16,
  border: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  maxHeight: { xs: '450px', sm: '480px', md: '500px' },
  minHeight: { xs: '450px', sm: '480px', md: '500px' },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
    '& .game-overlay': {
      opacity: 1,
    },
    '& .game-content': {
      transform: 'translateY(0)',
    },
    '& .game-image': {
      transform: 'scale(1.08)',
    }
  },
  '& .game-overlay': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
    opacity: 0,
    transition: 'opacity 0.3s',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .game-content': {
    transform: 'translateY(10px)',
    transition: 'transform 0.3s',
    zIndex: 2,
  },
  '& .game-image': {
    transition: 'transform 0.6s ease',
  }
}));
const GameImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  height: '220px',
  flexShrink: 0,
  '&::before': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
    zIndex: 1,
  },
  '&::after': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #2196F3, #00BCD4, #4CAF50, #8BC34A, #CDDC39, #FFEB3B, #FFC107, #FF9800, #F44336)',
    opacity: 0.8,
    zIndex: 3,
  },
}));
const GameNameOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1.5, 2),
  background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
  color: 'white',
  zIndex: 2,
  backdropFilter: 'blur(4px)',
}));



// Note: getGameImagePath is imported from imageUtils.js - no need to redeclare it here

const Games = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleCards, setVisibleCards] = useState(6); // Number of cards to show initially
  
  // Payment states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [paymentStep, setPaymentStep] = useState(0); // 0: QR, 1: Processing, 2: Success, 3: Failed
  const [paymentError, setPaymentError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(99); // Default payment amount
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' or 'card'
  const [pendingGame, setPendingGame] = useState(null); // Game to open payment for after login
  
  // Sample games data with images (fallback if API fails)
  const sampleGames = sportsData; // Use sportsData as fallback
  
  // Custom GameImage component with fallback handling
  const GameImage = ({ game, alt, height, ...props }) => {
    const [imgSrc, setImgSrc] = React.useState(() => {
      const imagePath = getGameImagePath(game);
      console.log('GameImage: Setting initial image path for', game.name, 'to', imagePath);
      return imagePath;
    });
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    
    const handleError = (e) => {
      console.log(`Image failed to load for ${game.name}:`, imgSrc);
      
      // Use the centralized error handling
      handleImageError(e, game.name, () => {
        setImageError(true);
      });
    };
    
    const handleLoad = () => {
      setImageLoaded(true);
      console.log(`Image loaded successfully for ${game.name}:`, imgSrc);
    };
    
    return (
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          height: height || '100%',
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
        
        {imageError ? (
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
              {game.icon || '🏆'}
            </Typography>
            <Typography variant="body2">
              {game.name}
            </Typography>
          </Box>
        ) : (
          <img
            src={imgSrc}
            alt={alt || game.name}
            onError={handleError}
            onLoad={handleLoad}
            style={{
              width: '100%',
              height: height || '100%',
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
  
  useEffect(() => {
    fetchGames();
  }, []);
  
  useEffect(() => {
    filterGames();
  }, [games, searchTerm, categoryFilter]);
  
  // Check if user just logged in and has a pending game
  useEffect(() => {
    if (isAuthenticated && pendingGame) {
      setSelectedGame(pendingGame);
      setPaymentModalOpen(true);
      setPendingGame(null);
      
      // Set payment amount based on game
      if (pendingGame.popularity === 'High') {
        setPaymentAmount(149);
      } else if (pendingGame.rating >= 4.7) {
        setPaymentAmount(129);
      } else {
        setPaymentAmount(99);
      }
    }
  }, [isAuthenticated, pendingGame]);
  
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/games');
      if (response.data.success && response.data.data.length > 0) {
        // Add images to games from API if they don't have them
        const gamesWithImages = response.data.data.map((game) => {
          // If game already has an image, clean it up if needed
          if (game.image) {
            // Remove any duplicate /images/sports/ prefix
            let cleanImage = game.image;
            if (cleanImage.includes('/images/sports//images/sports/')) {
              cleanImage = cleanImage.replace('/images/sports//images/sports/', '/images/sports/');
            }
            return {
              ...game,
              image: cleanImage,
              rating: game.rating || 4.5,
              popularity: game.popularity || 'Medium'
            };
          }
          
          // Otherwise, try to find a matching image based on game name
          const normalizedName = game.name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          let matchingImage = null;

          // Try direct match in gameImageMap
          if (gameImageMap[normalizedName]) {
            matchingImage = gameImageMap[normalizedName];
          } else {
            // Try variations of the name
            const nameVariations = [
              normalizedName,
              normalizedName.replace(/-/g, ''),
              normalizedName.replace(/-/g, '_'),
            ];

            // Try each variation to see if we have a mapping
            for (const variation of nameVariations) {
              if (gameImageMap[variation]) {
                matchingImage = gameImageMap[variation];
                break;
              }
            }

            // If still no match, use the getGameImagePath function
            if (!matchingImage) {
              matchingImage = getGameImagePath(game);
            }
          }

          return {
            ...game,
            image: matchingImage,
            rating: game.rating || 4.5,
            popularity: game.popularity || 'Medium'
          };
        });
        setGames(gamesWithImages);
      } else {
        // Use sample data if no games in database
        setGames(sampleGames);
        console.log('Using sportsData as fallback');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      // Use sample data as fallback
      setGames(sampleGames);
      console.log('Using sportsData as fallback due to error');
      setError('Using sample data - backend connection failed');
    } finally {
      setLoading(false);
    }
  };
  
  const filterGames = () => {
    let filtered = games;
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(game =>
        game.categories.includes(categoryFilter)
      );
    }
    setFilteredGames(filtered);
  };
  
  const getAllCategories = () => {
    const categories = new Set();
    games.forEach(game => {
      game.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  };
  
  const handleCardHover = (id) => {
    setHoveredCard(id);
  };
  
  const loadMoreCards = () => {
    setVisibleCards(prev => prev + 3);
  };
  
  // Payment functions
  const handleExploreClick = (game) => {
    // Navigate directly to the game details page without showing payment modal
    navigate(`/game/${game.name}`);
  };
  
  const handlePaymentSubmit = () => {
    setPaymentStep(1); // Move to processing step
    
    // Simulate payment processing
    setTimeout(() => {
      // In a real app, you would verify the payment with your backend
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        setPaymentStep(2); // Success
        toast.success('Payment successful!');
      } else {
        setPaymentError('Payment failed. Please try again.');
        setPaymentStep(3); // Failed
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };
  
  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    // Navigate to the game page after successful payment
    navigate(`/game/${selectedGame.name}`);
  };
  
  const handleClosePaymentModal = () => {
    if (paymentStep === 2) {
      handlePaymentComplete();
    } else {
      setPaymentModalOpen(false);
    }
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Function to simulate QR code scanning
  const simulateQRScan = () => {
    setPaymentStep(1);
    
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      
      if (isSuccess) {
        setPaymentStep(2);
        toast.success('Payment successful!');
      } else {
        setPaymentError('Payment failed. Please try again.');
        setPaymentStep(3);
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Loading amazing sports experiences...</Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl" sx={{ mt: 6, mb: 8, px: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8, position: 'relative', overflow: 'hidden', py: 6 }}>
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            zIndex: -1,
            borderRadius: 2
          }}
        />
        <Typography 
          variant="h2" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            animation: `${fadeIn} 0.8s ease-out`
          }}
        >
          Explore Sports & Games
        </Typography>
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 4,
            animation: `${fadeIn} 0.8s ease-out 0.2s both`
          }}
        >
          Discover Your Passion, Master Your Game
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto', 
            fontSize: '1.1rem',
            animation: `${fadeIn} 0.8s ease-out 0.4s both`
          }}
        >
          From team sports to individual challenges, find the perfect game that matches your 
          interests and fitness goals. Each sport comes with professional training, equipment 
          recommendations, and a community of enthusiasts.
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="info" sx={{ mb: 3, animation: `${fadeIn} 0.5s ease-out` }}>
          {error}
        </Alert>
      )}
      
      {/* Search and Filter */}
      <Box sx={{ mb: 6, animation: `${fadeIn} 0.8s ease-out 0.6s both` }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={showFilters ? 8 : 10}>
            <TextField
              fullWidth
              label="Search games..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 30,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={6} md={showFilters ? 2 : 1}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                height: '56px',
                borderRadius: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FilterList />
            </Button>
          </Grid>
          <Grid item xs={6} md={showFilters ? 2 : 1}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
              sx={{ 
                height: '56px',
                borderRadius: 30
              }}
            >
              Clear
            </Button>
          </Grid>
          
          {showFilters && (
            <Grid item xs={12} sx={{ mt: 2, animation: `${fadeIn} 0.5s ease-out` }}>
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Filter by Category"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {getAllCategories().map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </Box>
      
      {/* Games Grid */}
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mt: 1, width: '100%', maxWidth: '1400px', mx: 'auto' }}>
        {filteredGames.slice(0, visibleCards).map((game, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3}
            key={game._id}
            sx={{ 
              animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <Zoom in={true} timeout={300 + index * 100}>
              <GameCard 
                onMouseEnter={() => handleCardHover(game._id)}
                onMouseLeave={() => handleCardHover(null)}
                elevation={3}
              >
                <GameImageContainer>
                  <GameImage
                    game={game}
                    height="200px"
                    className="game-image"
                  />
                  
                  <GameNameOverlay>
                    <Typography variant="h6" fontWeight="bold" noWrap>
                      {game.name}
                    </Typography>
                  </GameNameOverlay>
                  
                  <Box className="game-overlay">
                    <Fab 
                      color="secondary" 
                      aria-label="explore"
                      onClick={() => handleExploreClick(game)}
                      sx={{
                        animation: hoveredCard === game._id ? `${pulse} 1.5s infinite` : 'none'
                      }}
                    >
                      <Visibility />
                    </Fab>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {game.icon}
                    </Typography>
                  </Box>
                  
                  {game.popularity === 'High' && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        left: 10,
                        zIndex: 3,
                      }}
                    >
                      <Chip 
                        label="Popular" 
                        color="secondary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  )}
                </GameImageContainer>
                
                <CardContent className="game-content" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5, minHeight: '120px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      {game.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {game.rating}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {game.description.length > 80 ? `${game.description.substring(0, 80)}...` : game.description}
                  </Typography>
                  
                  {/* Categories */}
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {game.categories.slice(0, 2).map((category, idx) => (
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
                    {game.categories.length > 2 && (
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
                  
                  {/* Equipment Count */}
                  {game.equipment && game.equipment.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SportsBaseball fontSize="small" color="primary" sx={{ mr: 0.75 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {game.equipment.length} equipment items available
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Action Button */}
                  <Button
                    onClick={() => handleExploreClick(game)}
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForward />}
                    sx={{ 
                      mt: 'auto',
                      borderRadius: 30,
                      py: 1,
                      fontWeight: 600,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    Explore {game.name}
                  </Button>
                </CardContent>
              </GameCard>
            </Zoom>
          </Grid>
        ))}
        </Grid>
      </Box>
      
      {filteredGames.length === 0 && !loading && (
        <Box textAlign="center" sx={{ mt: 6, py: 4, animation: `${fadeIn} 0.5s ease-out` }}>
          <Typography variant="h6" color="text.secondary">
            No games found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search terms or filters
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2, borderRadius: 30 }}
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
      
      {/* Load More Button */}
      {visibleCards < filteredGames.length && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={loadMoreCards}
            sx={{ borderRadius: 30 }}
          >
            Load More Games
          </Button>
        </Box>
      )}
      
      {/* Call to Action */}
      <Box 
        sx={{ 
          mt: 8, 
          textAlign: 'center', 
          p: { xs: 4, md: 6 }, 
          bgcolor: 'grey.50', 
          borderRadius: 4,
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}05, ${theme.palette.secondary.main}05)`,
          animation: `${fadeIn} 0.8s ease-out 0.8s both`
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Don't See Your Sport?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
          We're constantly adding new sports and activities. Let us know what you're interested in!
        </Typography>
        <Button
          component={Link}
          to="/contact"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{ 
            borderRadius: 30,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
            }
          }}
        >
          Request a Sport
        </Button>
      </Box>
      
      {/* Payment Modal */}
      <Dialog 
        open={paymentModalOpen} 
        onClose={handleClosePaymentModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: theme.palette.primary.main,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Payment sx={{ mr: 1 }} />
            <Typography variant="h6">Payment for {selectedGame?.name}</Typography>
          </Box>
          <IconButton onClick={handleClosePaymentModal} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          {paymentError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {paymentError}
            </Alert>
          )}
          
          <Stepper activeStep={paymentStep} alternativeLabel sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Payment</StepLabel>
            </Step>
            <Step>
              <StepLabel>Processing</StepLabel>
            </Step>
            <Step>
              <StepLabel>Complete</StepLabel>
            </Step>
          </Stepper>
          
          {paymentStep === 0 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" textAlign="center" mb={2}>
                Choose Payment Method
              </Typography>
              
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Button
                    variant={paymentMethod === 'upi' ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => handlePaymentMethodChange('upi')}
                    startIcon={<PhoneAndroid />}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      justifyContent: 'flex-start'
                    }}
                  >
                    UPI
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => handlePaymentMethodChange('card')}
                    startIcon={<CreditCard />}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      justifyContent: 'flex-start'
                    }}
                  >
                    Card
                  </Button>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              {paymentMethod === 'upi' ? (
                <Box textAlign="center">
                  <Typography variant="body1" paragraph>
                    Scan the QR code below with your payment app to complete the transaction
                  </Typography>
                  
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      display: 'inline-block',
                      mb: 3,
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      position: 'relative'
                    }}
                  >
                    <QRCodeSVG 
                      value={`upi://pay?pa=sports@merchant&pn=SportsPlatform&am=${paymentAmount}&cu=INR&tn=Payment for ${selectedGame?.name}`} 
                      size={200}
                      level="H"
                      includeMargin
                    />
                    
                    {/* Scanner overlay effect */}
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
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                        '&:hover': {
                          opacity: 1,
                          cursor: 'pointer'
                        }
                      }}
                      onClick={simulateQRScan}
                    >
                      <QrCodeScanner sx={{ fontSize: 40, color: 'white' }} />
                      <Typography variant="body1" color="white" sx={{ mt: 1 }}>
                        Click to Scan
                      </Typography>
                    </Box>
                  </Paper>
                  
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    ₹{paymentAmount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access to {selectedGame?.name} premium content
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={simulateQRScan}
                    sx={{ mt: 2 }}
                    startIcon={<QrCodeScanner />}
                  >
                    Simulate QR Scan
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" paragraph>
                    Enter your card details to complete the payment
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        variant="outlined"
                        placeholder="1234 5678 9012 3456"
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        variant="outlined"
                        placeholder="MM/YY"
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="CVV"
                        variant="outlined"
                        placeholder="123"
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cardholder Name"
                        variant="outlined"
                        placeholder="John Doe"
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
          
          {paymentStep === 1 && (
            <Box textAlign="center" py={4}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6">Processing your payment...</Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we verify your transaction
              </Typography>
            </Box>
          )}
          
          {paymentStep === 2 && (
            <Box textAlign="center" py={4}>
              <CheckCircle color="success" sx={{ fontSize: 60, mb: 3 }} />
              <Typography variant="h6" color="success.main">Payment Successful!</Typography>
              <Typography variant="body1" paragraph>
                Thank you for your payment. You now have access to premium content for {selectedGame?.name}.
              </Typography>
            </Box>
          )}
          
          {paymentStep === 3 && (
            <Box textAlign="center" py={4}>
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 3 }} />
              <Typography variant="h6" color="error.main">Payment Failed!</Typography>
              <Typography variant="body1" paragraph>
                We couldn't process your payment. Please try again.
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          {paymentStep === 0 && (
            <>
              <Button onClick={handleClosePaymentModal} color="inherit">
                Cancel
              </Button>
              <Button 
                onClick={handlePaymentSubmit} 
                variant="contained" 
                color="primary"
                startIcon={<QrCodeScanner />}
              >
                Pay ₹{paymentAmount}
              </Button>
            </>
          )}
          
          {paymentStep === 2 && (
            <Button 
              onClick={handlePaymentComplete} 
              variant="contained" 
              color="primary"
              fullWidth
            >
              Continue to {selectedGame?.name}
            </Button>
          )}
          
          {paymentStep === 3 && (
            <>
              <Button onClick={handleClosePaymentModal} color="inherit">
                Cancel
              </Button>
              <Button 
                onClick={() => setPaymentStep(0)} 
                variant="contained" 
                color="primary"
              >
                Try Again
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Games;