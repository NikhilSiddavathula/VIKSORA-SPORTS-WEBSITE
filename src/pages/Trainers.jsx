// client/src/pages/Trainers.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector for role checking
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Rating,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Badge,
  Divider,
  Tooltip,
  Zoom,
  Fade,
  Grow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  PersonAdd,
  Search,
  LocationOn,
  Star,
  Verified,
  Language,
  FitnessCenter,
  EventAvailable,
  Payment,
  ExpandMore,
  CheckCircle,
  SportsCricket,
  SportsSoccer,
  SelfImprovement,
  SportsTennis,
  SportsVolleyball,
  Pool,
  Refresh,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api'; // Import the API service

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: 'white',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
    animation: `${pulse} 8s infinite linear`,
  },
}));
const TrainerCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: 12,
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  },
  animation: `${fadeIn} 0.8s ease-out`,
}));
const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  borderRadius: 16,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  animation: `${fadeIn} 0.8s ease-out`,
}));


const Trainers = () => {
  const [tabValue, setTabValue] = useState(0);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    certification: '',
    location: '',
    bio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [existingApplication, setExistingApplication] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [expandedTrainer, setExpandedTrainer] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const userRole = useSelector((state) => state.auth.user?.role);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trainers from API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/trainers');
        if (response.data && response.data.success) {
          setTrainers(response.data.data);
        } else {
          setError('Failed to fetch trainers');
        }
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError('Failed to load trainers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Memoize filter function to prevent unnecessary re-renders
  const filterTrainers = useCallback(() => {
    let result = trainers;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(trainer => 
        trainer.name.toLowerCase().includes(term) || 
        trainer.specialization.toLowerCase().includes(term) ||
        trainer.location.toLowerCase().includes(term)
      );
    }
    
    if (specializationFilter !== 'all') {
      result = result.filter(trainer => 
        trainer.specialization.toLowerCase().includes(specializationFilter.toLowerCase())
      );
    }
    
    if (locationFilter !== 'all') {
      result = result.filter(trainer => 
        trainer.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    return result;
  }, [searchTerm, specializationFilter, locationFilter, trainers]);

  // Update filtered trainers when filters change
  useEffect(() => {
    setFilteredTrainers(filterTrainers());
  }, [filterTrainers]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!applicationForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!applicationForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(applicationForm.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!applicationForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(applicationForm.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!applicationForm.specialization) {
      errors.specialization = 'Specialization is required';
    }
    
    if (!applicationForm.experience.trim()) {
      errors.experience = 'Experience is required';
    }
    
    if (!applicationForm.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!applicationForm.bio.trim()) {
      errors.bio = 'Bio is required';
    }
    
    return errors;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({
      ...applicationForm,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Check for existing application
  const checkExistingApplication = async () => {
    if (!isAuthenticated) {
      setExistingApplication(null);
      return;
    }

    setCheckingApplication(true);
    try {
      console.log('Checking for existing trainer application...');
      const response = await api.get('/api/trainers/my-application');
      
      if (response.data && response.data.success && response.data.data) {
        console.log('Found existing application:', response.data.data);
        setExistingApplication(response.data.data);
        toast.info(`You have an existing ${response.data.data.status} trainer application.`);
      } else {
        console.log('No existing application found');
        setExistingApplication(null);
      }
    } catch (error) {
      // 404 is normal when no application exists
      if (error.message.includes('not found') || error.message.includes('404')) {
        console.log('No existing application found (404)');
        setExistingApplication(null);
      } else {
        console.log('Error checking for existing application:', error.message);
        setExistingApplication(null);
      }
      // Don't show error toast for this as it's normal to not have an application
    } finally {
      setCheckingApplication(false);
    }
  };

  // Check for existing application when auth status changes
  useEffect(() => {
    if (isAuthenticated && tabValue === 1) { // Only check when on "Become a Trainer" tab
      checkExistingApplication();
    }
  }, [isAuthenticated, tabValue]);

  // Also check immediately when component mounts if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to ensure state is properly set
      const timer = setTimeout(() => {
        if (tabValue === 1) {
          checkExistingApplication();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Check when user switches to trainer tab
  useEffect(() => {
    if (tabValue === 1 && isAuthenticated && !existingApplication && !checkingApplication) {
      checkExistingApplication();
    }
  }, [tabValue]);

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to apply as a trainer');
      return;
    }
    
    // Always check for existing application before submitting
    if (!checkingApplication && !existingApplication) {
      await checkExistingApplication();
      // After checking, check again if there's an existing application
      if (existingApplication && existingApplication.status === 'pending') {
        // Use toast with warning-style appearance (orange background)
        if (typeof toast === 'function') {
          toast('⚠️ You already have a pending trainer application. Please wait for it to be reviewed.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: '#ff9800',
              color: '#fff',
              fontWeight: 'bold',
            },
            icon: '📋',
          });
        } else {
          // Fallback in case toast is not properly loaded
          console.warn('Toast function not available, showing alert instead');
          alert('⚠️ You already have a pending trainer application. Please wait for it to be reviewed.');
        }
        return;
      }
    }

    // Check if user already has a pending application
    if (existingApplication && existingApplication.status === 'pending') {
      // Use toast with warning-style appearance (orange background)
      if (typeof toast === 'function') {
        toast('⚠️ You already have a pending trainer application. Please wait for it to be reviewed.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#ff9800',
            color: '#fff',
            fontWeight: 'bold',
          },
          icon: '📋',
        });
      } else {
        // Fallback in case toast is not properly loaded
        console.warn('Toast function not available, showing alert instead');
        alert('⚠️ You already have a pending trainer application. Please wait for it to be reviewed.');
      }
      return;
    }
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      console.log('Submitting trainer application...');
      console.log('Current auth status:', isAuthenticated);
      console.log('Current user:', user);
      
      // Prepare application data with proper field mapping
      const applicationData = {
        // Map frontend fields to backend expectations
        game: applicationForm.specialization,           // backend expects 'game'
        qualifications: applicationForm.certification,  // backend expects 'qualifications'
        experience: applicationForm.experience,
        location: applicationForm.location,
        bio: applicationForm.bio,
        // Include additional fields that frontend collects
        name: applicationForm.name,
        email: applicationForm.email,
        phone: applicationForm.phone,
      };
      
      console.log('Application data being sent:', applicationData);
      
      const response = await api.post('/api/trainers/apply', applicationData);
      
      console.log('Server response:', response);
      
      // Check for success in the response
      if (response.data && response.data.success) {
        toast.success('✅ Application submitted successfully! Our team will review your application and reach out to you within 5-6 working days. Thank you for your interest in joining our team of professional trainers!');
        setSubmitSuccess(true);
        setApplicationForm({
          name: '',
          email: '',
          phone: '',
          specialization: '',
          experience: '',
          certification: '',
          location: '',
          bio: '',
        });
        setFormErrors({});
      } else {
        const errorMessage = response.data?.message || response.message || 'Failed to submit application';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting trainer application:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data || error.data
      });
      
      let errorMessage = 'An error occurred while submitting your application. Please try again.';
      
      if (error.message.includes('Not authorized')) {
        errorMessage = 'Authentication failed. Please login again and try submitting your application.';
        // Clear auth state if token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.message.includes('already have') || error.message.includes('pending application')) {
        errorMessage = error.message;
        // Refresh the existing application status immediately
        checkExistingApplication();
        // Prevent form submission
        return;
        
        // Use toast with warning-style appearance (orange background)
        if (typeof toast === 'function') {
          toast('⚠️ You already have a trainer application. Check your application status below.', {
            duration: 6000,
            position: 'top-center',
            style: {
              background: '#ff9800',
              color: '#fff',
              fontWeight: 'bold',
            },
            icon: '📋',
          });
        } else {
          // Fallback in case toast is not properly loaded
          console.warn('Toast function not available, showing alert instead');
          alert('⚠️ You already have a trainer application. Check your application status below.');
        }
        
        // Don't show the error in setSubmitError since we're showing it in toast
        setSubmitError('');
        return; // Exit early to avoid showing duplicate error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.data?.success === false && error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccordionChange = (trainerId) => {
    setExpandedTrainer(expandedTrainer === trainerId ? null : trainerId);
  };

  const getSportIcon = (specialization) => {
    switch(specialization.toLowerCase()) {
      case 'cricket': return <SportsCricket />;
      case 'football': return <SportsSoccer />;
      case 'yoga': return <SelfImprovement />;
      case 'tennis': return <SportsTennis />;
      case 'badminton': return <SportsVolleyball />;
      case 'swimming': return <Pool />;
      default: return <FitnessCenter />;
    }
  };

  // Memoize static data to prevent unnecessary re-renders
  const specializations = useMemo(() => [
    'all', 'Cricket', 'Yoga', 'Football', 'Badminton', 'Tennis', 'Swimming'
  ], []);
  const locations = useMemo(() => [
    'all', 'Mumbai', 'Rishikesh', 'Bangalore', 'Ahmedabad', 'Chennai', 'Pune'
  ], []);
  const benefits = useMemo(() => [
    { 
      title: 'Competitive Earnings', 
      icon: '💰', 
      description: 'Earn top rates for your training sessions and courses' 
    },
    { 
      title: 'Flexible Schedule', 
      icon: '🎯', 
      description: 'Set your own schedule and work when convenient' 
    },
    { 
      title: 'Brand Building', 
      icon: '📈', 
      description: 'Build your personal brand and expand client base' 
    },
    { 
      title: 'National Recognition', 
      icon: '🏆', 
      description: 'Get featured on our platform and social media' 
    }
  ], []);
  const requirements = useMemo(() => [
    'Certification from recognized sports authority',
    'Minimum 3 years of coaching experience',
    'Valid ID proof and address proof',
    'First aid and CPR certification',
    'Good communication skills in at least two languages',
    'Passion for teaching and mentoring athletes'
  ], []);
  const categories = useMemo(() => [
    { name: 'Cricket Coaches', icon: '🏏', count: 45 },
    { name: 'Football Coaches', icon: '⚽', count: 32 },
    { name: 'Yoga Instructors', icon: '🧘‍♀️', count: 28 },
    { name: 'Tennis Coaches', icon: '🎾', count: 19 },
    { name: 'Badminton Coaches', icon: '🏸', count: 24 },
    { name: 'Swimming Coaches', icon: '🏊‍♂️', count: 17 }
  ], []);

  // Reset form success state after 5 seconds
  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [submitSuccess]);

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Elite Trainers Hub
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Connect with India's top sports trainers or join our elite trainer community
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 1.5, fontWeight: 'bold', borderRadius: 30 }}
            onClick={() => setTabValue(0)}
          >
            Get Started
          </Button>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Tabs */}
        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label="Find Trainers" icon={<Search />} iconPosition="start" sx={{ fontWeight: 'bold' }} />
            <Tab label="Become a Trainer" icon={<PersonAdd />} iconPosition="start" sx={{ fontWeight: 'bold' }} />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {/* Find Trainers Tab */}
            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  Find Your Perfect Trainer
                </Typography>
                
                {/* Search and Filter Section */}
                <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Search trainers..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <Search color="action" sx={{ mr: 1 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Specialization</InputLabel>
                        <Select
                          value={specializationFilter}
                          onChange={(e) => setSpecializationFilter(e.target.value)}
                          label="Specialization"
                        >
                          {specializations.map((spec) => (
                            <MenuItem key={spec} value={spec}>
                              {spec === 'all' ? 'All Specializations' : spec}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Location</InputLabel>
                        <Select
                          value={locationFilter}
                          onChange={(e) => setLocationFilter(e.target.value)}
                          label="Location"
                        >
                          {locations.map((loc) => (
                            <MenuItem key={loc} value={loc}>
                              {loc === 'all' ? 'All Locations' : loc}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => {
                          setSearchTerm('');
                          setSpecializationFilter('all');
                          setLocationFilter('all');
                        }}
                        sx={{ height: '56px' }}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Admin Trainer Management Section */}
                {user && user.role === 'admin' && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Manage Trainers
                    </Typography>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Use the admin panel to manage trainers, applications, and user accounts.
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => window.location.href = '/admin'}
                        sx={{ mr: 2 }}
                      >
                        Go to Admin Panel
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => window.location.href = '/admin/trainers'}
                      >
                        Manage Trainers
                      </Button>
                    </Paper>
                  </Box>
                )}

                {/* Trainers Grid - More compact layout */}
                {filteredTrainers.length > 0 ? (
                  <Grid container spacing={2}>
                    {filteredTrainers.map((trainer, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={trainer.id}>
                        <Zoom in={true} timeout={300 + index * 100}>
                          <TrainerCard elevation={2}>
                            <Box sx={{ position: 'relative', p: 1.5, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                              <Avatar
                                src={trainer.image}
                                sx={{ 
                                  width: 70, 
                                  height: 70, 
                                  mx: 'auto', 
                                  mb: 0.5,
                                  border: `3px solid white`,
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                              />
                              {trainer.verified && (
                                <Tooltip title="Verified Trainer">
                                  <IconButton 
                                    sx={{ 
                                      position: 'absolute', 
                                      top: 8, 
                                      right: 8,
                                      backgroundColor: 'white',
                                      color: 'primary.main',
                                      '&:hover': { backgroundColor: 'grey.100' },
                                      width: 28,
                                      height: 28
                                    }}
                                  >
                                    <Verified fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Typography variant="h6" gutterBottom fontWeight="bold" noWrap>
                                {trainer.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                {getSportIcon(trainer.specialization)}
                                <Chip
                                  label={trainer.specialization}
                                  color="secondary"
                                  size="small"
                                  sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                                />
                              </Box>
                            </Box>
                            <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                                <Rating value={trainer.rating} readOnly size="small" precision={0.1} />
                                <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold', fontSize: '0.8rem' }}>
                                  {trainer.rating}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }} noWrap>
                                  {trainer.location.split(',')[0]}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                                <FitnessCenter fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                                  {trainer.experience}
                                </Typography>
                              </Box>
                              
                              <Typography variant="h6" color="primary" textAlign="center" sx={{ mb: 1, fontWeight: 'bold', fontSize: '1rem' }}>
                                {trainer.price}
                              </Typography>
                              
                              <Accordion expanded={expandedTrainer === trainer.id} onChange={() => handleAccordionChange(trainer.id)} sx={{ mb: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 40, height: 40 }}>
                                  <Typography variant="body2" fontWeight="bold" fontSize="0.8rem">View Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                                    {trainer.bio}
                                  </Typography>
                                  
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom fontSize="0.8rem">
                                      Specialties:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {trainer.specialties.map((specialty, idx) => (
                                        <Chip key={idx} label={specialty} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                      ))}
                                    </Box>
                                  </Box>
                                  
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom fontSize="0.8rem">
                                      Languages:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <Language fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                        {trainer.languages.join(', ')}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom fontSize="0.8rem">
                                      Availability:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <EventAvailable fontSize="small" color="action" />
                                      <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                                        {trainer.availability}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </AccordionDetails>
                              </Accordion>
                              
                              <Button variant="contained" fullWidth sx={{ borderRadius: 20, fontWeight: 'bold', py: 0.5, fontSize: '0.8rem' }}>
                                Book Session
                              </Button>
                            </CardContent>
                          </TrainerCard>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No trainers found matching your criteria
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Try adjusting your filters or search terms
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="large"
                      onClick={() => {
                        setSearchTerm('');
                        setSpecializationFilter('all');
                        setLocationFilter('all');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </Box>
                )}

                {/* Trainer Categories Preview */}
                <Box sx={{ mt: 8 }}>
                  <Typography variant="h5" gutterBottom textAlign="center">
                    Available Trainer Categories
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    {categories.map((category, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Grow in={true} timeout={600 + index * 150}>
                          <FeatureCard elevation={2}>
                            <Typography variant="h3" gutterBottom>
                              {category.icon}
                            </Typography>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              {category.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {category.count} trainers available
                            </Typography>
                          </FeatureCard>
                        </Grow>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}

            {/* Become a Trainer Tab */}
            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom textAlign="center">
                  Apply to Become a Trainer
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
                  Join our community of professional trainers and help others achieve their fitness goals.
                </Typography>
                
                {/* Benefits Section */}
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" gutterBottom textAlign="center">
                    Why Join VIKSORASPORTS as a Trainer?
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 3 }}>
                    {benefits.map((benefit, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Grow in={true} timeout={500 + index * 200}>
                          <FeatureCard elevation={2}>
                            <Typography variant="h3" color="primary.main" gutterBottom>
                              {benefit.icon}
                            </Typography>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                              {benefit.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {benefit.description}
                            </Typography>
                          </FeatureCard>
                        </Grow>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Requirements Section */}
                <Box sx={{ mb: 6 }}>
                  <Typography variant="h5" gutterBottom textAlign="center">
                    Trainer Requirements
                  </Typography>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      {requirements.map((req, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircle color="success" sx={{ mr: 1 }} />
                            <Typography variant="body2">{req}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>

                {!isAuthenticated && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please <Button href="/login">login</Button> to submit your trainer application.
                  </Alert>
                )}

                {checkingApplication && (
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} />
                      Checking for existing application...
                    </Box>
                  </Alert>
                )}

                {existingApplication && (
                  <Alert 
                    severity={existingApplication.status === 'approved' ? 'success' : 
                             existingApplication.status === 'rejected' ? 'error' : 'warning'} 
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      📋 Your Trainer Application Status
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2"><strong>Status:</strong> {existingApplication.status.toUpperCase()}</Typography>
                        <Typography variant="body2"><strong>Game:</strong> {existingApplication.game}</Typography>
                        <Typography variant="body2"><strong>Experience:</strong> {existingApplication.experience}</Typography>
                        <Typography variant="body2"><strong>Location:</strong> {existingApplication.location}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Applied:</strong> {new Date(existingApplication.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {existingApplication.status === 'pending' && '⏳ Your application is under review. We will contact you soon!'}
                          {existingApplication.status === 'approved' && '🎉 Congratulations! Your application has been approved.'}
                          {existingApplication.status === 'rejected' && '❌ Your application was not approved this time. You may apply again in the future.'}
                        </Typography>
                      </Grid>
                    </Grid>
                    {existingApplication.status === 'pending' && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                          ⚠️ Important: You cannot submit a new application while your current one is pending.
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: 'warning.dark' }}>
                          The form below is disabled until your current application is reviewed. This prevents duplicate applications and ensures faster processing.
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        onClick={checkExistingApplication}
                        disabled={checkingApplication}
                        startIcon={checkingApplication ? <CircularProgress size={16} /> : <Refresh />}
                      >
                        {checkingApplication ? 'Checking...' : 'Refresh Status'}
                      </Button>
                    </Box>
                  </Alert>
                )}

                {submitSuccess && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Your application has been submitted successfully! Our team will review it and get back to you soon.
                  </Alert>
                )}

                {submitError && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {submitError}
                  </Alert>
                )}

                <form onSubmit={handleApplicationSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={applicationForm.name}
                        onChange={handleFormChange}
                        required
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={applicationForm.email}
                        onChange={handleFormChange}
                        required
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={applicationForm.phone}
                        onChange={handleFormChange}
                        required
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required error={!!formErrors.specialization}>
                        <InputLabel>Specialization</InputLabel>
                        <Select
                          name="specialization"
                          value={applicationForm.specialization}
                          onChange={handleFormChange}
                          label="Specialization"
                        >
                          <MenuItem value="cricket">Cricket</MenuItem>
                          <MenuItem value="football">Football</MenuItem>
                          <MenuItem value="tennis">Tennis</MenuItem>
                          <MenuItem value="badminton">Badminton</MenuItem>
                          <MenuItem value="swimming">Swimming</MenuItem>
                          <MenuItem value="yoga">Yoga</MenuItem>
                          <MenuItem value="fitness">Fitness Training</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                        {formErrors.specialization && (
                          <Typography variant="caption" color="error">
                            {formErrors.specialization}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Years of Experience"
                        name="experience"
                        value={applicationForm.experience}
                        onChange={handleFormChange}
                        required
                        error={!!formErrors.experience}
                        helperText={formErrors.experience}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Certifications"
                        name="certification"
                        value={applicationForm.certification}
                        onChange={handleFormChange}
                        placeholder="List your relevant certifications"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={applicationForm.location}
                        onChange={handleFormChange}
                        required
                        error={!!formErrors.location}
                        helperText={formErrors.location}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        multiline
                        rows={4}
                        value={applicationForm.bio}
                        onChange={handleFormChange}
                        placeholder="Tell us about yourself, your training philosophy, and what makes you unique..."
                        required
                        error={!!formErrors.bio}
                        helperText={formErrors.bio}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={!isAuthenticated || isSubmitting || checkingApplication || (existingApplication && existingApplication.status === 'pending')}
                        sx={{ mt: 2, borderRadius: 30, fontWeight: 'bold' }}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                      >
                        {isSubmitting ? 'Submitting...' : 
                         (existingApplication && existingApplication.status === 'pending') ? 'Application Already Submitted' :
                         'Submit Application'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Trainers;