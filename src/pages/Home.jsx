// client/src/pages/Home.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Avatar,
  useTheme,
  keyframes,
  useMediaQuery,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Popper,
  Grow,
  ClickAwayListener
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sports,
  FitnessCenter,
  Restaurant,
  People,
  CheckCircle,
  ArrowForward,
  Speed,
  EmojiEvents,
  Group,
  TrendingUp,
  Lightbulb,
  WorkspacePremium,
  Groups,
  Person,
  Verified,
  ChevronLeft,
  ChevronRight,
  Search
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { 
  fadeInUp, 
  scaleIn, 
  pulse,
  float,
  fadeInLeft,
  fadeInRight,
  textEffects
} from '../utils/animations';
import apiWithFallback from '../utils/apiHelper';
import { getImagePath, getSportsImagePath, handleImageError as handleImageErrorUtil, getGameImagePath } from '../utils/imageUtils';
import VirtualizedGamesList from '../components/common/VirtualizedGamesList';
import { sportsData } from '../data/viksoraSportsMockData'; // Import sports data

// Create custom text glow animation
const textGlow = keyframes`
  0% {
    textShadow: '0 0 5px rgba(255,255,255,0.5)';
  }
  50% {
    textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.6)';
  }
  100% {
    textShadow: '0 0 5px rgba(255,255,255,0.5)';
  }
`;

// Game image mapping
const gameImageMap = {
  'archery': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201924/archery_foy88h.jpg',
  'athletics': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201924/athletics_nx5ajp.jpg',
  'running': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201942/running_ibudcq.jpg',
  'atya-patya': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/atya-patya_fw0glx.jpg',
  'arm-wrestling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/arm-wrestling_ok4aka.jpg',
  'aankh-micholi': 'aankh-micholi.jpeg',
  'antakshari': 'antakshari.jpeg',
  'badminton': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/badminton_ldbkfv.jpg',
  'baseball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/baseball_emu7aq.jpg',
  'basketball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/basketball_yddtdk.jpg',
  'beach-volleyball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/beach-volleyball_s3lgus.jpg',
  'billiards': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/billiards_avscut.jpg',
  'boxing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/boxing_qt7jyx.jpg',
  'carrom': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/carrom_m1p30e.jpg',
  'chess': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/chess_cyxej0.jpg',
  'cricket': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/cricket_sgh2mw.jpg',
  'cycling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/cycling_smexdq.jpg',
  'canoeing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/canoeing_x8gjcs.jpg',
  'chaturanga': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaturanga_sbtzsp.jpg',
  'chaupar-pachisi': 'chaupar-pachisi.jpeg',
  'diving': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/diving_lcfqzt.jpg',
  'dodgeball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/dodgeball_m8jeqy.jpg',
  'discus-throw': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/discus-throw_yvtdu3.jpg',
  'dance': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/dance_pubntr.jpg',
  'equestrian': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/equestrian_xdhqfe.jpg',
  'esports': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/esports_kdqcn9.jpg',
  'fencing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/fencing_ke3dek.jpg',
  'field-hockey': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/field-hockey_xpfvnf.jpg',
  'football': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/football_etnazv.jpg',
  'gilli-danda': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201932/gilli-danda_ubpqmn.jpg',
  'golf': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201932/golf_rcus47.jpg',
  'gymnastics': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201933/gymnastics_ijduhw.jpg',
  'gatka': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/gatka_kva8sq.jpg',
  'gutte': 'gutte.jpeg',
  'handball': 'handball.jpeg',
  'high-jump': 'high-jump.jpeg',
  'hide-and-seek': 'hide-and-seek.jpeg',
  'hopscotch': 'hopscotch.jpeg',
  'javelin-throw': 'javelin-throw.jpeg',
  'judo': 'judo.jpeg',
  'kabaddi': 'kabaddi.jpeg',
  'karate': 'karate.jpeg',
  'kho-kho': 'kho-kho.jpeg',
  'kayaking': 'kayaking.jpeg',
  'kalaripayattu': 'kalaripayattu.jpeg',
  'kung-fu': 'kung-fu.jpeg',
  'lagori': 'lagori.jpeg',
  'langdi': 'langdi.jpeg',
  'lattoo': 'lattoo.jpeg',
  'lawn-tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201947/tennis_kpgzbh.jpg',
  'mallakhamb': 'mallakhamb.jpeg',
  'marathon': 'marathon.jpeg',
  'marbles': 'marbles.jpeg',
  'mountaineering': 'mountaineering.jpeg',
  'muay-thai': 'muay-thai.jpeg',
  'paddle-tennis': 'paddle-tennis.jpeg',
  'pallanguzhi': 'pallanguzhi.jpeg',
  'pickleball': 'pickleball.jpeg',
  'pole-vault': 'pole-vault.jpeg',
  'powerlifting': 'powerlifting.jpeg',
  'relay-race': 'relay-race.jpeg',
  'rock-climbing': 'rockclimbing.jpeg',
  'rowing': 'rowing.jpeg',
  'rugby': 'rugby.jpeg',
  'sailing': 'sailing.jpeg',
  'sambo': 'sambo.jpeg',
  'shooting': 'shooting.jpeg',
  'shot-put': 'shot-put.jpeg',
  'silambam': 'silambam.jpeg',
  'snakes-and-ladders': 'snakes-and-ladders.jpeg',
  'snooker': 'snooker.jpeg',
  'softball': 'softball.jpeg',
  'squash': 'squash.jpeg',
  'swimming': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/swimming_ck7hem.jpg',
  'sepak-takraw': 'sepak-takraw.jpeg',
  'surfing': 'surfing.jpeg',
  'table-tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/table-tennis_hvvkay.jpg',
  'taekwondo': 'taekwondo.jpeg',
  'triathlon': 'triathlon.jpeg',
  'tug-of-war': 'tug-of-war.jpeg',
  'vish-amrit': 'vish-amrit.jpeg',
  'volleyball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201948/volleyball_hqvsvl.jpg',
  'water-polo': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201948/water-polo_apnezg.jpg',
  'weightlifting': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201949/weightlifting_eewfxe.jpg',
  'wrestling': 'wrestling.jpeg',
  'wushu': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201950/wushu_tk0tvs.jpg',
  'yoga': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201950/yoga_xsg1mi.jpg',
  'martial-arts': 'martialarts.jpeg'
};

