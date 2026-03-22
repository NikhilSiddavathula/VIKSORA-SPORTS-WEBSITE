// client/src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Avatar, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Card, 
  CardContent, 
  Divider, 
  IconButton, 
  Badge, 
  Chip, 
  Alert,
  CircularProgress,
  useTheme,
  keyframes,
  styled,
  Skeleton,
  Tabs,
  Tab,
  LinearProgress,
  Stack,
  Fade,
  Slide,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  CameraAlt, 
  LocationOn, 
  Email, 
  Phone, 
  Sports, 
  EmojiEvents, 
  WorkHistory,
  CheckCircle,
  Person,
  Settings,
  Star,
  TrendingUp,
  PhotoCamera,
  Delete,
  Add,
  ExpandMore,
  Visibility,
  VisibilityOff,
  Security,
  Notifications,
  Language,
  Palette,
  AccountCircle,
  Timeline,
  CalendarToday,
  Group,
  School,
  Business
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

// Enhanced animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const glow = keyframes`
  from {
    box-shadow: 0 0 5px rgba(25, 118, 210, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(25, 118, 210, 0.8), 0 0 30px rgba(25, 118, 210, 0.6);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  borderRadius: theme.spacing(3),
  overflow: 'hidden',
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    border: `1px solid ${theme.palette.primary.light}`,
  },
  animation: `${fadeIn} 0.6s ease-out`,
  [theme.breakpoints.down('md')]: {
    '&:hover': {
      transform: 'none',
      boxShadow: theme.shadows[2],
    },
  },
}));

const ProfileContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2, 1),
  },
}));

const ProfileHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.1,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
    marginBottom: theme.spacing(3),
  },
}));

