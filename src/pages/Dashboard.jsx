import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,

  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Badge,
  useTheme,
  alpha,
  styled,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
  Select,
  MenuItem,
  ButtonGroup
} from '@mui/material';
import {
  Person,
  Sports,
  FitnessCenter,
  Restaurant,
  Event,
  TrendingUp,
  Schedule,
  Notifications,
  Logout,
  Settings,
  ChevronRight,
  Star,
  LocalFireDepartment,
  Timeline,
  EmojiEvents,
  Favorite,
  Book,
  Timer
} from '@mui/icons-material';
import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchUserProfile, fetchUserCourses, fetchUserProgress } from '../services/userService';

// Styled components with animations
const AnimatedCard = styled(animated(Card))({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
  }
});

const StatCard = styled(motion(Card))(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
  }
}));

const ActionButton = styled(motion(Button))(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  py: 6,
  mb: 4,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3
  }
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(3);
  
  // User preferences that should persist across page refreshes
  const [dashboardLayout, setDashboardLayout] = useLocalStorage('dashboardLayout', 'grid');
  const [showNotifications, setShowNotifications] = useLocalStorage('showNotifications', true);
  const [quickActionsOrder, setQuickActionsOrder] = useLocalStorage('quickActionsOrder', [0, 1, 2, 3]);
  const [statsOrder, setStatsOrder] = useLocalStorage('statsOrder', ['workouts', 'streak', 'achievements', 'calories']);
  
  // State for settings dialog
  const [openSettings, setOpenSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    layout: dashboardLayout,
    notifications: showNotifications,
    quickActions: [...quickActionsOrder],
    stats: [...statsOrder]
  });
  
  // Handle settings dialog open/close
  const handleOpenSettings = () => {
    setTempSettings({
      layout: dashboardLayout,
      notifications: showNotifications,
      quickActions: [...quickActionsOrder],
      stats: [...statsOrder]
    });
    setOpenSettings(true);
  };
  
  const handleCloseSettings = () => {
    setOpenSettings(false);
  };
  

  
  // Save settings
  const handleSaveSettings = () => {
    setDashboardLayout(tempSettings.layout);
    setShowNotifications(tempSettings.notifications);
    setQuickActionsOrder(tempSettings.quickActions);
    setStatsOrder(tempSettings.stats);
    setOpenSettings(false);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile
        const profileData = await fetchUserProfile();
        setUserProfile(profileData.data);
  
        // Fetch user courses
        const coursesData = await fetchUserCourses();
        setCourses(coursesData.data);
  
        // Fetch user progress
        const progressData = await fetchUserProgress();
        // Update user profile with progress data
        setUserProfile(prev => prev ? { ...prev, stats: progressData.data } : null);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }
  
  if (!userProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">User profile not found</Alert>
      </Container>
    );
  }
  
  const quickActions = [
    { title: 'Start Workout', icon: <FitnessCenter />, path: '/workout', color: theme.palette.primary.main },
    { title: 'Nutrition Plan', icon: <Restaurant />, path: '/nutrition', color: theme.palette.success.main },
    { title: 'Schedule', icon: <Schedule />, path: '/schedule', color: theme.palette.warning.main },
    { title: 'Events', icon: <Event />, path: '/events', color: theme.palette.info.main },
  ];
  
  const recentActivities = [
    { title: 'Completed morning run', time: '2 hours ago', icon: <Sports />, color: theme.palette.success.main },
    { title: 'Updated nutrition plan', time: '1 day ago', icon: <Restaurant />, color: theme.palette.info.main },
    { title: 'Joined yoga class', time: '2 days ago', icon: <FitnessCenter />, color: theme.palette.warning.main },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Box sx={{ backgroundColor: alpha(theme.palette.background.default, 0.5), minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <HeroSection>
          <Container>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Avatar 
                    src={userProfile.avatar} 
                    sx={{ width: 80, height: 80, border: '3px solid white', mr: 3 }}
                  />
                </motion.div>
                <Box>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Typography variant="h4" component="h1" fontWeight={700}>
                      Welcome back, {userProfile.name}!
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Member since {new Date(userProfile.joinDate).toLocaleDateString()}
                    </Typography>
                  </motion.div>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {showNotifications && (
                  <Tooltip title="Notifications">
                    <IconButton sx={{ color: 'white', mr: 2 }}>
                      <Badge badgeContent={notifications} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Settings">
                  <IconButton sx={{ color: 'white', mr: 2 }} onClick={handleOpenSettings}>
                    <Settings />
                  </IconButton>
                </Tooltip>
                <ActionButton 
                  variant="contained" 
                  color="secondary"
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </ActionButton>
              </Box>
            </Box>
          </Container>
        </HeroSection>
        
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Your Progress</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsOrder.map((stat, index) => {
              let statContent;
              
              switch(stat) {
                case 'workouts':
                  statContent = (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div variants={itemVariants}>
                        <StatCard>
                          <FitnessCenter sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                          <Typography variant="h3" fontWeight={700} color="primary">
                            {userProfile.stats?.totalWorkouts || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Workouts Completed
                          </Typography>
                        </StatCard>
                      </motion.div>
                    </Grid>
                  );
                  break;
                case 'streak':
                  statContent = (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div variants={itemVariants}>
                        <StatCard>
                          <LocalFireDepartment sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                          <Typography variant="h3" fontWeight={700} color="warning.main">
                            {userProfile.stats?.streak || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Current Streak
                          </Typography>
                        </StatCard>
                      </motion.div>
                    </Grid>
                  );
                  break;
                case 'achievements':
                  statContent = (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div variants={itemVariants}>
                        <StatCard>
                          <EmojiEvents sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                          <Typography variant="h3" fontWeight={700} color="success.main">
                            {userProfile.stats?.achievements || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Achievements
                          </Typography>
                        </StatCard>
                      </motion.div>
                    </Grid>
                  );
                  break;
                case 'calories':
                  statContent = (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div variants={itemVariants}>
                        <StatCard>
                          <Favorite sx={{ fontSize: 40, color: theme.palette.error.main, mb: 1 }} />
                          <Typography variant="h3" fontWeight={700} color="error.main">
                            {userProfile.stats?.caloriesBurned || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Calories Burned
                          </Typography>
                        </StatCard>
                      </motion.div>
                    </Grid>
                  );
                  break;
                default:
                  statContent = null;
              }
              
              return statContent;
            })}
          </Grid>
          
          {/* Weekly Progress */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>Weekly Progress</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile.stats?.completed || 0} of {userProfile.stats?.weeklyTarget || 5} workouts completed
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={userProfile.stats ? (userProfile.stats.completed / userProfile.stats.weeklyTarget) * 100 : 0} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Keep going!</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {userProfile.stats ? Math.round((userProfile.stats.completed / userProfile.stats.weeklyTarget) * 100) : 0}%
                </Typography>
              </Box>
            </Paper>
          </motion.div>
          
          {/* Quick Actions */}
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Quick Actions</Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {quickActionsOrder.map((originalIndex, index) => quickActions[originalIndex]).map((action, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <motion.div variants={itemVariants}>
                  <AnimatedCard
                    component={Link}
                    to={action.path}
                    sx={{ 
                      textAlign: 'center', 
                      p: 3,
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box sx={{ 
                      color: action.color, 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: alpha(action.color, 0.1),
                      mx: 'auto'
                    }}>
                      {action.icon}
                    </Box>
                    <Typography variant="body1" fontWeight={600}>{action.title}</Typography>
                  </AnimatedCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
          
          {/* Recent Activities */}
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>Recent Activities</Typography>
          <motion.div variants={itemVariants}>
            <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        transition: 'background-color 0.3s',
                        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
                      }}
                    >
                      <ListItemIcon>
                        <Box sx={{ 
                          color: activity.color, 
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: alpha(activity.color, 0.1)
                        }}>
                          {activity.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography fontWeight={600}>{activity.title}</Typography>}
                        secondary={activity.time}
                      />
                      <IconButton edge="end">
                        <ChevronRight />
                      </IconButton>
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </motion.div>
          
          {/* My Courses */}
          <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>My Courses</Typography>
          <Grid container spacing={3}>
            {courses.length > 0 ? courses.map((course) => (
              <Grid item xs={12} sm={4} key={course.id}>
                <motion.div variants={itemVariants}>
                  <AnimatedCard
                    whileHover={{ y: -10 }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={course.image}
                      alt={course.title}
                      sx={{ borderTopLeftRadius: theme.shape.borderRadius, borderTopRightRadius: theme.shape.borderRadius }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {course.title}
                        </Typography>
                        <Chip 
                          icon={<Star fontSize="small" />} 
                          label={course.rating} 
                          size="small" 
                          color="warning"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {course.description}
                      </Typography>
                      
                      {/* Course Progress */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2" fontWeight={600}>{course.progress}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      
                      {/* Course Details */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Timer fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {course.duration}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Next Session */}
                      {course.nextSession && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
                          <Schedule fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                          <Typography variant="body2" fontWeight={600}>
                            Next: {new Date(course.nextSession).toLocaleDateString()} at {new Date(course.nextSession).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={course.category} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                        <ActionButton 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          component={Link}
                          to={`/courses/${course.id}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {course.progress > 0 ? 'Continue' : 'Start'}
                        </ActionButton>
                      </Box>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>
              </Grid>
            )) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                  <Book sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    You haven't enrolled in any courses yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Explore our courses and start your fitness journey today
                  </Typography>
                  <ActionButton 
                    variant="contained" 
                    color="primary"
                    component={Link}
                    to="/courses"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Browse Courses
                  </ActionButton>
                </Paper>
              </Grid>
            )}
          </Grid>
        </motion.div>
      </Container>
      
      {/* Settings Dialog */}
      <Dialog open={openSettings} onClose={handleCloseSettings} maxWidth="md" fullWidth>
        <DialogTitle>Dashboard Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Dashboard Layout</FormLabel>
              <RadioGroup 
                value={tempSettings.layout} 
                onChange={(e) => setTempSettings({...tempSettings, layout: e.target.value})}
                row
              >
                <FormControlLabel value="grid" control={<Radio />} label="Grid" />
                <FormControlLabel value="list" control={<Radio />} label="List" />
              </RadioGroup>
            </FormControl>
            
            <FormControlLabel 
              control={
                <Switch 
                  checked={tempSettings.notifications}
                  onChange={(e) => setTempSettings({...tempSettings, notifications: e.target.checked})}
                />
              } 
              label="Show Notifications" 
            />
            
            <FormControl component="fieldset">
              <FormLabel component="legend">Quick Actions Order</FormLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {tempSettings.quickActions.map((index, position) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 2, width: 100 }}>
                      {position + 1}.
                    </Typography>
                    <Typography variant="body2">
                      {quickActions[index].title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained" color="primary">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;