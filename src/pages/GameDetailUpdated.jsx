// client/src/pages/GameDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,

  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Badge,
  useTheme,
  keyframes,
  styled,

  CardActionArea,
  CardActions,
  Skeleton,
  Fade,
  Zoom,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  Person,
  ExpandMore,
  Favorite,
  Share,
  LocalOffer,
  Star,
  CheckCircle,
  LocationOn,
  Sports,
  School,
  EventNote,

  Close,
  PlayCircle,
  Image as ImageIcon,
  Phone,
  Email
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { sportsData } from '../data/viksoraSportsMockData'; // Import sports data
import ScrollingSportsUpdates from '../components/updates/ScrollingSportsUpdates';

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
const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
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
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  }
}));

const GameImageMap = {
  'arm-wrestling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/arm-wrestling_ok4aka.jpg',
  'atya-patya': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/atya-patya_fw0glx.jpg',
  'baseball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/baseball_emu7aq.jpg',
  'basketball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/basketball_yddtdk.jpg',
  'beach-volleyball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/beach-volleyball_s3lgus.jpg',
  'billiards': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/billiards_avscut.jpg',
  'boxing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201926/boxing_qt7jyx.jpg',
  'carrom': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/carrom_m1p30e.jpg',
  'chaturanga': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaturanga_sbtzsp.jpg',
  'canoeing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/canoeing_x8gjcs.jpg',
  'chaupar': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaupar_jrrmrv.jpg',
  'chess': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/chess_cyxej0.jpg',
  'cricket': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/cricket_sgh2mw.jpg',
  'football': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/football_etnazv.jpg',
  'tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201947/tennis_kpgzbh.jpg',
  'badminton': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201925/badminton_ldbkfv.jpg',
  'hockey': 'hockey.jpeg',
  'volleyball': 'volleyball.jpeg',
  'table tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/table-tennis_hvvkay.jpg', // Fixed mapping
  'table-tennis': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/table-tennis_hvvkay.jpg', // Fixed mapping
  'swimming': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201946/swimming_ck7hem.jpg',
  'athletics': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201924/athletics_nx5ajp.jpg',
  'wrestling': 'wrestling.jpeg',
  'golf': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201932/golf_rcus47.jpg',
  'rugby': 'rugby.jpeg',
  'american football': 'american-football.jpeg',
  'cycling': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/cycling_smexdq.jpg',
  'gymnastics': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201933/gymnastics_ijduhw.jpg',
  'shooting': 'shooting.jpeg',
  'archery': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201924/archery_foy88h.jpg',
  'weightlifting': 'weightlifting.jpeg',
  'rowing': 'rowing.jpeg',
  'sailing': 'sailing.jpeg',
  'fencing': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/fencing_ke3dek.jpg',
  'taekwondo': 'taekwondo.jpeg',
  'judo': 'judo.jpeg',
  'karate': 'karate.jpeg',
  'surfing': 'surfing.jpeg',
  'skiing': 'skiing.jpeg',
  'snowboarding': 'snowboarding.jpeg',
  'skateboarding': 'skateboarding.jpeg',
  'climbing': 'rock-climbing.jpeg', // Fixed mapping
  'rock climbing': 'rock-climbing.jpeg', // Added variant
  'equestrian': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/equestrian_xdhqfe.jpg',
  'polo': 'polo.jpeg',
  'squash': 'squash.jpeg',
  'martial arts': 'martialarts.jpeg', // Fixed mapping
  'running': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201942/running_ibudcq.jpg',
  'yoga': 'yoga.jpeg',
  'tug-of-war': 'tug-of-war.jpeg',
  'vish-amrit': 'vish-amrit.jpeg',
  'water-polo': 'water-polo.jpeg',
  'handball': 'handball.jpeg',
  'field hockey': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201931/field-hockey_xpfvnf.jpg',
  'kabaddi': 'kabaddi.jpeg',
  'kho-kho': 'kho-kho.jpeg',
  'diving': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/diving_lcfqzt.jpg',
  'dodgeball': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201930/dodgeball_m8jeqy.jpg',
  'discus-throw': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/discus-throw_yvtdu3.jpg',
  'dance': 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201929/dance_pubntr.jpg'
};

import { getImagePath, getSportsImagePath, handleImageError as handleImageErrorUtil, getGameImagePath } from '../utils/imageUtils';

// Using getGameImagePath from the fixed utility

