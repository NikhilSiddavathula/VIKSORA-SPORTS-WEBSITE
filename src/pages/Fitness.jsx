// client/src/pages/Fitness.jsx
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
  Chip,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  Divider,
  useTheme,
  keyframes,
  styled,
  Paper,
  IconButton,
  Badge,
  Fab,
  useMediaQuery,
  InputBase,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardActionArea
} from '@mui/material';
import { 
  FitnessCenter, 
  Timer, 
  TrendingUp, 
  Schedule, 
  Star, 
  ExpandMore, 
  Favorite,
  ArrowForward,
  PlayArrow,
  Add,
  Person,
  CalendarToday,
  LocalFireDepartment,
  Speed,
  DirectionsRun,
  SelfImprovement,
  SportsGymnastics,
  AccessTime,
  EmojiEvents,
  FitnessCenter as FitnessIcon,
  Search,
  FilterList,
  Sort,
  Close,
  CheckCircle,
  LocalHospital,
  Restaurant
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
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

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: 'white',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1534438357320-7e644092b3d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.85), rgba(0, 150, 136, 0.85))',
    zIndex: -1,
  },
}));

const ProgramCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.5s, box-shadow 0.5s',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
    '& .program-overlay': {
      opacity: 1,
    },
    '& .program-content': {
      transform: 'translateY(0)',
    },
    '& .program-image': {
      transform: 'scale(1.05)',
    }
  },
  '& .program-overlay': {
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
  '& .program-content': {
    transform: 'translateY(10px)',
    transition: 'transform 0.3s',
    zIndex: 2,
  },
  '& .program-image': {
    transition: 'transform 0.5s ease',
  }
}));

const WorkoutCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  },
}));

const CategoryCard = styled(Paper)(({ theme }) => ({
  p: 3,
  textAlign: 'center',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.3s, box-shadow 0.3s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  p: 3,
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
  },
}));

const ProgressCard = styled(Card)(({ theme }) => ({
  p: 3,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  },
}));