const EnhancedAvatar = styled(Avatar)(({ theme }) => ({
  width: 180,
  height: 180,
  border: `6px solid ${theme.palette.background.paper}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    animation: `${glow} 1.5s ease-in-out infinite alternate`,
  },
  [theme.breakpoints.down('md')]: {
    width: 120,
    height: 120,
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}));

const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2),
    fontSize: '0.9rem',
  },
}));

const TabContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

const InfoCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    borderColor: theme.palette.primary.light,
  },
}));

const FloatingActionButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  width: 60,
  height: 60,
  boxShadow: theme.shadows[8],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    animation: `${float} 2s ease-in-out infinite`,
  },
  [theme.breakpoints.down('md')]: {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    width: 50,
    height: 50,
  },
}));

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const { user, isAuthenticated, updateUser } = useAuth();
  
  // State management
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'player',
    experience: '',
    achievements: '',
    state: '',
    country: '',
    bio: '',
    website: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: '',
    preferredSports: [],
  });
  
  const [achievementList, setAchievementList] = useState([]);
  const [newAchievement, setNewAchievement] = useState('');
  const [profileStats, setProfileStats] = useState({
    totalSessions: 0,
    completedCourses: 0,
    achievements: 0,
    ranking: 'N/A'
  });
  
  const fileInputRef = useRef(null);

  // Load user data and stats
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'player',
        experience: user.experience || '',
        achievements: user.achievements || '',
        state: user.state || '',
        country: user.country || '',
        bio: user.bio || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        emergencyContact: user.emergencyContact || '',
        preferredSports: user.preferredSports || [],
      });
      
      if (user.achievements) {
        setAchievementList(user.achievements.split(',').filter(a => a.trim() !== ''));
      }
      
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
      
      // Load profile stats
      loadProfileStats();
    }
  }, [user]);

  const loadProfileStats = async () => {
    try {
      // Get real stats from user data or set to zero
      const stats = {
        totalSessions: user?.totalSessions || 0,
        completedCourses: user?.completedCourses || 0,
        achievements: achievementList.length,
        ranking: user?.ranking || 'Unranked'
      };
      setProfileStats(stats);
    } catch (error) {
      console.error('Error loading profile stats:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setImageLoading(true);
      try {
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        
        // Note: Image upload to server would be implemented here
        // For now, just show preview
      } catch (error) {
        toast.error('Error processing image');
        console.error('Image processing error:', error);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim() !== '' && !achievementList.includes(newAchievement.trim())) {
      const newList = [...achievementList, newAchievement.trim()];
      setAchievementList(newList);
      setNewAchievement('');
      setProfileStats(prev => ({ ...prev, achievements: newList.length }));
      toast.success('Achievement added!');
    }
  };

  const handleRemoveAchievement = (index) => {
    const newList = [...achievementList];
    newList.splice(index, 1);
    setAchievementList(newList);
    setProfileStats(prev => ({ ...prev, achievements: newList.length }));
    toast.success('Achievement removed');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        achievements: achievementList.join(','),
      };
      
      // Update profile data using real API
      const response = await api.put('/api/user/profile', updatedData);
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update profile');
      }
      
      setEditMode(false);
      setPreviewImage(null);
      toast.success('Profile updated successfully!', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      // Update user context with real response data
      const updatedUserData = {
        ...user,
        ...response.data.data,
        profileImage: previewImage || profileImage
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedUserData));
      updateUser(updatedUserData);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setPreviewImage(null);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'player',
        experience: user.experience || '',
        achievements: user.achievements || '',
        state: user.state || '',
        country: user.country || '',
        bio: user.bio || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        emergencyContact: user.emergencyContact || '',
        preferredSports: user.preferredSports || [],
      });
      
      if (user.achievements) {
        setAchievementList(user.achievements.split(',').filter(a => a.trim() !== ''));
      }
    }
    toast('Changes cancelled', { icon: 'ℹ️' });
  };

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // Note: Implement real account deletion API call here
      // await api.delete('/api/user/account');
      
      // For now, just close dialog and show message
      setDeleteDialogOpen(false);
      toast.error('Account deletion feature will be implemented soon');
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getProfileCompleteness = () => {
    const fields = ['name', 'email', 'phone', 'address', 'country', 'bio'];
    const filledFields = fields.filter(field => formData[field] && formData[field].trim());
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tab panel component
  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`profile-tabpanel-${index}`}
        aria-labelledby={`profile-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Fade in={true} timeout={500}>
            <Box sx={{ py: 3 }}>
              {children}
            </Box>
          </Fade>
        )}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <ProfileContainer maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
            borderRadius: 3,
            color: 'white'
          }}>
            <AccountCircle sx={{ fontSize: 80, mb: 2, opacity: 0.8 }} />
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Welcome to Your Profile
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Please log in to view and manage your profile information.
            </Typography>
            <ActionButton 
              variant="contained" 
              size="large"
              href="/login"
              sx={{ 
                backgroundColor: 'white', 
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Login to Continue
            </ActionButton>
          </Box>
        </Fade>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer maxWidth="xl">
      {/* Profile Header */}
      <Slide in={true} direction="down" timeout={800}>
        <ProfileHeader>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" fontWeight={700} gutterBottom>
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your sports profile and track your progress
            </Typography>
            
            {/* Profile Completeness */}
            <Box sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Profile Completeness</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {getProfileCompleteness()}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getProfileCompleteness()}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: 'white',
                  }
                }}
              />
            </Box>
          </Box>
        </ProfileHeader>
      </Slide>

      {/* Quick Stats */}
      <Slide in={true} direction="up" timeout={1000}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <StatsCard elevation={2}>
              <Sports sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="primary">
                {profileStats.totalSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Sessions
              </Typography>
            </StatsCard>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <StatsCard elevation={2}>
              <School sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="success.main">
                {profileStats.completedCourses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Courses Completed
              </Typography>
            </StatsCard>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <StatsCard elevation={2}>
              <EmojiEvents sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {profileStats.achievements}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Achievements
              </Typography>
            </StatsCard>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <StatsCard elevation={2}>
              <TrendingUp sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="info.main">
                {profileStats.ranking}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Global Ranking
              </Typography>
            </StatsCard>
          </Grid>
        </Grid>
      </Slide>
      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Sidebar - Profile Card */}
        <Grid item xs={12} lg={4}>
          <Slide in={true} direction="right" timeout={1200}>
            <StyledCard>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                p: 4
              }}>
                {/* Avatar Section */}
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    editMode ? (
                      <Tooltip title="Change Profile Photo">
                        <IconButton 
                          onClick={triggerFileInput}
                          sx={{ 
                            bgcolor: theme.palette.primary.main, 
                            '&:hover': { 
                              bgcolor: theme.palette.primary.dark,
                              animation: `${pulse} 1s ease-in-out infinite`
                            },
                            width: 50,
                            height: 50,
                            border: `3px solid ${theme.palette.background.paper}`
                          }}
                        >
                          {imageLoading ? (
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                          ) : (
                            <PhotoCamera sx={{ color: 'white', fontSize: 24 }} />
                          )}
                        </IconButton>
                      </Tooltip>
                    ) : null
                  }
                >
                  <EnhancedAvatar
                    src={previewImage || profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=random&size=200`}
                    alt={user?.name}
                  >
                    {!profileImage && !previewImage && <Person sx={{ fontSize: 80 }} />}
                  </EnhancedAvatar>
                </Badge>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                
                {/* User Info */}
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="h4" fontWeight={700} gutterBottom>
                    {user?.name}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                    <Chip 
                      label={user?.role === 'player' ? 'Player' : user?.role === 'coach' ? 'Coach' : 'User'} 
                      color={user?.role === 'player' ? 'primary' : user?.role === 'coach' ? 'secondary' : 'default'}
                      variant="filled"
                      icon={user?.role === 'coach' ? <School /> : <Sports />}
                    />
                    
                    {user?.experience && (
                      <Chip 
                        label={`${user.experience} years`} 
                        variant="outlined"
                        size="small"
                        icon={<WorkHistory />}
                      />
                    )}
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Member since {user?.createdAt ? formatJoinDate(user.createdAt) : 'Recently joined'}
                  </Typography>
                </Box>
                
                {/* Contact Info */}
                <Divider sx={{ width: '100%', my: 3 }} />
                
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Email sx={{ mr: 2, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  
                  {user?.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                      <Typography variant="body2">{user?.phone}</Typography>
                    </Box>
                  )}
                  
                  {(user?.state || user?.country) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                      <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {user?.state ? `${user?.state}, ` : ''}{user?.country}
                      </Typography>
                    </Box>
                  )}
                  
                  {formData.bio && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        "{formData.bio}"
                      </Typography>
                    </Box>
                  )}
                </Stack>
                
                {/* Action Buttons */}
                <Box sx={{ mt: 4, width: '100%' }}>
                  <Stack spacing={2}>
                    <ActionButton
                      variant={editMode ? "outlined" : "contained"}
                      startIcon={editMode ? <Cancel /> : <Edit />}
                      onClick={() => editMode ? handleCancel() : setEditMode(true)}
                      fullWidth
                      color={editMode ? "error" : "primary"}
                    >
                      {editMode ? 'Cancel Editing' : 'Edit Profile'}
                    </ActionButton>
                    
                    {editMode && (
                      <ActionButton
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSave}
                        fullWidth
                        disabled={loading}
                        color="success"
                      >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                      </ActionButton>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </StyledCard>
          </Slide>
        </Grid>
        {/* Right Content - Tabbed Interface */}
        <Grid item xs={12} lg={8}>
          <Slide in={true} direction="left" timeout={1400}>
            <Box>
              {/* Tab Navigation */}
              <TabContainer>
                <Tabs 
                  value={currentTab} 
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 2,
                    },
                    '& .Mui-selected': {
                      color: theme.palette.primary.main,
                    }
                  }}
                >
                  <Tab icon={<Person />} label="Personal Info" />
                  <Tab icon={<EmojiEvents />} label="Achievements" />
                  <Tab icon={<Settings />} label="Settings" />
                  <Tab icon={<Timeline />} label="Activity" />
                </Tabs>
              </TabContainer>

              {/* Tab Content */}
              <Box>
                {/* Personal Information Tab */}
                <TabPanel value={currentTab} index={0}>
                  <StyledCard>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                        Personal Information
                      </Typography>
                      
                      {editMode ? (
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              variant="outlined"
                              InputProps={{
                                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email Address"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              variant="outlined"
                              type="email"
                              InputProps={{
                                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              variant="outlined"
                              InputProps={{
                                startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel>Role</InputLabel>
                              <Select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                label="Role"
                                startAdornment={<Sports sx={{ mr: 1, color: 'text.secondary' }} />}
                              >
                                <MenuItem value="player">Player</MenuItem>
                                <MenuItem value="coach">Coach</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Bio"
                              name="bio"
                              value={formData.bio}
                              onChange={handleInputChange}
                              variant="outlined"
                              multiline
                              rows={3}
                              placeholder="Tell us about yourself..."
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              variant="outlined"
                              multiline
                              rows={2}
                              InputProps={{
                                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="State/Province"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              variant="outlined"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Country *"
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              variant="outlined"
                              required
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Experience (years)"
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              variant="outlined"
                              type="number"
                              InputProps={{
                                startAdornment: <WorkHistory sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Website/Portfolio"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              variant="outlined"
                              placeholder="https://..."
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Date of Birth"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              variant="outlined"
                              type="date"
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                startAdornment: <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth variant="outlined">
                              <InputLabel>Gender</InputLabel>
                              <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                label="Gender"
                              >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Emergency Contact"
                              name="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={handleInputChange}
                              variant="outlined"
                              placeholder="Name and phone number"
                              InputProps={{
                                startAdornment: <Group sx={{ mr: 1, color: 'text.secondary' }} />,
                              }}
                            />
                          </Grid>
                        </Grid>
                      ) : (
                        <Grid container spacing={3}>
                          {[
                            { label: 'Full Name', value: user?.name, icon: <Person /> },
                            { label: 'Email', value: user?.email, icon: <Email /> },
                            { label: 'Phone', value: user?.phone || 'Not provided', icon: <Phone /> },
                            { label: 'Role', value: user?.role || 'User', icon: <Sports />, isChip: true },
                            { label: 'Bio', value: formData.bio || 'No bio provided', span: 12 },
                            { label: 'Address', value: user?.address || 'Not provided', icon: <LocationOn />, span: 12 },
                            { label: 'State', value: user?.state || 'Not provided' },
                            { label: 'Country', value: user?.country || 'Not provided' },
                            { label: 'Experience', value: user?.experience ? `${user.experience} years` : 'Not provided', icon: <WorkHistory /> },
                            { label: 'Website', value: formData.website || 'Not provided', isLink: true },
                            { label: 'Date of Birth', value: formData.dateOfBirth || 'Not provided', icon: <CalendarToday /> },
                            { label: 'Gender', value: formData.gender || 'Not provided' },
                            { label: 'Emergency Contact', value: formData.emergencyContact || 'Not provided', icon: <Group />, span: 12 },
                          ].map((field, index) => (
                            <Grid item xs={12} sm={field.span || 6} key={index}>
                              <InfoCard>
                                <CardContent sx={{ p: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {field.icon}
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ ml: 1 }}>
                                      {field.label}
                                    </Typography>
                                  </Box>
                                  {field.isChip ? (
                                    <Chip 
                                      label={field.value} 
                                      color={field.value === 'player' ? 'primary' : field.value === 'coach' ? 'secondary' : 'default'}
                                      size="small"
                                    />
                                  ) : field.isLink && field.value !== 'Not provided' ? (
                                    <Typography 
                                      variant="body2" 
                                      component="a" 
                                      href={field.value} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                                    >
                                      {field.value}
                                    </Typography>
                                  ) : (
                                    <Typography variant="body2" color={field.value === 'Not provided' ? 'text.secondary' : 'text.primary'}>
                                      {field.value}
                                    </Typography>
                                  )}
                                </CardContent>
                              </InfoCard>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </CardContent>
                  </StyledCard>
                </TabPanel>
                {/* Achievements Tab */}
                <TabPanel value={currentTab} index={1}>
                  <StyledCard>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                        Achievements & Recognition
                      </Typography>
                      
                      {editMode ? (
                        <Box>
                          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                            <TextField
                              fullWidth
                              label="Add New Achievement"
                              value={newAchievement}
                              onChange={(e) => setNewAchievement(e.target.value)}
                              variant="outlined"
                              placeholder="e.g., State Championship Winner 2023"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddAchievement();
                                }
                              }}
                            />
                            <ActionButton 
                              variant="contained" 
                              onClick={handleAddAchievement}
                              disabled={!newAchievement.trim()}
                              startIcon={<Add />}
                            >
                              Add
                            </ActionButton>
                          </Box>
                          
                          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                            Current Achievements ({achievementList.length})
                          </Typography>
                          
                          <Grid container spacing={2}>
                            {achievementList.map((achievement, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper 
                                  sx={{ 
                                    p: 2, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    border: `1px solid ${theme.palette.primary.light}`,
                                    '&:hover': {
                                      boxShadow: theme.shadows[4]
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <EmojiEvents sx={{ color: theme.palette.warning.main, mr: 1 }} />
                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                      {achievement}
                                    </Typography>
                                  </Box>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleRemoveAchievement(index)}
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                          
                          {achievementList.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <EmojiEvents sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                              <Typography variant="h6" color="text.secondary" gutterBottom>
                                No achievements yet
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Add your first achievement to get started!
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box>
                          {achievementList.length > 0 ? (
                            <Grid container spacing={3}>
                              {achievementList.map((achievement, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                  <Paper 
                                    sx={{ 
                                      p: 3, 
                                      textAlign: 'center',
                                      background: `linear-gradient(135deg, ${theme.palette.warning.light}, ${theme.palette.warning.main})`,
                                      color: 'white',
                                      borderRadius: 2,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: theme.shadows[8]
                                      }
                                    }}
                                  >
                                    <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="body1" fontWeight={600}>
                                      {achievement}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              ))}
                            </Grid>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 6 }}>
                              <EmojiEvents sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                              <Typography variant="h6" color="text.secondary" gutterBottom>
                                No achievements yet
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Start your journey and earn your first achievement!
                              </Typography>
                              <ActionButton 
                                variant="outlined" 
                                onClick={() => setEditMode(true)}
                                startIcon={<Add />}
                              >
                                Add Achievement
                              </ActionButton>
                            </Box>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </StyledCard>
                </TabPanel>

                {/* Settings Tab */}
                <TabPanel value={currentTab} index={2}>
                  <Stack spacing={3}>
                    {/* Privacy Settings */}
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Security sx={{ mr: 1 }} />
                          Privacy & Security
                        </Typography>
                        
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>Profile Visibility</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Control who can view your profile
                              </Typography>
                            </Box>
                            <IconButton>
                              <Visibility />
                            </IconButton>
                          </Box>
                          
                          <Divider />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>Change Password</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Update your account password
                              </Typography>
                            </Box>
                            <ActionButton variant="outlined" size="small">
                              Change
                            </ActionButton>
                          </Box>
                          
                          <Divider />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500} color="error">
                                Delete Account
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Permanently delete your account
                              </Typography>
                            </Box>
                            <ActionButton 
                              variant="outlined" 
                              color="error" 
                              size="small"
                              onClick={handleDeleteAccount}
                            >
                              Delete
                            </ActionButton>
                          </Box>
                        </Stack>
                      </CardContent>
                    </StyledCard>

                    {/* Preferences */}
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <Settings sx={{ mr: 1 }} />
                          Preferences
                        </Typography>
                        
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>Email Notifications</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Receive updates via email
                              </Typography>
                            </Box>
                            <IconButton>
                              <Notifications />
                            </IconButton>
                          </Box>
                          
                          <Divider />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>Language</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Choose your preferred language
                              </Typography>
                            </Box>
                            <Chip label="English" icon={<Language />} />
                          </Box>
                          
                          <Divider />
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>Theme</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Light or dark mode
                              </Typography>
                            </Box>
                            <Chip label="System" icon={<Palette />} />
                          </Box>
                        </Stack>
                      </CardContent>
                    </StyledCard>
                  </Stack>
                </TabPanel>

                {/* Activity Tab */}
                <TabPanel value={currentTab} index={3}>
                  <StyledCard>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                        Recent Activity
                      </Typography>
                      
                      <Stack spacing={3}>
                        {/* Show message when no real activity data is available */}
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Timeline sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No recent activity
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Your activity will appear here once you start using the platform.
                          </Typography>
                          <ActionButton variant="outlined" href="/games">
                            Explore Games
                          </ActionButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </TabPanel>
              </Box>
            </Box>
          </Slide>
        </Grid>
      </Grid>

      {/* Floating Edit Button (Mobile) */}
      {isMobile && (
        <Fade in={!editMode} timeout={500}>
          <FloatingActionButton onClick={() => setEditMode(true)}>
            <Edit />
          </FloatingActionButton>
        </Fade>
      )}

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All your data, including profile information, achievements, and activity history will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileContainer>
  );
};

export default Profile;