const handleImageError = (game, fallbackName, e) => {
  console.error(`Image failed to load for ${game.name}:`, e.target.src);

  // Try using the utility function with different extensions
  if (!handleImageErrorUtil(e.target, getSportsImagePath(game.name, 'jpg'))) {
    // Try fallback name if provided
    if (fallbackName && !handleImageErrorUtil(e.target, getSportsImagePath(fallbackName))) {
      // Final fallback to Unsplash
      e.target.src = `https://source.unsplash.com/800x600/?${encodeURIComponent(game.name || fallbackName || 'sports')}`;
    }
  }
};

// Skeleton loader components
const GameDetailSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item xs={12}>
      <Skeleton variant="rectangular" height={400} />
    </Grid>
    <Grid item xs={12}>
      <Skeleton variant="text" height={60} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="rectangular" height={100} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} variant="rectangular" width={100} height={30} />
        ))}
      </Box>
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" height={30} width="40%" />
        {[1, 2, 3, 4].map((item) => (
          <Box key={item} sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
            <Skeleton variant="text" width="80%" />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rectangular" width={150} height={40} />
        <Skeleton variant="rectangular" width={150} height={40} />
        <Skeleton variant="rectangular" width={150} height={40} />
      </Box>
    </Grid>
  </Grid>
);



const GameDetail = () => {
  const theme = useTheme();
  const { name } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sessionForm, setSessionForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    date: '',
    time: '',
    duration: '',
    message: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [gameImageLoaded, setGameImageLoaded] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');




  // Share states
  const [shareSuccess, setShareSuccess] = useState(false);

  // Active section state for action buttons
  const [activeSection, setActiveSection] = useState(null);



  // Generate consistent updates (no random changes)
  const generateConsistentUpdates = (sportName) => {
    const updateTemplates = [
      {
        title: `New Training Techniques for ${sportName}`,
        content: `Discover the latest training methods that are revolutionizing how athletes approach ${sportName}. Our experts share insider tips to improve your performance.`
      },
      {
        title: `${sportName} Championship Announced`,
        content: `The annual ${sportName} championship has been scheduled for next month. Registration is now open for all skill levels.`
      },
      {
        title: `Equipment Update for ${sportName}`,
        content: `New gear and equipment specifically designed for ${sportName} have hit the market. Our review covers the top 5 must-have items.`
      },
      {
        title: `Health Benefits of ${sportName}`,
        content: `Recent studies highlight the significant health benefits of regularly playing ${sportName}, including improved cardiovascular health and mental wellbeing.`
      },
      {
        title: `Upcoming ${sportName} Workshop`,
        content: `Join our exclusive workshop next weekend where professional coaches will share advanced techniques for ${sportName}.`
      }
    ];

    // Use consistent deterministic order based on sport name hash
    const sportHash = sportName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Create a consistent "base date" for this sport (not changing with deployments)
    const baseDate = new Date('2024-01-01T00:00:00Z').getTime() + (Math.abs(sportHash) % 1000000) * 60000;

    // Always return first 3 templates in consistent order
    return updateTemplates.slice(0, 3).map((template, index) => ({
      ...template,
      date: new Date(baseDate - index * 7 * 24 * 60 * 60 * 1000).toISOString(),
      id: `${sportName.toLowerCase().replace(/\s+/g, '-')}-update-${index}`
    }));
  };

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        console.log('Fetching game with name:', name);
        const response = await api.get(`/games/name/${name}`);
        console.log('API Response:', response.data);

        const enhancedGame = {
          ...response.data.data,
          image: getGameImagePath(response.data.data, name),
          rating: response.data.data.rating || 4.5,
          benefits: response.data.data.benefits || [
            'Improves cardiovascular health',
            'Builds muscle strength',
            'Enhances coordination and balance',
            'Boosts mental well-being'
          ],
          testimonials: response.data.data.testimonials || [
            {
              name: 'John Doe',
              role: 'Professional Athlete',
              content: `This platform transformed my ${name} training. The personalized approach helped me achieve my goals faster than I ever imagined.`,
              rating: 5
            }
          ],
          faqs: response.data.data.faqs || [
            {
              question: `What equipment do I need for ${name}?`,
              answer: `The basic equipment needed for ${name} includes...`
            },
            {
              question: `How often should I practice ${name}?`,
              answer: `For beginners, we recommend practicing ${name} 2-3 times per week...`
            }
          ]
        };

        console.log('Enhanced game with image path:', enhancedGame.image);
        setGame(enhancedGame);
        setLoading(false);
        return;
      } catch (apiError) {
        console.log('API error:', apiError);
        // Continue to fallback
      }

      // If API fails, try to find the game in sportsData
      const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
      const foundGame = sportsData.find(sport =>
        sport._id === normalizedName ||
        sport.name.toLowerCase() === name.toLowerCase()
      );

      if (foundGame) {
        const enhancedGame = {
          ...foundGame,
          _id: foundGame._id || normalizedName, // Ensure _id exists
          image: getGameImagePath(foundGame, name),
          benefits: [
            'Improves cardiovascular health',
            'Builds muscle strength',
            'Enhances coordination and balance',
            'Boosts mental well-being'
          ],
          testimonials: [
            {
              name: 'John Doe',
              role: 'Professional Athlete',
              content: `This platform transformed my ${name} training. The personalized approach helped me achieve my goals faster than I ever imagined.`,
              rating: 5
            }
          ],
          faqs: [
            {
              question: `What equipment do I need for ${name}?`,
              answer: `The basic equipment needed for ${name} includes...`
            },
            {
              question: `How often should I practice ${name}?`,
              answer: `For beginners, we recommend practicing ${name} 2-3 times per week...`
            }
          ]
        };

        console.log('Using fallback game with image path:', enhancedGame.image);
        setGame(enhancedGame);
      } else {
        setError('Game not found');
      }

      setLoading(false);
    };

    fetchGame();
  }, [name]);






  const handleSessionFormChange = (e) => {
    setSessionForm({ ...sessionForm, [e.target.name]: e.target.value });
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Include user ID with the form data
      const sessionData = {
        ...sessionForm,
        userId: user._id,
        gameId: game._id
      };

      // Debug information
      console.log('Booking session for game:', game);
      console.log('Game ID being used:', game._id);
      console.log('Game name:', game.name);

      // Always use the game ID for booking as it's the most reliable identifier
      // The backend has been updated to handle ObjectId lookups properly
      const gameIdentifier = game._id;
      console.log('Using game ObjectId for booking:', gameIdentifier);

      const endpoint = `/games/${gameIdentifier}/session`;
      console.log('Making request to (via api.post):', endpoint);

      const response = await api.post(endpoint, sessionData);

      // Show success message
      setSnackbarMessage('Your session has been booked successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setBookingSuccess(true);

      // Reset form
      setSessionForm({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        date: '',
        time: '',
        duration: '',
        message: '',
      });
    } catch (err) {
      console.error('Error booking session:', err);

      // Try to extract error information from different error formats
      let errorMessage = 'Failed to book session';

      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.message) {
        console.error('Error message:', err.message);
        errorMessage = err.message;
      }

      // Show error message
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setError(errorMessage);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${game.name} on Viksora Sports`,
          text: game.description,
          url: window.location.href,
        });
        setShareSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err) {
        console.error('Error sharing:', err);
        // Fallback to copying URL to clipboard
        fallbackShare();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    setShareSuccess(true);
    // Reset success message after 3 seconds
    setTimeout(() => setShareSuccess(false), 3000);
  };



  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{ maxWidth: 'none', width: '95%' }}>
        <GameDetailSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{ maxWidth: 'none', width: '95%' }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/games')}
            startIcon={<ArrowBack />}
          >
            Back to Games
          </Button>
        </Box>
      </Container>
    );
  }

  if (!game) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{ maxWidth: 'none', width: '95%' }}>
        <Typography variant="h4">Game not found</Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/games')}
            startIcon={<ArrowBack />}
          >
            Back to Games
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} style={{ maxWidth: 'none', width: '95%' }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, animation: `${fadeIn} 0.5s ease-out` }}>
        <MuiLink component="button" underline="hover" color="inherit" onClick={() => navigate('/')}>
          Home
        </MuiLink>
        <MuiLink component="button" underline="hover" color="inherit" onClick={() => navigate('/games')}>
          Games
        </MuiLink>
        <Typography color="text.primary">{game.name}</Typography>
      </Breadcrumbs>

      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/games')}
        sx={{ mb: 3, animation: `${fadeIn} 0.5s ease-out` }}
      >
        Back to Games
      </Button>

      {/* Sport Image Header */}
      <Box sx={{
        mb: 4,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        height: { xs: '200px', sm: '300px', md: '400px' },
        animation: `${fadeIn} 0.8s ease-out`
      }}>
        {!gameImageLoaded && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ position: 'absolute', top: 0, left: 0 }}
          />
        )}
        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: gameImageLoaded ? 'block' : 'none',
            transition: 'transform 0.5s',
            '&:hover': {
              transform: 'scale(1.03)',
            }
          }}
          image={game.image}
          alt={game.name}
          onError={(e) => handleImageError(game, name, e)}
          onLoad={() => setGameImageLoaded(true)}
        />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
          p: 3,
          color: 'white'
        }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={700}
            sx={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              animation: `${slideIn} 0.8s ease-out 0.2s both`
            }}
          >
            {game.name}
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 1,
            animation: `${slideIn} 0.8s ease-out 0.3s both`
          }}>
            <Rating value={game.rating} precision={0.5} readOnly sx={{ color: 'white' }} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              ({game.rating} out of 5)
            </Typography>
          </Box>
        </Box>
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1,
          animation: `${fadeIn} 0.8s ease-out 0.4s both`
        }}>
          <IconButton
            sx={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
            onClick={handleFavoriteToggle}
          >
            <Favorite color={favorite ? "error" : "inherit"} />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              }
            }}
          >
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Game Info Section */}
      <Box sx={{ mb: 4, animation: `${fadeIn} 0.8s ease-out 0.2s both` }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              About {game.name}
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {game.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {game.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  variant="outlined"
                  icon={<LocalOffer fontSize="small" />}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Benefits
              </Typography>
              <List dense>
                {game.benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0.5, animation: `${slideIn} 0.5s ease-out ${index * 0.1}s both` }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24 }}>
                        <CheckCircle sx={{ fontSize: 16 }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* YouTube Video Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <PlayCircle sx={{ mr: 1, color: theme.palette.error.main }} />
                Introduction Video
              </Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2, boxShadow: 2 }}>
                <iframe
                  src="https://www.youtube-nocookie.com/embed/ZFcrgPv119o?autoplay=0&modestbranding=1&rel=0&t=10s"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
              </Box>
            </Box>

            {/* Action Buttons Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
                What would you like to do?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant={activeSection === 'session' ? 'contained' : 'outlined'}
                    onClick={() => setActiveSection('session')}
                    startIcon={<Person />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      boxShadow: activeSection === 'session' ? 3 : 1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Book One-on-One Session
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant={activeSection === 'equipment' ? 'contained' : 'outlined'}
                    onClick={() => setActiveSection('equipment')}
                    startIcon={<Sports />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      boxShadow: activeSection === 'equipment' ? 3 : 1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Equipment
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant={activeSection === 'updates' ? 'contained' : 'outlined'}
                    onClick={() => setActiveSection('updates')}
                    startIcon={<EventNote />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      boxShadow: activeSection === 'updates' ? 3 : 1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Updates
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/store')}
                    startIcon={<Sports />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      boxShadow: 1,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Go to Store
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Dynamic Content Section */}
            {activeSection && (
              <Fade in={true} timeout={500}>
                <Paper
                  sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 3,
                    boxShadow: 3,
                    border: `2px solid ${theme.palette.primary.main}`,
                    animation: `${fadeIn} 0.5s ease-out`
                  }}
                >
                  {/* Session Booking Section */}
                  {activeSection === 'session' && (
                    <Box>
                      <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
                        📅 Book Your One-on-One Session
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Get personalized training tailored to your skill level and goals with our expert coaches.
                      </Typography>

                      {!isAuthenticated ? (
                        <Alert severity="info" sx={{ mb: 3 }}>
                          Please <Button component="a" href="/login" sx={{ textDecoration: 'underline' }}>log in</Button> to book a session.
                        </Alert>
                      ) : (
                        <form onSubmit={handleSessionSubmit}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={sessionForm.name}
                                onChange={handleSessionFormChange}
                                required
                                placeholder="Enter your full name"
                                InputProps={{
                                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                sx={{
                                  '& .MuiInputBase-input::placeholder': {
                                    fontSize: '1.2rem',
                                    opacity: 1,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: '2px',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                name="email"
                                value={sessionForm.email}
                                onChange={handleSessionFormChange}
                                required
                                placeholder="Enter your email address"
                                InputProps={{
                                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                sx={{
                                  '& .MuiInputBase-input::placeholder': {
                                    fontSize: '1.2rem',
                                    opacity: 1,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: '2px',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={sessionForm.phone}
                                onChange={handleSessionFormChange}
                                required
                                placeholder="Enter your phone number"
                                InputProps={{
                                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                sx={{
                                  '& .MuiInputBase-input::placeholder': {
                                    fontSize: '1.2rem',
                                    opacity: 1,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: '2px',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Age"
                                name="age"
                                type="number"
                                inputProps={{ min: 5, max: 100 }}
                                value={sessionForm.age}
                                onChange={handleSessionFormChange}
                                required
                                placeholder="Enter your age"
                                InputProps={{
                                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                                sx={{
                                  '& .MuiInputBase-input::placeholder': {
                                    fontSize: '1.2rem',
                                    opacity: 1,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: '2px',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth required>
                                <InputLabel sx={{ fontSize: '1.2rem' }}>Gender</InputLabel>
                                <Select
                                  name="gender"
                                  value={sessionForm.gender}
                                  onChange={handleSessionFormChange}
                                >
                                  <MenuItem value="Male">Male</MenuItem>
                                  <MenuItem value="Female">Female</MenuItem>
                                  <MenuItem value="Other">Other</MenuItem>
                                  <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Preferred Date"
                                type="date"
                                name="date"
                                value={sessionForm.date}
                                onChange={handleSessionFormChange}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                required
                                InputProps={{
                                  startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Preferred Time"
                                type="time"
                                name="time"
                                value={sessionForm.time}
                                onChange={handleSessionFormChange}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                required
                                InputProps={{
                                  startAdornment: <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth required>
                                <InputLabel sx={{ fontSize: '1.2rem' }}>Session Duration</InputLabel>
                                <Select
                                  name="duration"
                                  value={sessionForm.duration}
                                  onChange={handleSessionFormChange}
                                >
                                  <MenuItem value="30">30 minutes - ₹500</MenuItem>
                                  <MenuItem value="60">1 hour - ₹900</MenuItem>
                                  <MenuItem value="90">1.5 hours - ₹1300</MenuItem>
                                  <MenuItem value="120">2 hours - ₹1600</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Additional Notes"
                                multiline
                                rows={4}
                                name="message"
                                value={sessionForm.message}
                                onChange={handleSessionFormChange}
                                placeholder="Tell us about your goals, experience level, or any specific requirements..."
                                sx={{
                                  '& .MuiInputBase-input::placeholder': {
                                    fontSize: '1.2rem',
                                    opacity: 1,
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: '2px',
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                  variant="outlined"
                                  onClick={() => setActiveSection(null)}
                                  sx={{ minWidth: 120 }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  size="large"
                                  sx={{
                                    minWidth: 200,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2
                                  }}
                                >
                                  Book Session Now
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </form>
                      )}
                    </Box>
                  )}

                  {/* Equipment Section */}
                  {activeSection === 'equipment' && (
                    <Box>
                      <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
                        🏏 Equipment & Gear
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Find the best equipment and gear for your {game.name} journey.
                      </Typography>

                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>🛍️</Typography>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Explore Our Equipment Store
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                          Discover a wide range of {game.name} equipment, from beginner-friendly gear to professional-grade equipment.
                        </Typography>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => navigate('/store')}
                          sx={{
                            px: 6,
                            py: 2,
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            borderRadius: 3,
                            boxShadow: 3,
                            '&:hover': {
                              boxShadow: 6,
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Go to Store
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {/* Updates Section */}
                  {activeSection === 'updates' && (
                    <Box>
                      <Typography variant="h5" gutterBottom fontWeight={600} color="primary">
                        📰 Live Sports Updates
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Real-time updates from official Indian and international sports organizations.
                      </Typography>

                      {/* Data Sources Information */}
                      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          🇮🇳 Primary Sources - Indian Official Sports Organizations:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          BCCI (Cricket) • AIFF (Football) • BAI (Badminton) • Hockey India • AFI (Athletics) •
                          AITA (Tennis) • BFI (Basketball) • WFI (Wrestling) • Boxing Federation of India
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                          🌍 Secondary Sources - International Official Organizations:
                        </Typography>
                        <Typography variant="body2">
                          ICC • FIFA • BWF • ATP/WTA • World Athletics • IOC • And other official sports federations
                        </Typography>
                      </Paper>

                      {/* Live Updates Feed */}
                      <ScrollingSportsUpdates
                        gameName={game.name}
                        height={500}
                        speed={60}
                        showHeader={false}
                        maxUpdates={20}
                      />

                      <Alert severity="info" sx={{ mt: 3 }}>
                        <Typography variant="body2">
                          <strong>🔄 Real-Time Updates:</strong> Our system automatically fetches the latest news
                          from official sports websites every 5 minutes. Click on any update to visit the original source.
                        </Typography>
                      </Alert>

                      {/* Manual Refresh Button */}
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={() => window.location.reload()}
                          sx={{ borderRadius: 3 }}
                        >
                          🔄 Refresh Updates
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Fade>
            )}

          </Grid>
        </Grid>
      </Box>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default GameDetail;