const Fitness = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  // Sample fitness programs data
  const fitnessPrograms = [
    {
      id: 1,
      title: 'Weight Loss Transformation',
      description: 'A comprehensive 12-week program designed to help you lose weight sustainably and build healthy habits.',
      duration: '12 weeks',
      difficulty: 'Intermediate',
      category: 'weight-loss',
      rating: 4.8,
      participants: 2450,
      image: 'https://images.unsplash.com/photo-1534438357320-7e644092b3d3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: [
        'Personalized meal plans',
        'Weekly check-ins',
        'Progress tracking',
        'Community support'
      ],
      instructor: 'Sarah Johnson',
      price: 89.99,
      isNew: true,
      isPopular: true
    },
    {
      id: 2,
      title: 'Muscle Building Pro',
      description: 'Build lean muscle and increase strength with this 16-week program for intermediate to advanced lifters.',
      duration: '16 weeks',
      difficulty: 'Advanced',
      category: 'muscle-building',
      rating: 4.9,
      participants: 1876,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: [
        'Progressive overload',
        'Nutrition guidance',
        'Supplement recommendations',
        'Form correction videos'
      ],
      instructor: 'Mike Peterson',
      price: 99.99,
      isPopular: true
    },
    {
      id: 3,
      title: 'Flexibility & Mobility',
      description: 'Improve your flexibility, joint mobility, and reduce the risk of injury with this 8-week program.',
      duration: '8 weeks',
      difficulty: 'Beginner',
      category: 'flexibility',
      rating: 4.7,
      participants: 1324,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: [
        'Daily stretching routines',
        'Mobility exercises',
        'Recovery techniques',
        'Posture improvement'
      ],
      instructor: 'Emma Wilson',
      price: 69.99
    },
    {
      id: 4,
      title: 'Cardio Blast',
      description: 'Boost your cardiovascular endurance and burn calories with this high-intensity 6-week program.',
      duration: '6 weeks',
      difficulty: 'Intermediate',
      category: 'cardio',
      rating: 4.6,
      participants: 2103,
      image: 'https://images.unsplash.com/photo-1518611011118-3698db1f3e9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      features: [
        'HIIT workouts',
        'Endurance building',
        'Heart rate tracking',
        'Calorie burn tracking'
      ],
      instructor: 'Alex Rodriguez',
      price: 79.99,
      isNew: true
    }
  ];
  
  // Sample workout plans
  const workoutPlans = [
    {
      id: 1,
      title: 'Beginner Full Body',
      description: 'A balanced full-body workout perfect for beginners to build a foundation of strength.',
      duration: '45 minutes',
      difficulty: 'Beginner',
      exercises: 8,
      category: 'full-body',
      equipment: 'Minimal',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      calories: 320
    },
    {
      id: 2,
      title: 'Advanced HIIT',
      description: 'High-intensity interval training to push your limits and maximize calorie burn.',
      duration: '30 minutes',
      difficulty: 'Advanced',
      exercises: 10,
      category: 'hiit',
      equipment: 'None',
      image: 'https://images.unsplash.com/photo-1518611011118-3698db1f3e9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      calories: 450
    },
    {
      id: 3,
      title: 'Upper Body Strength',
      description: 'Targeted workout to build strength and muscle in your chest, back, shoulders, and arms.',
      duration: '60 minutes',
      difficulty: 'Intermediate',
      exercises: 9,
      category: 'upper-body',
      equipment: 'Weights',
      image: 'https://images.unsplash.com/photo-1534438357320-7e644092b3d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      calories: 380
    },
    {
      id: 4,
      title: 'Core & Abs',
      description: 'Focused workout to strengthen your core and define your abdominal muscles.',
      duration: '30 minutes',
      difficulty: 'Intermediate',
      exercises: 7,
      category: 'core',
      equipment: 'Minimal',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      calories: 280
    }
  ];
  
  // Sample fitness categories
  const categories = [
    { id: 'weight-loss', name: 'Weight Loss', icon: <TrendingUp /> },
    { id: 'muscle-building', name: 'Muscle Building', icon: <FitnessCenter /> },
    { id: 'flexibility', name: 'Flexibility', icon: <SelfImprovement /> },
    { id: 'cardio', name: 'Cardio', icon: <DirectionsRun /> },
    { id: 'strength', name: 'Strength', icon: <SportsGymnastics /> },
    { id: 'endurance', name: 'Endurance', icon: <Speed /> }
  ];

  // Sample progress tracking data
  const progressData = [
    {
      id: 1,
      title: 'Workout Streak',
      value: '12 days',
      icon: <LocalFireDepartment />,
      color: 'error',
      goal: '30 days'
    },
    {
      id: 2,
      title: 'Calories Burned',
      value: '3,450',
      icon: <LocalFireDepartment />,
      color: 'warning',
      goal: '5,000'
    },
    {
      id: 3,
      title: 'Workouts Completed',
      value: '18',
      icon: <FitnessCenter />,
      color: 'primary',
      goal: '25'
    },
    {
      id: 4,
      title: 'Active Minutes',
      value: '840',
      icon: <Timer />,
      color: 'info',
      goal: '1200'
    }
  ];
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProgram(null);
  };

  // Filter and sort programs
  const filteredPrograms = fitnessPrograms
    .filter(program => {
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           program.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || program.category === filter || 
                          (filter === 'new' && program.isNew) || 
                          (filter === 'popular' && program.isPopular);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.participants - a.participants;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <HeroSection>
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 'md' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              mb: 3,
              animation: `${fadeIn} 0.8s ease-out`
            }}
          >
            Transform Your Body, Transform Your Life
          </Typography>
          
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              animation: `${fadeIn} 0.8s ease-out 0.2s both`
            }}
          >
            Professional fitness programs designed by experts to help you achieve your health and wellness goals
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForward />}
              sx={{ 
                borderRadius: 30,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                animation: `${fadeIn} 0.8s ease-out 0.4s both`,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                }
              }}
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              sx={{ 
                borderRadius: 30,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                },
                animation: `${fadeIn} 0.8s ease-out 0.6s both`
              }}
            >
              Take Fitness Quiz
            </Button>
          </Box>
        </Box>
      </HeroSection>
      
      {/* Stats Section */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {[
            { value: '50+', label: 'Fitness Programs', icon: <FitnessCenter /> },
            { value: '10K+', label: 'Active Members', icon: <Person /> },
            { value: '98%', label: 'Success Rate', icon: <Star /> },
            { value: '24/7', label: 'Support', icon: <Schedule /> }
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <StatCard sx={{ animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both` }}>
                <Box 
                  sx={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    backgroundColor: `${theme.palette.primary.main}10`,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '2rem',
                    animation: `${pulse} 2s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" component="div" fontWeight={700} color="primary" sx={{ mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  {stat.label}
                </Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Programs Section */}
      <Box sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            fontWeight={700}
            sx={{ animation: `${fadeIn} 0.6s ease-out` }}
          >
            Featured Fitness Programs
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              animation: `${fadeIn} 0.6s ease-out 0.2s both`
            }}
          >
            Professionally designed programs to help you reach your fitness goals
          </Typography>
        </Box>
        
        {/* Search and Filter Controls */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 300 } }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={<Search sx={{ mr: 1, color: 'text.secondary' }} />}
              />
            </Paper>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                displayEmpty
                startAdornment={<FilterList sx={{ mr: 1 }} />}
              >
                <MenuItem value="all">All Programs</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="popular">Popular</MenuItem>
                <MenuItem value="weight-loss">Weight Loss</MenuItem>
                <MenuItem value="muscle-building">Muscle Building</MenuItem>
                <MenuItem value="flexibility">Flexibility</MenuItem>
                <MenuItem value="cardio">Cardio</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={<Sort sx={{ mr: 1 }} />}
            >
              <MenuItem value="popular">Most Popular</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Grid container spacing={4}>
          {filteredPrograms.map((program, index) => (
            <Grid item xs={12} md={6} lg={3} key={program.id}>
              <ProgramCard sx={{ animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both` }}>
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={program.image}
                    alt={program.title}
                    className="program-image"
                  />
                  <Box className="program-overlay">
                    <Fab 
                      color="secondary" 
                      aria-label="view program"
                      onClick={() => handleProgramClick(program)}
                      sx={{
                        animation: `${pulse} 1.5s infinite`
                      }}
                    >
                      <PlayArrow />
                    </Fab>
                  </Box>
                  
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <IconButton 
                      onClick={() => toggleFavorite(program.id)}
                      sx={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                    >
                      <Favorite color={favorites.includes(program.id) ? "error" : "inherit"} />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                    <Chip 
                      label={program.category} 
                      size="small"
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                    {program.isNew && (
                      <Chip 
                        label="NEW" 
                        size="small"
                        color="secondary"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                    {program.isPopular && (
                      <Chip 
                        label="POPULAR" 
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 'bold' }}
                      />
                    )}
                  </Box>
                </Box>
                
                <CardContent className="program-content" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h2" fontWeight={600}>
                      {program.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Star fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {program.rating}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {program.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timer fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {program.duration}
                      </Typography>
                    </Box>
                    <Chip 
                      label={program.difficulty} 
                      size="small"
                      color={program.difficulty === 'Beginner' ? 'success' : program.difficulty === 'Intermediate' ? 'info' : 'error'}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="secondary" fontWeight={600}>
                      ${program.price}
                    </Typography>
                    <Button
                      onClick={() => handleProgramClick(program)}
                      variant="contained"
                      size="small"
                      endIcon={<ArrowForward />}
                      sx={{ 
                        borderRadius: 30,
                        fontWeight: 600,
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </ProgramCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Workout Plans Section */}
      <Box sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            fontWeight={700}
            sx={{ animation: `${fadeIn} 0.6s ease-out` }}
          >
            Workout Plans
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              animation: `${fadeIn} 0.6s ease-out 0.2s both`
            }}
          >
            Structured workout routines for all fitness levels and goals
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {workoutPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={3} key={plan.id}>
              <WorkoutCard sx={{ animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both` }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={plan.image}
                    alt={plan.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" fontWeight={600}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {plan.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Timer fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {plan.duration}
                        </Typography>
                      </Box>
                      <Chip 
                        label={plan.difficulty} 
                        size="small"
                        color={plan.difficulty === 'Beginner' ? 'success' : plan.difficulty === 'Intermediate' ? 'info' : 'error'}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {plan.exercises} exercises
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalFireDepartment fontSize="small" color="error" sx={{ mr: 0.5 }} />
                        <Typography variant="body2">
                          {plan.calories} cal
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Equipment: {plan.equipment}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    endIcon={<PlayArrow />}
                    sx={{ 
                      borderRadius: 30,
                      fontWeight: 600,
                    }}
                  >
                    Start Workout
                  </Button>
                </Box>
              </WorkoutCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Categories Section */}
      <Box sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            fontWeight={700}
            sx={{ animation: `${fadeIn} 0.6s ease-out` }}
          >
            Fitness Categories
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              animation: `${fadeIn} 0.6s ease-out 0.2s both`
            }}
          >
            Explore our specialized fitness programs tailored to your specific goals
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <CategoryCard sx={{ animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both` }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    backgroundColor: `${theme.palette.primary.main}10`,
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '2.5rem',
                    animation: `${float} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.5}s`,
                  }}
                >
                  {category.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  {category.name}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderRadius: 30,
                    fontWeight: 600,
                  }}
                >
                  Explore
                </Button>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Progress Tracking Section */}
      <Box sx={{ mb: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            fontWeight={700}
            sx={{ animation: `${fadeIn} 0.6s ease-out` }}
          >
            Track Your Progress
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: '700px', 
              mx: 'auto',
              animation: `${fadeIn} 0.6s ease-out 0.2s both`
            }}
          >
            Monitor your fitness journey with our comprehensive tracking tools
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {progressData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <ProgressCard sx={{ animation: `${fadeIn} 0.6s ease-out ${index * 0.1}s both` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: '50%', 
                      backgroundColor: `${theme.palette[item.color].main}10`,
                      color: theme.palette[item.color].main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      fontSize: '1.75rem',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 0.5 }}>
                      {item.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Goal: {item.goal}
                  </Typography>
                  <Box sx={{ width: '100%', backgroundColor: 'grey.200', borderRadius: 5, height: 8, mt: 1 }}>
                    <Box 
                      sx={{ 
                        width: `${(parseInt(item.value) / parseInt(item.goal)) * 100}%`, 
                        backgroundColor: theme.palette[item.color].main, 
                        borderRadius: 5, 
                        height: '100%' 
                      }} 
                    />
                  </Box>
                </Box>
              </ProgressCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Program Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedProgram && (
          <>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="200"
                image={selectedProgram.image}
                alt={selectedProgram.title}
              />
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
            
            <DialogTitle>
              <Typography variant="h4" fontWeight={700}>
                {selectedProgram.title}
              </Typography>
            </DialogTitle>
            
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={selectedProgram.rating} readOnly precision={0.5} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  ({selectedProgram.participants} participants)
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedProgram.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip 
                  icon={<Timer />}
                  label={selectedProgram.duration}
                  color="primary"
                />
                <Chip 
                  label={selectedProgram.difficulty}
                  color={selectedProgram.difficulty === 'Beginner' ? 'success' : selectedProgram.difficulty === 'Intermediate' ? 'info' : 'error'}
                />
                <Chip 
                  label={`$${selectedProgram.price}`}
                  color="secondary"
                />
              </Box>
              
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Program Features:
              </Typography>
              <List>
                {selectedProgram.features.map((feature, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Instructor: {selectedProgram.instructor}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={`https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="body1">
                      Certified Personal Trainer
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      10+ years experience
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ borderRadius: 30 }}
              >
                Close
              </Button>
              <Button 
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{ borderRadius: 30 }}
              >
                Enroll Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Fitness;