// ScrollableGamesSection component moved outside Home component
const ScrollableGamesSection = React.memo(({ 
  games, 
  isMobile, 
  getGameImagePath, 
  handleImageError,
  isAuthenticated,
  navigate
}) => {
  const scrollContainerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(true);
  
  useEffect(() => {
    setIsMounted(true);
    console.log('Scroll container ref:', scrollContainerRef.current);
    if (scrollContainerRef.current) {
      console.log('Scroll container width:', scrollContainerRef.current.scrollWidth);
      console.log('Scroll container client width:', scrollContainerRef.current.clientWidth);
    }
  }, []);

  // Ensure scroll container is properly initialized
  useEffect(() => {
    if (isMounted && scrollContainerRef.current) {
      console.log('Scroll container initialized with', games.length, 'games');
      console.log('Scroll container dimensions:', {
        scrollWidth: scrollContainerRef.current.scrollWidth,
        clientWidth: scrollContainerRef.current.clientWidth,
        scrollLeft: scrollContainerRef.current.scrollLeft
      });
    }
  }, [isMounted, games]);
  
  // Scroll function removed as we're now using scrollbar instead of buttons
  
  const handleExploreClick = (gameName) => {
    // Find the game object from the games array
    const game = games.find(g => g.name === gameName);
    if (game) {
      // Navigate to the game details page regardless of authentication status
      navigate(`/game/${gameName}`);
    }
  };
  
  return (
    <Box sx={{ backgroundColor: 'grey.50', py: { xs: 6, md: 10 } }}>
      <Container>
        <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              opacity: isMounted ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
            }}
          >
            Explore Sports
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              opacity: isMounted ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out 0.2s',
            }}
          >
            Discover a wide range of sports and activities
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', overflow: 'auto', width: '100%' }}>
          {/* Scroll buttons */}
          <>

              

          </>
          
          {/* Scrollable container */}
          <VirtualizedGamesList 
            games={games}
            isMobile={isMobile}
            isAuthenticated={isAuthenticated}
          />
        </Box>
        
        <Box textAlign="center" mt={{ xs: 3, md: 4 }}>
          <Button
            variant="outlined"
            component={Link}
            to="/games"
            endIcon={<ArrowForward />}
            sx={{ 
              borderRadius: 30,
              fontWeight: 600,
              opacity: isMounted ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out 0.6s',
            }}
          >
            View All Sports
          </Button>
        </Box>
      </Container>
    </Box>
  );
});

