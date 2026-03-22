import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  AdminPanelSettings as AdminIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Handshake as HandshakeIcon,
  ContactPage as ContactIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchSponsorships,
  fetchCollaborationRequests,
  fetchContactSubmissions,
  fetchTrainerApplications,
  createTrainerApplication,
  approveTrainerApplication,
  rejectTrainerApplication,
  deleteTrainerApplication
} from '../services/adminService';
import TrainerApplicationsTab from '../components/admin/TrainerApplicationsTab';

// Styled components
const StatsCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: 'white',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
  '.MuiCardContent-root': {
    textAlign: 'center',
  }
}));

// TabPanel component
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`admin-tabpanel-${index}`}
    aria-labelledby={`admin-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true); // Auto-refresh toggle state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view');
  const [selectedItem, setSelectedItem] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingSponsorships: 0,
    pendingCollaborations: 0,
    newContacts: 0,
    pendingTrainerApplications: 0
  });
  
  const [users, setUsers] = useState([]);
  const [trainerApplications, setTrainerApplications] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [contacts, setContacts] = useState([]);

  // API Configuration
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.viksorasports.com';
  
  // Create API instance with fresh token for each request
  const createApi = () => {
    const token = localStorage.getItem('token');
    console.log('AdminPanel: Creating API instance with token:', token ? 'Present' : 'Missing');
    
    return axios.create({
      baseURL: API_BASE,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
  };

  // Real-time data fetching
  const fetchAllData = async () => {
    try {
      setLoading(true);
      console.log('AdminPanel: Fetching real-time data...');

      // Check if user is still authenticated before making API calls
      if (!isAuthenticated || user?.role !== 'admin') {
        console.log('AdminPanel: User no longer authenticated, using demo data');
        setDemoData();
        return;
      }

      // Create fresh API instance with current token
      const api = createApi();
      
      const [usersRes, trainerApplicationsRes, sponsorshipsRes, collaborationsRes, contactsRes] = await Promise.allSettled([
        api.get('/api/admin/users'),
        fetchTrainerApplications(), // Fetch trainer applications
        api.get('/api/admin/sponsorships'),
        api.get('/api/admin/collaboration-requests'),
        api.get('/api/admin/contact-submissions')
      ]);

      // Process users data
      if (usersRes.status === 'fulfilled') {
        const usersData = usersRes.value.data;
        setUsers(usersData.data || []);
        setStats(prev => ({ ...prev, totalUsers: usersData.count || usersData.data?.length || 0 }));
        console.log('Users loaded:', usersData.count || usersData.data?.length || 0);
      } else {
        console.warn('Users fetch failed:', usersRes.reason);
        setUsers([]);
      }

      // Process trainer applications data
      if (trainerApplicationsRes.status === 'fulfilled') {
        const trainerApplicationsData = trainerApplicationsRes.value.data;
        setTrainerApplications(trainerApplicationsData.data || []);
        const pending = (trainerApplicationsData.data || []).filter(t => t.status === 'pending').length;
        setStats(prev => ({ ...prev, pendingTrainerApplications: pending }));
        console.log('Trainer applications loaded:', trainerApplicationsData.count || trainerApplicationsData.data?.length || 0);
      } else {
        console.warn('Trainer applications fetch failed:', trainerApplicationsRes.reason);
        setTrainerApplications([]);
      }

      // Process sponsorships data
      if (sponsorshipsRes.status === 'fulfilled') {
        const sponsorshipsData = sponsorshipsRes.value.data;
        setSponsorships(sponsorshipsData.data || []);
        const pending = (sponsorshipsData.data || []).filter(s => s.status === 'pending').length;
        setStats(prev => ({ ...prev, pendingSponsorships: pending }));
        console.log('Sponsorships loaded:', sponsorshipsData.count || sponsorshipsData.data?.length || 0);
      } else {
        console.warn('Sponsorships fetch failed:', sponsorshipsRes.reason);
        setSponsorships([]);
      }

      // Process collaborations data
      if (collaborationsRes.status === 'fulfilled') {
        const collaborationsData = collaborationsRes.value.data;
        setCollaborations(collaborationsData.data || []);
        const pending = (collaborationsData.data || []).filter(c => c.status === 'pending').length;
        setStats(prev => ({ ...prev, pendingCollaborations: pending }));
        console.log('Collaborations loaded:', collaborationsData.count || collaborationsData.data?.length || 0);
      } else {
        console.warn('Collaborations fetch failed:', collaborationsRes.reason);
        setCollaborations([]);
      }

      // Process contacts data
      if (contactsRes.status === 'fulfilled') {
        const contactsData = contactsRes.value.data;
        setContacts(contactsData.data || []);
        const newContacts = (contactsData.data || []).filter(c => c.status === 'new').length;
        setStats(prev => ({ ...prev, newContacts }));
        console.log('Contacts loaded:', contactsData.count || contactsData.data?.length || 0);
      } else {
        console.warn('Contacts fetch failed:', contactsRes.reason);
        setContacts([]);
      }

      toast.success('✅ Real-time data loaded successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        console.warn('AdminPanel: Authentication error detected, but continuing with demo data');
        toast.error('❌ Authentication issue detected. Please check your admin credentials.');
      } else {
        toast.error('❌ Failed to load data. Using demo data.');
      }
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  // Helper function to set demo data
  const setDemoData = () => {
    setUsers([
      { _id: 'demo1', name: 'Demo User 1', email: 'user1@demo.com', role: 'player', createdAt: new Date() },
      { _id: 'demo2', name: 'Demo User 2', email: 'user2@demo.com', role: 'trainer', createdAt: new Date() }
    ]);
    setTrainerApplications([
      { _id: 'trainer1', userId: 'demo1', game: 'Cricket', experience: '5 years coaching', qualifications: 'Level 2 Certification', location: 'Mumbai', bio: 'Passionate coach', status: 'pending', createdAt: new Date() }
    ]);
    setSponsorships([
      { _id: 'spon1', company: 'Demo Sports Co', amount: 5000, status: 'pending', createdAt: new Date() }
    ]);
    setCollaborations([
      { _id: 'collab1', organization: 'Demo Org', type: 'partnership', status: 'pending', createdAt: new Date() }
    ]);
    setContacts([
      { _id: 'contact1', name: 'Demo Contact', email: 'contact@demo.com', subject: 'Demo Query', status: 'new', createdAt: new Date() }
    ]);
    setStats({ totalUsers: 2, pendingTrainerApplications: 1, pendingSponsorships: 1, pendingCollaborations: 1, newContacts: 1 });
  };

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
    toast.success('🔄 Data refreshed!');
  };

  // Auto-refresh toggle
  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => {
      const newValue = !prev;
      console.log('AdminPanel: Auto-refresh toggled to:', newValue);
      toast.success(newValue ? '✅ Auto-refresh enabled (5s interval)' : '⏸️ Auto-refresh disabled');
      return newValue;
    });
  };

  // CRUD Operations
  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    try {
      const api = createApi(); // Create fresh API instance
      
      let endpoint = '';
      switch (type) {
        case 'user':
          endpoint = `/api/admin/users/${id}`;
          break;
        case 'sponsorship':
          endpoint = `/api/admin/sponsorships/${id}`;
          break;
        case 'collaboration':
          endpoint = `/api/admin/collaboration-requests/${id}`;
          break;
        case 'contact':
          endpoint = `/api/admin/contact-submissions/${id}`;
          break;
        default:
          toast.error('❌ Invalid item type');
          return;
      }

      const response = await api.delete(endpoint);
      
      if (response.data.success) {
        // Update local state immediately
        switch (type) {
          case 'user':
            setUsers(prev => prev.filter(item => item._id !== id));
            setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            break;
          case 'sponsorship':
            setSponsorships(prev => prev.filter(item => item._id !== id));
            setStats(prev => ({ ...prev, pendingSponsorships: prev.pendingSponsorships - 1 }));
            break;
          case 'collaboration':
            setCollaborations(prev => prev.filter(item => item._id !== id));
            setStats(prev => ({ ...prev, pendingCollaborations: prev.pendingCollaborations - 1 }));
            break;
          case 'contact':
            setContacts(prev => prev.filter(item => item._id !== id));
            setStats(prev => ({ ...prev, newContacts: prev.newContacts - 1 }));
            break;
        }
        
        toast.success(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
      } else {
        toast.error(`❌ Failed to delete ${type}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`❌ Delete error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Status update handler
  const handleStatusUpdate = async (id, status, type) => {
    try {
      const api = createApi();
      
      let endpoint = '';
      switch (type) {
        case 'sponsorship':
          endpoint = `/api/admin/sponsorships/${id}/${status}`;
          break;
        case 'collaboration':
          endpoint = `/api/admin/collaboration-requests/${id}`;
          break;
        case 'contact':
          endpoint = `/api/admin/contact-submissions/${id}`;
          break;
        default:
          toast.error('❌ Invalid status update type');
          return;
      }

      const method = type === 'sponsorship' ? 'post' : 'put';
      const data = type !== 'sponsorship' ? { status } : undefined;
      
      const response = await api[method](endpoint, data);
      
      if (response.data.success) {
        // Update local state
        switch (type) {
          case 'sponsorship':
            setSponsorships(prev => prev.map(item => 
              item._id === id ? { ...item, status } : item
            ));
            break;
          case 'collaboration':
            setCollaborations(prev => prev.map(item => 
              item._id === id ? { ...item, status } : item
            ));
            break;
          case 'contact':
            setContacts(prev => prev.map(item => 
              item._id === id ? { ...item, status } : item
            ));
            break;
        }
        
        toast.success(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} ${status} successfully!`);
      } else {
        toast.error(`❌ Failed to update ${type} status`);
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(`❌ Status update error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Dialog handlers
  const handleOpenDialog = (type, item = null) => {
    console.log('AdminPanel: handleOpenDialog called with:', { type, item });
    console.log('AdminPanel: Current state - openDialog:', openDialog, 'dialogType:', dialogType);
    
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
    
    console.log('AdminPanel: Dialog should now be open. Type:', type);
    
    // Add a small delay to log the updated state
    setTimeout(() => {
      console.log('AdminPanel: Dialog state after update - openDialog:', true, 'dialogType:', type);
    }, 100);
  };

  const handleCloseDialog = () => {
    console.log('AdminPanel: handleCloseDialog called');
    setOpenDialog(false);
    setSelectedItem(null);
    setDialogType('view');
  };

  // Save/Create handler
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Validate required fields for user management
      if (activeTab === 0) { // Users tab
        if (!selectedItem?.name || !selectedItem?.email) {
          toast.error('❌ Name and Email are required fields!');
          setLoading(false);
          return;
        }
        
        if (dialogType === 'add' && !selectedItem?.password) {
          toast.error('❌ Password is required for new users!');
          setLoading(false);
          return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(selectedItem.email)) {
          toast.error('❌ Please enter a valid email address!');
          setLoading(false);
          return;
        }
        
        // Password validation for new users
        if (dialogType === 'add' && selectedItem.password && selectedItem.password.length < 6) {
          toast.error('❌ Password must be at least 6 characters long!');
          setLoading(false);
          return;
        }
      }
      
      let result;
      
      if (dialogType === 'add') {
        // Handle add logic based on tab with immediate database connection
        if (activeTab === 0) { // Users tab
          const userData = {
            name: selectedItem.name,
            email: selectedItem.email,
            password: selectedItem.password,
            phone: selectedItem.phone || '',
            country: selectedItem.country || 'India',
            state: selectedItem.state || '',
            role: selectedItem.role || 'user',
            status: selectedItem.status || 'active'
          };
          
          console.log('Creating new user with data:', userData);
          result = await createUser(userData);
          
          // Handle different response formats
          const newUser = result.data || result.user || result;
          if (newUser && (newUser.id || newUser._id)) {
            setUsers(prev => [...prev, newUser]);
            setStats(prev => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
            toast.success('✅ User created successfully!');
            console.log('User created in database:', newUser);
          } else {
            toast.success('✅ User creation request sent!');
          }
        }
      } else if (dialogType === 'edit') {
        // Handle update logic with immediate database sync
        if (activeTab === 0) { // Users tab
          const userId = selectedItem._id || selectedItem.id;
          const userData = {
            name: selectedItem.name,
            email: selectedItem.email,
            phone: selectedItem.phone || '',
            country: selectedItem.country || 'India',
            state: selectedItem.state || '',
            role: selectedItem.role || 'user',
            status: selectedItem.status || 'active'
          };
          
          console.log('Updating user with ID:', userId, 'Data:', userData);
          result = await updateUser(userId, userData);
          
          // Handle different response formats
          const updatedUser = result.data || result.user || { ...selectedItem, ...userData };
          setUsers(prev => prev.map(user => 
            (user._id || user.id) === userId 
              ? updatedUser 
              : user
          ));
          toast.success('✅ User updated successfully!');
          console.log('User updated in database:', updatedUser);
        }
      }
      
      // Close dialog after successful operation
      handleCloseDialog();
      
    } catch (error) {
      console.error('Database operation failed:', error);
      let errorMessage = 'Database operation failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('email already exists') || errorMessage.includes('duplicate')) {
        toast.error('❌ Email address already exists! Please use a different email.');
      } else if (errorMessage.includes('validation')) {
        toast.error('❌ Validation Error: Please check all required fields.');
      } else {
        toast.error(`❌ Database Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };









  // Component initialization and lifecycle
  useEffect(() => {
    console.log('AdminPanel: Component mounted');
    console.log('AdminPanel: Auth status:', isAuthenticated, 'User role:', user?.role);
    
    if (isAuthenticated && user?.role === 'admin') {
      console.log('AdminPanel: Loading initial data...');
      fetchAllData();
    } else {
      console.log('AdminPanel: Using demo data due to auth/role');
      setDemoData();
    }
  }, [isAuthenticated, user]);

  // Auto-refresh effect
  useEffect(() => {
    let interval;
    
    if (autoRefresh && isAuthenticated && user?.role === 'admin') {
      console.log('AdminPanel: Starting auto-refresh (5s interval)');
      interval = setInterval(() => {
        console.log('AdminPanel: Auto-refreshing data...');
        fetchAllData();
      }, 5000);
    }
    
    return () => {
      if (interval) {
        console.log('AdminPanel: Clearing auto-refresh interval');
        clearInterval(interval);
      }
    };
  }, [autoRefresh, isAuthenticated, user]);

  // Check admin access
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography>You need admin privileges to access this panel.</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminIcon fontSize="large" />
            Admin Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time database management • Welcome back, {user?.name}
            {autoRefresh && (
              <Chip 
                label="Auto-refresh ON (5s)" 
                color="success" 
                size="small" 
                icon={<PlayIcon />}
                sx={{ ml: 2 }} 
              />
            )}
            {!autoRefresh && (
              <Chip 
                label="Auto-refresh OFF" 
                color="default" 
                size="small" 
                icon={<PauseIcon />}
                sx={{ ml: 2 }} 
              />
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={autoRefresh ? "contained" : "outlined"}
            color={autoRefresh ? "success" : "primary"}
            startIcon={autoRefresh ? <PauseIcon /> : <PlayIcon />}
            onClick={toggleAutoRefresh}
            size="medium"
          >
            {autoRefresh ? 'Pause Auto-refresh' : 'Start Auto-refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
      </Box>

      {/* Debug Info Panel (remove in production) */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
        <Typography variant="caption" display="block">
          <strong>Debug Info:</strong> Dialog State = {openDialog ? 'OPEN' : 'CLOSED'} | 
          Dialog Type = {dialogType} | 
          Selected Item = {selectedItem ? 'EXISTS' : 'NULL'} |
          Auth = {isAuthenticated ? 'YES' : 'NO'} |
          Role = {user?.role || 'NONE'}
        </Typography>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <PeopleIcon fontSize="large" />
              </Box>
              <Typography variant="h4">{stats.totalUsers}</Typography>
              <Typography variant="body2">Total Users</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <SchoolIcon fontSize="large" />
                {stats.pendingTrainerApplications > 0 && (
                  <Badge badgeContent={stats.pendingTrainerApplications} color="error" />
                )}
              </Box>
              <Typography variant="h4">{stats.pendingTrainerApplications}</Typography>
              <Typography variant="body2">Pending Trainer Applications</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <BusinessIcon fontSize="large" />
                {stats.pendingSponsorships > 0 && (
                  <Badge badgeContent={stats.pendingSponsorships} color="error" />
                )}
              </Box>
              <Typography variant="h4">{stats.pendingSponsorships}</Typography>
              <Typography variant="body2">Pending Sponsorships</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <HandshakeIcon fontSize="large" />
                {stats.pendingCollaborations > 0 && (
                  <Badge badgeContent={stats.pendingCollaborations} color="error" />
                )}
              </Box>
              <Typography variant="h4">{stats.pendingCollaborations}</Typography>
              <Typography variant="body2">Pending Collaborations</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <ContactIcon fontSize="large" />
                {stats.newContacts > 0 && (
                  <Badge badgeContent={stats.newContacts} color="error" />
                )}
              </Box>
              <Typography variant="h4">{stats.newContacts}</Typography>
              <Typography variant="body2">New Contacts</Typography>
            </CardContent>
          </StatsCard>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Users" />
          <Tab label="Trainer Applications" />
          <Tab label="Sponsorships" />
          <Tab label="Collaborations" />
          <Tab label="Contacts" />
        </Tabs>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Users Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Users Management</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => {
                console.log('AdminPanel: Add User button clicked!');
                console.log('AdminPanel: About to call handleOpenDialog("add")');
                handleOpenDialog('add');
              }}
              data-testid="add-user-button"
              sx={{ 
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45a049' }
              }}
            >
              Add User
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar>{user.name?.charAt(0)}</Avatar>
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        color={user.role === 'admin' ? 'error' : user.role === 'trainer' ? 'warning' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('view', user)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog('edit', user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user._id, 'user')} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Trainer Applications Tab */}
        <TabPanel value={activeTab} index={1}>
          <TrainerApplicationsTab 
            trainerApplications={trainerApplications} 
            setTrainerApplications={setTrainerApplications} 
            stats={stats} 
            setStats={setStats}
            users={users}
            loading={loading}
            setLoading={setLoading}
          />
        </TabPanel>

        {/* Sponsorships Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 2 }}>Sponsorship Applications</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sponsorships.map((sponsorship) => (
                  <TableRow key={sponsorship._id}>
                    <TableCell>{sponsorship.company || sponsorship.companyName}</TableCell>
                    <TableCell>${sponsorship.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={sponsorship.status} 
                        color={sponsorship.status === 'approved' ? 'success' : sponsorship.status === 'rejected' ? 'error' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(sponsorship.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleStatusUpdate(sponsorship._id, 'approve', 'sponsorship')} color="success">
                        <ApproveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleStatusUpdate(sponsorship._id, 'reject', 'sponsorship')} color="error">
                        <RejectIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(sponsorship._id, 'sponsorship')} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Collaborations Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>Collaboration Requests</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Organization</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collaborations.map((collaboration) => (
                  <TableRow key={collaboration._id}>
                    <TableCell>{collaboration.organization || collaboration.companyName}</TableCell>
                    <TableCell>{collaboration.type || 'Partnership'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={collaboration.status} 
                        color={collaboration.status === 'approved' ? 'success' : collaboration.status === 'rejected' ? 'error' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(collaboration.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleStatusUpdate(collaboration._id, 'approved', 'collaboration')} color="success">
                        <ApproveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleStatusUpdate(collaboration._id, 'rejected', 'collaboration')} color="error">
                        <RejectIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(collaboration._id, 'collaboration')} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Contacts Tab */}
        <TabPanel value={activeTab} index={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>Contact Submissions</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact._id}>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>
                      <Chip 
                        label={contact.status} 
                        color={contact.status === 'resolved' ? 'success' : contact.status === 'new' ? 'info' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog('view', contact)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleStatusUpdate(contact._id, 'resolved', 'contact')} color="success">
                        <ApproveIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(contact._id, 'contact')} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Add/Edit/View Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        data-testid="admin-dialog"
        onEntered={() => console.log('AdminPanel: Dialog entered (fully opened)')}
        onExited={() => console.log('AdminPanel: Dialog exited (fully closed)')}
      >
        <DialogTitle>
          {dialogType === 'view' ? 'View Details' : 
           dialogType === 'edit' ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          {activeTab === 0 && ( // Users tab
            <Box component="form" sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={selectedItem?.name || ''}
                margin="normal"
                disabled={dialogType === 'view'}
                required
                onChange={(e) => {
                  if (selectedItem) {
                    setSelectedItem(prev => ({ ...prev, name: e.target.value }));
                  } else {
                    setSelectedItem({ name: e.target.value });
                  }
                }}
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={selectedItem?.email || ''}
                margin="normal"
                disabled={dialogType === 'view'}
                required
                onChange={(e) => {
                  setSelectedItem(prev => ({ ...prev, email: e.target.value }));
                }}
              />
              {dialogType === 'add' && (
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  margin="normal"
                  required
                  helperText="Minimum 6 characters"
                  onChange={(e) => {
                    setSelectedItem(prev => ({ ...prev, password: e.target.value }));
                  }}
                />
              )}
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={selectedItem?.phone || ''}
                margin="normal"
                disabled={dialogType === 'view'}
                onChange={(e) => {
                  setSelectedItem(prev => ({ ...prev, phone: e.target.value }));
                }}
              />
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={selectedItem?.country || 'India'}
                margin="normal"
                disabled={dialogType === 'view'}
                onChange={(e) => {
                  setSelectedItem(prev => ({ ...prev, country: e.target.value }));
                }}
              />
              <TextField
                fullWidth
                label="State"
                name="state"
                value={selectedItem?.state || ''}
                margin="normal"
                disabled={dialogType === 'view'}
                onChange={(e) => {
                  setSelectedItem(prev => ({ ...prev, state: e.target.value }));
                }}
              />
              {dialogType !== 'view' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>User Role</InputLabel>
                  <Select
                    name="role"
                    value={selectedItem?.role || 'user'}
                    label="User Role"
                    onChange={(e) => {
                      setSelectedItem(prev => ({ ...prev, role: e.target.value }));
                    }}
                  >
                    <MenuItem value="user">Regular User</MenuItem>
                    <MenuItem value="trainer">Trainer</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                </FormControl>
              )}
              {dialogType !== 'view' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Account Status</InputLabel>
                  <Select
                    name="status"
                    value={selectedItem?.status || 'active'}
                    label="Account Status"
                    onChange={(e) => {
                      setSelectedItem(prev => ({ ...prev, status: e.target.value }));
                    }}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              )}
              {dialogType === 'view' && (
                <>
                  <TextField
                    fullWidth
                    label="User ID"
                    value={selectedItem?._id || selectedItem?.id || 'N/A'}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Join Date"
                    value={selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Last Updated"
                    value={selectedItem?.updatedAt ? new Date(selectedItem.updatedAt).toLocaleDateString() : 'N/A'}
                    margin="normal"
                    disabled
                  />
                </>
              )}
            </Box>
          )}
          
          {selectedItem && activeTab !== 0 && (
            <Box sx={{ pt: 2 }}>
              <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogType !== 'view' && (
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 
               dialogType === 'edit' ? 'Save Changes' : 'Add User'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
