import React, { useState, useEffect } from 'react';
import { PieChart, BarChart, LineChart } from '@mui/x-charts';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  Badge,
  CardHeader,
  ListSubheader,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Tooltip,
  Stack,
  Collapse
} from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  LocalHospital,
  ExpandMore,
  CheckCircle,
  CalendarToday,
  TrendingUp,
  Favorite,
  Info,
  Close,
  Timer,
  Scale,
  EmojiFoodBeverage,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  WaterDrop,
  Apple,
  RiceBowl,
  LunchDining,
  BreakfastDining,
  DinnerDining,
  LocalFireDepartment,
  MonitorWeight,
  ArrowUpward,
  ArrowDownward,
  RemoveCircle,
  AddCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const Nutrition = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mealLog, setMealLog] = useState([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [weight, setWeight] = useState(null);
  const [weightGoal, setWeightGoal] = useState('');
  const [mealDialogOpen, setMealDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealType, setMealType] = useState('breakfast');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');
  const [nutritionData, setNutritionData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealPlanDialogOpen, setMealPlanDialogOpen] = useState(false);
  const [selectedPlanForMeal, setSelectedPlanForMeal] = useState(null);

  // Nutrition plans data
  const nutritionPlans = [
    {
      id: 1,
      title: "Weight Loss Plan",
      description: "Balanced calorie deficit diet with portion control",
      duration: "8-12 weeks",
      calories: 1500,
      icon: <TrendingUp />,
      color: "#4caf50",
      features: [
        "Personalized meal plans",
        "Weekly progress tracking",
        "Nutritionist support",
        "Recipe collection"
      ],
      meals: [
        "Breakfast: Greek yogurt with berries and nuts",
        "Lunch: Grilled chicken salad with vinaigrette",
        "Dinner: Baked salmon with roasted vegetables",
        "Snack: Apple with almond butter"
      ]
    },
    {
      id: 2,
      title: "Muscle Gain Plan",
      description: "High-protein diet optimized for muscle growth",
      duration: "12-16 weeks",
      calories: 2500,
      icon: <FitnessCenter />,
      color: "#2196f3",
      features: [
        "Protein timing strategies",
        "Pre and post-workout nutrition",
        "Supplement guidance",
        "Bulk meal recipes"
      ],
      meals: [
        "Breakfast: Protein oatmeal with banana and whey",
        "Lunch: Lean beef with quinoa and vegetables",
        "Dinner: Chicken stir-fry with brown rice",
        "Snack: Protein shake with banana"
      ]
    },
    {
      id: 3,
      title: "Maintenance Plan",
      description: "Balanced nutrition for sustained energy and health",
      duration: "Ongoing",
      calories: 2000,
      icon: <EmojiFoodBeverage />,
      color: "#ff9800",
      features: [
        "Macro-nutrient balance",
        "Flexible dieting approach",
        "Seasonal meal planning",
        "Healthy eating habits"
      ],
      meals: [
        "Breakfast: Whole grain toast with avocado and eggs",
        "Lunch: Mixed bean salad with olive oil dressing",
        "Dinner: Turkey meatballs with whole wheat pasta",
        "Snack: Mixed nuts and fruit"
      ]
    },
    {
      id: 4,
      title: "Athletic Performance",
      description: "Optimized nutrition for peak athletic performance",
      duration: "Seasonal",
      calories: 2800,
      icon: <Timer />,
      color: "#9c27b0",
      features: [
        "Sport-specific nutrition",
        "Hydration strategies",
        "Competition prep nutrition",
        "Recovery nutrition"
      ],
      meals: [
        "Breakfast: Smoothie with protein, fruits and oats",
        "Lunch: Sweet potato with grilled chicken and veggies",
        "Dinner: Lean steak with sweet potato and asparagus",
        "Snack: Rice cakes with honey and peanut butter"
      ]
    }
  ];

  // Nutrition tips data
  const nutritionTips = [
    {
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily for optimal body function."
    },
    {
      title: "Eat Whole Foods",
      description: "Focus on unprocessed foods for better nutrient absorption."
    },
    {
      title: "Balanced Macros",
      description: "Include proteins, carbs, and healthy fats in every meal."
    },
    {
      title: "Portion Control",
      description: "Use smaller plates to help manage portion sizes naturally."
    },
    {
      title: "Meal Prep",
      description: "Prepare meals in advance to avoid unhealthy food choices."
    },
    {
      title: "Mindful Eating",
      description: "Pay attention to hunger cues and eat slowly to improve digestion."
    }
  ];

  // Diet tracking tools
  const trackingTools = [
    {
      name: "Calorie Counter",
      description: "Track your daily calorie intake and expenditure",
      icon: <Scale />
    },
    {
      name: "Macro Tracker",
      description: "Monitor your protein, carb, and fat intake",
      icon: <TrendingUp />
    },
    {
      name: "Water Intake",
      description: "Log your daily water consumption",
      icon: <LocalHospital />
    },
    {
      name: "Meal Planner",
      description: "Plan and schedule your weekly meals",
      icon: <CalendarToday />
    }
  ];

  // Load user data on mount
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user nutrition data
      const fetchUserData = async () => {
        try {
          setLoading(true);
          const response = await api.get('/api/nutrition/profile');
          setUserData(response.data);

          // Set initial values from user data
          if (response.data) {
            setGoal(response.data.goal || '');
            setDietaryRestrictions(response.data.dietaryRestrictions || []);
            setCalorieTarget(response.data.calorieTarget || 2000);
            setWeightGoal(response.data.weightGoal || '');
            setWeight(response.data.currentWeight || null);
          }
        } catch (error) {
          console.error('Error fetching user nutrition data:', error);
          toast.error('Failed to load nutrition data');
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated]);

  // Load nutrition data for selected date
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNutritionData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/nutrition/log?date=${selectedDate}`);
          setNutritionData(response.data);

          // Set meal log from response
          if (response.data && response.data.meals) {
            setMealLog(response.data.meals);
          }

          // Set water intake
          if (response.data && response.data.waterIntake) {
            setWaterIntake(response.data.waterIntake);
          }
        } catch (error) {
          console.error('Error fetching nutrition data:', error);
          // Don't show error for initial load as data might not exist yet
        } finally {
          setLoading(false);
        }
      };

      fetchNutritionData();
    }
  }, [isAuthenticated, selectedDate]);

  // Load progress data
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProgressData = async () => {
        try {
          const response = await api.get('/api/nutrition/progress');
          setProgressData(response.data);
        } catch (error) {
          console.error('Error fetching progress data:', error);
        }
      };

      fetchProgressData();
    }
  }, [isAuthenticated]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPlanDialogOpen(true);
  };

  const handleClosePlanDialog = () => {
    setPlanDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleGoalChange = (event) => {
    setGoal(event.target.value);
  };

  const handleDietaryRestrictionsChange = (event) => {
    setDietaryRestrictions(event.target.value);
  };

  const handleCalorieTargetChange = (event) => {
    setCalorieTarget(event.target.value);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await api.put('/api/nutrition/profile', {
        goal,
        dietaryRestrictions,
        calorieTarget,
        weightGoal,
        currentWeight: weight
      });

      toast.success('Nutrition profile updated successfully!');
    } catch (error) {
      console.error('Error updating nutrition profile:', error);
      toast.error('Failed to update nutrition profile');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMealDialog = (mealType) => {
    setMealType(mealType);
    setMealDialogOpen(true);
    setSelectedMeal(null);
    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setMealCarbs('');
    setMealFat('');
  };

  const handleEditMeal = (meal) => {
    setSelectedMeal(meal);
    setMealType(meal.type);
    setMealName(meal.name);
    setMealCalories(meal.calories);
    setMealProtein(meal.protein);
    setMealCarbs(meal.carbs);
    setMealFat(meal.fat);
    setMealDialogOpen(true);
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      setLoading(true);
      await api.delete(`/api/nutrition/meal/${mealId}`);

      // Update local state
      setMealLog(mealLog.filter(meal => meal.id !== mealId));
      toast.success('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    try {
      setLoading(true);
      const mealData = {
        type: mealType,
        name: mealName,
        calories: parseInt(mealCalories) || 0,
        protein: parseFloat(mealProtein) || 0,
        carbs: parseFloat(mealCarbs) || 0,
        fat: parseFloat(mealFat) || 0
      };

      if (selectedMeal) {
        // Update existing meal
        await api.put(`/api/nutrition/meal/${selectedMeal.id}`, mealData);
        toast.success('Meal updated successfully');
      } else {
        // Add new meal
        await api.post('/api/nutrition/meal', { ...mealData, date: selectedDate });
        toast.success('Meal added successfully');
      }

      // Refresh nutrition data
      const response = await api.get(`/api/nutrition/log?date=${selectedDate}`);
      setNutritionData(response.data);
      setMealLog(response.data.meals || []);

      // Close dialog
      setMealDialogOpen(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      toast.error('Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  const handleWaterIntakeChange = (amount) => {
    setWaterIntake(amount);

    // Save water intake to backend
    api.put('/api/nutrition/water', { amount, date: selectedDate })
      .catch(error => {
        console.error('Error updating water intake:', error);
        toast.error('Failed to update water intake');
      });
  };

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight);
  };

  const handleApplyNutritionPlan = (plan) => {
    setSelectedPlanForMeal(plan);
    setMealPlanDialogOpen(true);
  };

  const handleConfirmPlanApplication = async () => {
    try {
      setLoading(true);
      await api.post(`/api/nutrition/plan/${selectedPlanForMeal.id}/apply`, {
        startDate: selectedDate
      });

      toast.success('Nutrition plan applied successfully!');
      setMealPlanDialogOpen(false);
      setSelectedPlanForMeal(null);

      // Refresh data
      const response = await api.get('/api/nutrition/profile');
      setUserData(response.data);
    } catch (error) {
      console.error('Error applying nutrition plan:', error);
      toast.error('Failed to apply nutrition plan');
    } finally {
      setLoading(false);
    }
  };

  // Calculate daily totals
  const calculateTotals = () => {
    return mealLog.reduce((totals, meal) => {
      totals.calories += meal.calories || 0;
      totals.protein += meal.protein || 0;
      totals.carbs += meal.carbs || 0;
      totals.fat += meal.fat || 0;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const totals = calculateTotals();

  // Get meals by type
  const getMealsByType = (type) => {
    return mealLog.filter(meal => meal.type === type);
  };

  // Get meal icon based on type
  const getMealIcon = (type) => {
    switch (type) {
      case 'breakfast': return <BreakfastDining />;
      case 'lunch': return <LunchDining />;
      case 'dinner': return <DinnerDining />;
      case 'snack': return <Apple />;
      default: return <Restaurant />;
    }
  };

  // Get meal type display name
  const getMealTypeName = (type) => {
    switch (type) {
      case 'breakfast': return 'Breakfast';
      case 'lunch': return 'Lunch';
      case 'dinner': return 'Dinner';
      case 'snack': return 'Snack';
      default: return type;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Toaster position="top-right" />

      {!isAuthenticated ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to access your nutrition dashboard and track your meals.
        </Alert>
      ) : (
        <>
          {/* User Profile Summary */}
          <Card sx={{ mb: 4 }}>
            <CardHeader
              title="Nutrition Profile"
              subheader={`Welcome back, ${user.name}`}
              action={
                <Button variant="outlined" onClick={() => {
                  // Scroll to profile section
                  document.getElementById('nutrition-profile').scrollIntoView({ behavior: 'smooth' });
                }}>
                  Edit Profile
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <Scale />
                    </Avatar>
                    <Typography variant="h6">{calorieTarget} kcal</Typography>
                    <Typography variant="body2" color="text.secondary">Daily Target</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                      <LocalFireDepartment />
                    </Avatar>
                    <Typography variant="h6">{totals.calories} kcal</Typography>
                    <Typography variant="body2" color="text.secondary">Consumed Today</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 1 }}>
                      <WaterDrop />
                    </Avatar>
                    <Typography variant="h6">{waterIntake} ml</Typography>
                    <Typography variant="body2" color="text.secondary">Water Intake</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                      <MonitorWeight />
                    </Avatar>
                    <Typography variant="h6">{weight ? `${weight} kg` : 'N/A'}</Typography>
                    <Typography variant="body2" color="text.secondary">Current Weight</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Date Selector */}
          <Paper sx={{ p: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Nutrition Log</Typography>
              <TextField
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ width: 200 }}
              />
            </Box>
          </Paper>

          {/* Tabs Navigation */}
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Nutrition Plans" icon={<Restaurant />} iconPosition="start" />
              <Tab label="Meal Tracking" icon={<Scale />} iconPosition="start" />
              <Tab label="Nutrition Tips" icon={<Info />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ mb: 6 }}>
            {/* Nutrition Plans Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Choose Your Nutrition Plan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Select a plan that aligns with your fitness goals and dietary preferences
                </Typography>

                {/* Nutrition Plans Grid */}
                <Grid container spacing={4}>
                  {nutritionPlans.map((plan) => (
                    <Grid item xs={12} md={6} lg={3} key={plan.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: plan.color,
                            color: 'white'
                          }}
                        >
                          <Box sx={{ mr: 2 }}>{plan.icon}</Box>
                          <Typography variant="h6">{plan.title}</Typography>
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {plan.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Chip label={`${plan.calories} kcal/day`} size="small" />
                            <Chip label={plan.duration} size="small" variant="outlined" />
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            Key Features:
                          </Typography>
                          <List dense>
                            {plan.features.map((feature, index) => (
                              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 24 }}>
                                  <CheckCircle sx={{ fontSize: 16, color: plan.color }} />
                                </ListItemIcon>
                                <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2' }} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                        <Box sx={{ p: 2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handlePlanSelect(plan)}
                            sx={{ borderRadius: 30 }}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Meal Tracking Tab */}
            {activeTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h4" fontWeight={600}>
                    Track Your Meals
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenMealDialog('breakfast')}
                    sx={{ borderRadius: 30 }}
                  >
                    Add Meal
                  </Button>
                </Box>

                {/* Daily Summary */}
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Typography variant="h6" gutterBottom>Today's Summary</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5">{totals.calories}</Typography>
                        <Typography variant="body2" color="text.secondary">Calories</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5">{totals.protein}g</Typography>
                        <Typography variant="body2" color="text.secondary">Protein</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5">{totals.carbs}g</Typography>
                        <Typography variant="body2" color="text.secondary">Carbs</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5">{totals.fat}g</Typography>
                        <Typography variant="body2" color="text.secondary">Fat</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Water Intake */}
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Water Intake</Typography>
                    <Typography variant="body1">{waterIntake} ml / 2000 ml</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => handleWaterIntakeChange(Math.max(0, waterIntake - 250))}>
                      <RemoveCircle />
                    </IconButton>
                    <LinearProgress 
                      variant="determinate" 
                      value={(waterIntake / 2000) * 100} 
                      sx={{ flexGrow: 1 }}
                    />
                    <IconButton onClick={() => handleWaterIntakeChange(waterIntake + 250)}>
                      <AddCircle />
                    </IconButton>
                  </Box>
                </Paper>

                {/* Meals by Type */}
                {['breakfast', 'lunch', 'dinner', 'snack'].map((type) => {
                  const meals = getMealsByType(type);
                  return (
                    <Paper key={type} sx={{ p: 3, mb: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getMealIcon(type)}
                          <Typography variant="h6" sx={{ ml: 1 }}>{getMealTypeName(type)}</Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenMealDialog(type)}
                          startIcon={<Add />}
                        >
                          Add {getMealTypeName(type)}
                        </Button>
                      </Box>

                      {meals.length > 0 ? (
                        <List>
                          {meals.map((meal) => (
                            <React.Fragment key={meal.id}>
                              <ListItem
                                secondaryAction={
                                  <Box>
                                    <IconButton
                                      edge="end"
                                      aria-label="edit"
                                      onClick={() => handleEditMeal(meal)}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() => handleDeleteMeal(meal.id)}
                                      sx={{ color: 'error.main' }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                }
                              >
                                <ListItemIcon>
                                  {getMealIcon(meal.type)}
                                </ListItemIcon>
                                <ListItemText
                                  primary={meal.name}
                                  secondary={`${meal.calories} kcal • P: ${meal.protein}g • C: ${meal.carbs}g • F: ${meal.fat}g`}
                                />
                              </ListItem>
                              <Divider />
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
                          No {getMealTypeName(type)} logged yet
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* Nutrition Tips Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                  Nutrition Tips & Guidance
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Expert advice to help you make healthier food choices and develop better eating habits
                </Typography>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>Essential Nutrition Tips</Typography>
                      <List>
                        {nutritionTips.map((tip, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircle color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                primary={tip.title}
                                secondary={tip.description}
                                primaryTypographyProps={{ fontWeight: 600 }}
                              />
                            </ListItem>
                            {index < nutritionTips.length - 1 && <Divider component="li" />}
                          </React.Fragment>
                        ))}
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image="https://source.unsplash.com/600x400/?healthy-food,nutrition"
                        alt="Healthy food"
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Did You Know?</Typography>
                        <Typography variant="body2" paragraph>
                          Proper nutrition can improve your exercise performance by up to 20% and reduce recovery time significantly.
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Staying hydrated is one of the simplest yet most effective ways to boost your metabolism and energy levels.
                        </Typography>
                        <Button variant="outlined" size="small" sx={{ borderRadius: 30 }}>
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* FAQ Section */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    Frequently Asked Questions
                  </Typography>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>How much protein do I need daily?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Protein needs vary based on activity level. For sedentary individuals, 0.8g per kg of body weight is sufficient.
                        For active individuals, 1.2-2.0g per kg is recommended for muscle repair and growth.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>Should I count calories?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Calorie counting can be helpful for weight management but isn't necessary for everyone.
                        Focusing on food quality and portion sizes is often more sustainable long-term.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography fontWeight={600}>What are the best pre-workout foods?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2">
                        Ideal pre-workout foods combine carbs and protein, such as a banana with peanut butter,
                        Greek yogurt with berries, or a small oatmeal bowl. Eat 30-60 minutes before exercising.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Box>
            )}
          </Box>

          {/* Nutrition Profile Section */}
          <Box id="nutrition-profile">
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Your Nutrition Profile
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Customize your nutrition goals and preferences to get personalized recommendations
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="fitness-goal-label">Fitness Goal</InputLabel>
                    <Select
                      value={goal}
                      onChange={handleGoalChange}
                      labelId="fitness-goal-label"
                      aria-labelledby="fitness-goal-label"
                    >
                      <MenuItem value="weight-loss">Weight Loss</MenuItem>
                      <MenuItem value="muscle-gain">Muscle Gain</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="performance">Athletic Performance</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Dietary Restrictions</InputLabel>
                    <Select
                      multiple
                      value={dietaryRestrictions}
                      onChange={handleDietaryRestrictionsChange}
                      label="Dietary Restrictions"
                      renderValue={(selected) => selected.join(', ')}
                    >
                      <MenuItem value="vegetarian">Vegetarian</MenuItem>
                      <MenuItem value="vegan">Vegan</MenuItem>
                      <MenuItem value="gluten-free">Gluten-Free</MenuItem>
                      <MenuItem value="dairy-free">Dairy-Free</MenuItem>
                      <MenuItem value="keto">Keto</MenuItem>
                      <MenuItem value="paleo">Paleo</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Weight Goal</InputLabel>
                    <Select
                      value={weightGoal}
                      onChange={(e) => setWeightGoal(e.target.value)}
                      label="Weight Goal"
                    >
                      <MenuItem value="lose">Lose Weight</MenuItem>
                      <MenuItem value="maintain">Maintain Weight</MenuItem>
                      <MenuItem value="gain">Gain Weight</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Weight (kg)"
                    type="number"
                    value={weight || ''}
                    onChange={(e) => handleWeightChange(parseFloat(e.target.value) || null)}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Daily Calorie Target"
                    type="number"
                    value={calorieTarget}
                    onChange={handleCalorieTargetChange}
                    InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>kcal</Typography> }}
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleSaveProfile}
                      disabled={loading}
                      sx={{ borderRadius: 30 }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Plan Details Dialog */}
          <Dialog
            open={planDialogOpen}
            onClose={handleClosePlanDialog}
            maxWidth="md"
            fullWidth
          >
            {selectedPlan && (
              <>
                <DialogTitle>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 2, color: selectedPlan.color }}>{selectedPlan.icon}</Box>
                      <Typography variant="h6">{selectedPlan.title}</Typography>
                    </Box>
                    <IconButton onClick={handleClosePlanDialog}>
                      <Close />
                    </IconButton>
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Typography variant="body1" paragraph>
                    {selectedPlan.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Chip label={`${selectedPlan.calories} kcal/day`} />
                    <Chip label={selectedPlan.duration} variant="outlined" />
                  </Box>

                  <Typography variant="h6" gutterBottom>Sample Meal Plan:</Typography>
                  <List>
                    {selectedPlan.meals.map((meal, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={meal} />
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Features:</Typography>
                  <List dense>
                    {selectedPlan.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: selectedPlan.color }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClosePlanDialog}>Close</Button>
                  <Button variant="contained" sx={{ borderRadius: 30 }} onClick={() => handleApplyNutritionPlan(selectedPlan)}>
                    Start This Plan
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>

          {/* Meal Entry Dialog */}
          <Dialog
            open={mealDialogOpen}
            onClose={() => setMealDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getMealIcon(mealType)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {selectedMeal ? 'Edit Meal' : 'Add New Meal'}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Meal Name"
                fullWidth
                variant="outlined"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  label="Meal Type"
                >
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                  <MenuItem value="snack">Snack</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Calories"
                type="number"
                fullWidth
                variant="outlined"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    label="Protein (g)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    label="Carbs (g)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    margin="dense"
                    label="Fat (g)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={mealFat}
                    onChange={(e) => setMealFat(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMealDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveMeal}>
                {selectedMeal ? 'Update' : 'Add'} Meal
              </Button>
            </DialogActions>
          </Dialog>

          {/* Plan Application Dialog */}
          <Dialog
            open={mealPlanDialogOpen}
            onClose={() => setMealPlanDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Apply Nutrition Plan
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                Are you sure you want to apply the "{selectedPlanForMeal?.title}" plan starting from {new Date(selectedDate).toLocaleDateString()}?
              </Typography>
              <Alert severity="info">
                This will update your daily calorie target to {selectedPlanForMeal?.calories} kcal and provide meal recommendations based on your goals.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setMealPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleConfirmPlanApplication} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Apply Plan'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default Nutrition;