const Home = () => {
  // All hooks must be called at the top level, unconditionally
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [games, setGames] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const searchRef = useRef(null);
  
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Media queries
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Load video only after initial render for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1000); // Delay video loading by 1 second
    
    return () => clearTimeout(timer);
  }, []);
  
  // Define callbacks unconditionally - use the centralized function
  const getGameImagePathCallback = useCallback((game) => {
    return getGameImagePath(game);
  }, []);
  
  const handleImageError = useCallback((game, e) => {
    console.error(`Image failed to load for ${game.name}:`, e.target.src);
    
    setImageErrors(prev => ({
      ...prev,
      [game._id]: true
    }));
    
    // Try using the utility function
    if (!handleImageErrorUtil(e.target, getSportsImagePath(game.name, 'jpg'))) {
      // Final fallback to Unsplash if utility fails
      e.target.src = `https://source.unsplash.com/800x600/?${encodeURIComponent(game.name || 'sports')}`;
    }
  }, []);
  
const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (!isAuthenticated) {
      // Show toast message and redirect to login with message and return path
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Please login to search for games');
      });
      navigate('/login', {
        state: {
          message: 'Please login to search for games',
          from: window.location.pathname
        }
      });
      return;
    }

    // Filter games based on search query
    const filteredGames = games.filter(game =>
      game.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredGames);
    setShowSearchResults(true);
  }, [games, isAuthenticated, navigate]);
  
  const handleSearchResultClick = (game) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    // Special handling for login prompt
    if (game._id === 'login-prompt') {
      navigate('/login', {
        state: {
          message: 'Please login to search for games',
          from: window.location.pathname
        }
      });
      return;
    }
    
    // Navigate directly to the game detail page regardless of authentication status
    navigate(`/game/${game.name}`);
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Effects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchGames = () => {
      // Directly load all games from sportsData
      setGames(sportsData);
      console.log('Loaded all games from sportsData:', sportsData.length, 'games');

      // Log all game names to verify they're loaded
      console.log('Game names:', sportsData.map(game => game.name));
    };
    
    checkAuth();
    fetchGames();
  }, []);

  // Ensure all games are loaded
  useEffect(() => {
    if (games.length === 0) {
      setGames(sportsData);
      console.log('Ensured all games loaded:', sportsData.length, 'games');
    }
  }, [games]);
  
  // Log games count for debugging
  useEffect(() => {
    console.log('Current games count:', games.length);
    if (games.length > 0) {
      console.log('First 5 game names:', games.slice(0, 5).map(game => game.name));
    }
  }, [games]);

  // Conditional return at the end, after all hooks
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  // Features data
  const features = [
    {
      title: 'Sports Training',
      description: 'Professional training programs for all skill levels',
      icon: <Sports fontSize="large" />
    },
    {
      title: 'Fitness Plans',
      description: 'Personalized fitness plans tailored to your goals',
      icon: <FitnessCenter fontSize="large" />
    },
    {
      title: 'Nutrition Guidance',
      description: 'Expert nutrition advice for optimal performance',
      icon: <Restaurant fontSize="large" />
    },
    {
      title: 'Community',
      description: 'Connect with fellow athletes and enthusiasts',
      icon: <People fontSize="large" />
    }
  ];
  

  

  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '100vh' },
          minHeight: { xs: '500px', md: '600px' },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: 'grey.900', // Fallback background to prevent gray showing
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          }
        }}
      >
        {/* Background image fallback - kept as backup */}
        <Box
          component="img"
          src={getImagePath('/images/banner/banner_1.png')}
          alt="Sports Banner"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: showVideo && isVideoLoaded ? 0 : 1, // Show fallback image when video is not loaded
            transition: 'opacity 0.5s ease',
          }}
          onError={(e) => {
            console.error("Banner image failed to load:", e);
            // If image fails to load, hide it
            e.target.style.display = 'none';
          }}
        />

        {/* Video element with improved loading logic */}
        {showVideo && (
          <Box
            component="video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => {
              console.log("Video loaded successfully");
              setIsVideoLoaded(true);
            }}
            onError={(e) => {
              console.error("Video failed to load:", e);
              // Hide video if it fails to load
              e.target.style.display = 'none';
            }}
            onPlay={() => {
              console.log("Video started playing");
            }}
            onCanPlay={() => {
              console.log("Video can play");
              setIsVideoLoaded(true);
            }}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              opacity: isVideoLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease',
              backgroundColor: 'transparent',
            }}
          >
            <source src="https://res.cloudinary.com/dwvwhzahe/video/upload/v1758201323/HOMEPAGEBANNERVIDEO_wbp8vi.mov" type="video/mp4" />
            Your browser does not support the video tag.
          </Box>
        )}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }} style={{ maxWidth: 'none', width: '95%' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{ animation: `${fadeInUp} 0.8s ease-out both` }}>
                <Typography 
                  variant={isMobile ? "h2" : "h1"} 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4.5rem' },
                    color: 'white',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    lineHeight: 1.1,
                    mb: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 2,
                    '&:hover': {
                      color: theme.palette.secondary.main,
                      transform: 'scale(1.02)',
                      textShadow: '0 6px 12px rgba(0,0,0,0.5)',
                      '&::after': {
                        width: '100%',
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-5px',
                      left: 0,
                      width: '0%',
                      height: '3px',
                      backgroundColor: theme.palette.secondary.main,
                      transition: 'width 0.3s ease',
                    },
                    animation: `${textGlow} 2s ease-in-out infinite`,
                  }}
                >
          Elevate Your Athletic Performance
                </Typography>
                
                <Typography 
                  variant={isMobile ? "h5" : "h4"} 
                  component="p" 
                  gutterBottom 
                  sx={{ 
                    color: 'white', 
                    mb: { xs: 3, md: 4 },
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    animation: `${fadeInLeft} 0.8s ease-out 0.2s both`,
                    cursor: 'pointer',
                    '&:hover': {
                      color: theme.palette.secondary.main,
                      transform: 'translateX(5px)',
                      ...textEffects.underline
                    }
                  }}
                >
                  
                </Typography>
                
                <Typography 
                  variant={isMobile ? "body2" : "body1"} 
                  sx={{ 
                    mb: { xs: 4, md: 5 }, 
                    maxWidth: '600px', 
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    lineHeight: 1.6,
                    animation: `${fadeInRight} 0.8s ease-out 0.4s both`,
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'white',
                      transform: 'translateX(5px)',
                    }
                  }}
                >
                  Join thousands of athletes and fitness enthusiasts in achieving their goals with our comprehensive platform.
                </Typography>
                
                {/* Removed search bar from home page banner as per user request */}
              </Box>
            </Grid>
            
            {/* <Grid item xs={12} md={5}>
              <Box 
                sx={{
                  animation: `${scaleIn} 0.8s ease-out 0.3s both`,
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <Box 
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    p: 3,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Why Choose Us?
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography sx={{ color: 'white' }}>Expert coaching from professionals</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography sx={{ color: 'white' }}>Personalized training programs</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography sx={{ color: 'white' }}>Nutrition and diet guidance</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle sx={{ color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography sx={{ color: 'white' }}>Community support and motivation</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid> */}
          </Grid>
        </Container>
        
        <Box 
          sx={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            animation: `${pulse} 2s ease-in-out infinite`,
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              display: 'block',
              width: '30px', 
              height: '30px', 
              borderRadius: '50%',
              backgroundColor: 'white',
              mb: 1,
              mx: 'auto'
            }}
          />
          <Typography variant="caption" sx={{ color: 'white' }}>
            Scroll Down
          </Typography>
        </Box>
      </Box>
      

      
      {/* ========== SECTION ORDER CHANGE: GAMES MOVED HERE ========== */}
      
      {/* Scrollable Games Section */}
      <ScrollableGamesSection 
        games={games}
        isMobile={isMobile}
        getGameImagePath={getGameImagePathCallback}
        handleImageError={handleImageError}
        isAuthenticated={isAuthenticated}
        navigate={navigate}
      />

      {/* About Us Section */}
      <Box sx={{ 
        py: { xs: 6, md: 10 }, 
        backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(255, 64, 129, 0.05))',
          zIndex: -1,
        }
      }}>
        <Container maxWidth="lg" style={{ maxWidth: 'none', width: '95%' }}>
          <Box textAlign="center" mb={{ xs: 4, md: 8 }}>
            <Typography 
              variant={isMobile ? "h3" : "h2"} 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                animation: `${fadeInUp} 0.6s ease-out both`,
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: '2px',
                }
              }}
            >
              About VIKSORASPORTS
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              color="text.secondary"
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto',
                mt: 3,
                animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
              }}
            >
              Empowering Athletes, Building Champions
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                maxWidth: '800px', 
                mx: 'auto',
                mt: 2,
                lineHeight: 1.6,
                fontSize: { xs: '0.9rem', md: '1rem' },
                animation: `${fadeInUp} 0.6s ease-out 0.4s both`,
              }}
            >
              VIKSORASPORTS is India's premier sports and fitness platform, dedicated to connecting 
              athletes with world-class trainers, providing comprehensive fitness programs, and 
              fostering a community of sports enthusiasts.
            </Typography>
          </Box>
          
          {/* Mission & Vision */}
          <Grid container spacing={4} sx={{ mb: { xs: 4, md: 8 } }}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 4,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  animation: `${fadeInLeft} 0.6s ease-out both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: { xs: '60px', md: '80px' }, 
                    height: { xs: '60px', md: '80px' }, 
                    borderRadius: '50%', 
                    backgroundColor: `${theme.palette.primary.main}10`,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    animation: `${float} 3s ease-in-out infinite`,
                  }}
                >
                  <Lightbulb fontSize="large" />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                  Our Mission
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  To empower athletes by providing guidance, training, and career paths in achieving their goals.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 4,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  animation: `${fadeInRight} 0.6s ease-out both`,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: { xs: '60px', md: '80px' }, 
                    height: { xs: '60px', md: '80px' }, 
                    borderRadius: '50%', 
                    backgroundColor: `${theme.palette.secondary.main}10`,
                    color: theme.palette.secondary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    animation: `${float} 3s ease-in-out infinite`,
                    animationDelay: '0.5s',
                  }}
                >
                  <WorkspacePremium fontSize="large" />
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                  Our Vision
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  To build a recognised ecosystem of sports excellence by identifying talent, providing elite resources, and cutting-edge solutions for athletes.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* What We Offer */}
          <Grid container spacing={4} sx={{ mb: { xs: 4, md: 6 } }}>
            {[
              {
                icon: <Person fontSize="large" />,
                title: "Professional Training",
                description: "Connect with certified trainers across various sports disciplines."
              },
              {
                icon: <WorkspacePremium fontSize="large" />,
                title: "Comprehensive Programs",
                description: "Access structured fitness and nutrition programs designed by experts."
              },
              {
                icon: <Groups fontSize="large" />,
                title: "Community Support",
                description: "Join a vibrant community of athletes and fitness enthusiasts."
              },
              {
                icon: <EmojiEvents fontSize="large" />,
                title: "Achievement Tracking",
                description: "Monitor your progress and celebrate your milestones."
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box 
                  sx={{ 
                    p: { xs: 2, md: 3 },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 4,
                    backgroundColor: 'background.paper',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    animation: `${fadeInUp} 0.6s ease-out ${index * 0.1}s both`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: { xs: '60px', md: '70px' }, 
                      height: { xs: '60px', md: '70px' }, 
                      borderRadius: '50%', 
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box 
            sx={{ 
              mt: { xs: 4, md: 8 },
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              textAlign: 'center',
              animation: `${fadeInUp} 0.6s ease-out both`,
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600} mb={2}>
              Join Our Community Today
            </Typography>
            <Typography variant={isMobile ? "body2" : "body1"} mb={3}>
              Become part of a growing community of athletes and fitness enthusiasts who are transforming their lives with VIKSORASPORTS.
            </Typography>
            <Button 
              variant="contained" 
              color="inherit" 
              size={isMobile ? "medium" : "large"}
              component={Link}
              to={isAuthenticated ? "/dashboard" : "/signup"}
              endIcon={<ArrowForward />}
              sx={{ 
                px: { xs: 3, md: 4 }, 
                py: { xs: 1, md: 1.5 },
                borderRadius: 50,
                fontWeight: 600,
                fontSize: { xs: '0.9rem', md: '1rem' },
                backgroundColor: 'white',
                color: theme.palette.primary.main,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 8px 25px rgba(0,0,0,0.25)',
                },
              }}
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Box textAlign="center" mb={{ xs: 4, md: 8 }}>
          <Typography 
            variant={isMobile ? "h3" : "h2"} 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              animation: `${fadeInUp} 0.6s ease-out both`,
            }}
          >
            Why Choose VIKSORASPORTS?
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
            }}
          >
            We provide everything you need to excel in your athletic journey
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  textAlign: 'center',
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.05)',
                  animation: `${fadeInUp} 0.6s ease-out ${index * 0.1 + 0.4}s both`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box 
                  sx={{ 
                    width: { xs: '60px', md: '70px' }, 
                    height: { xs: '60px', md: '70px' }, 
                    borderRadius: '50%', 
                    backgroundColor: `${theme.palette.primary.main}10`,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    animation: `${scaleIn} 0.6s ease-out`,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      

      {/* CTA Section */}
      <Box 
        sx={{
          backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              animation: `${fadeInUp} 0.6s ease-out both`,
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"} 
            sx={{ 
              mb: { xs: 3, md: 5 }, 
              maxWidth: '600px', 
              mx: 'auto',
              fontWeight: 300,
              animation: `${fadeInUp} 0.6s ease-out 0.2s both`,
            }}
          >
            Join thousands of athletes and fitness enthusiasts who have already transformed their lives with VIKSORASPORTS.
          </Typography>
          
          <Button 
            variant="contained" 
            color="secondary" 
            size={isMobile ? "medium" : "large"}
            component={Link}
            to={isAuthenticated ? "/dashboard" : "/signup"}
            endIcon={<ArrowForward />}
            sx={{ 
              px: { xs: 3, md: 5 }, 
              py: { xs: 1, md: 1.5 },
              borderRadius: 50,
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              background: 'white',
              color: theme.palette.primary.main,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              animation: `${scaleIn} 0.6s ease-out 0.4s both`,
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;