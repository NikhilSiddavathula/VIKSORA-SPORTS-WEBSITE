import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Slide,
  Grow,
  Fade,
  InputBase,
  alpha,
  Paper,
  Popper,
  ClickAwayListener,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Sports as SportsIcon,
  FitnessCenter as FitnessCenterIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  HandshakeOutlined as HandshakeOutlinedIcon,
  Groups2Outlined as Groups2OutlinedIcon,
  ContactPhone as ContactPhoneIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  AccountCircle as AccountCircleIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/TranslationContext';
import { sportsData } from '../../data/viksoraSportsMockData';
import Logo from './Logo';
import toast from 'react-hot-toast';

// Styled components with enhanced design
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(12px)',
  color: theme.palette.text.primary,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&.scrolled': {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  }
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  '& .logo-text': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 800,
    fontSize: '1.8rem',
    letterSpacing: '-0.5px',
  },
  // Ensure the logo section is always visible and properly sized
  minHeight: '50px',
  minWidth: '50px',
  // Override any aggressive CSS that might hide the logo
  '& img': {
    display: 'block !important',
    visibility: 'visible !important',
    opacity: '1 !important',
    width: 'auto !important',
    height: '50px !important',
    maxWidth: '200px !important',
    objectFit: 'contain !important',
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  textTransform: 'none',
  margin: '0 3px', // Reduced margin
  padding: '8px 12px', // Reduced padding
  borderRadius: 30,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '0.9rem', // Reduced font size
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'white',
    opacity: 0,
    zIndex: -1,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const AdminButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  margin: '0 4px', // Reduced margin
  padding: '8px 12px', // Reduced padding
  borderRadius: 30,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 4px 10px rgba(244, 67, 54, 0.3)',
  fontSize: '0.9rem', // Reduced font size
  '&:hover': {
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 15px rgba(244, 67, 54, 0.4)',
  },
}));

const AuthButton = styled(Button)(({ theme, variant }) => ({
  fontWeight: 600,
  textTransform: 'none',
  margin: '0 3px', // Reduced margin
  padding: '8px 12px', // Reduced padding
  borderRadius: 30,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '0.9rem', // Reduced font size
  ...(variant === 'outlined' && {
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'white',
      color: theme.palette.primary.main,
      transform: 'translateY(-2px)',
    },
  }),
  ...(variant === 'contained' && {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: 'white',
    '&:hover': {
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 15px rgba(0, 102, 204, 0.4)',
    },
  }),
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.paper,
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95))',
    backdropFilter: 'blur(10px)',
    borderRight: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: `${theme.palette.primary.main}10`,
    color: theme.palette.primary.main,
    transform: 'translateX(5px)',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ExploreButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  textTransform: 'none',
  margin: '0 3px',
  padding: '8px 12px',
  borderRadius: 30,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '0.9rem',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  '&:hover': {
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 30,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

// Traditional games data with image URLs
  const traditionalGames = [
    { id: 1, name: 'Kabaddi', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/kabaddi_kjvz1v.jpg' },
    { id: 2, name: 'Kho Kho', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/kho_kho_v7zj8l.jpg' },
    { id: 3, name: 'Gilli Danda', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/gilli_danda_uzkqg8.jpg' },
    { id: 4, name: 'Pachisi', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/pachisi_kxjg7d.jpg' },
    { id: 5, name: 'Malkhamb', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/malkhamb_xqjz7v.jpg' },
    { id: 6, name: 'Yubi Lakpi', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/yubi_lakpi_kxjg7d.jpg' },
    { id: 7, name: 'Thoda', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/thoda_uzkqg8.jpg' },
    { id: 8, name: 'Kalaripayattu', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/kalaripayattu_v7zj8l.jpg' },
    { id: 9, name: 'Silambam', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/silambam_kjvz1v.jpg' },
    { id: 10, name: 'Mallakhamb', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/mallakhamb_xqjz7v.jpg' },
    { id: 11, name: 'Ashtapada', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/ashtapada_kxjg7d.jpg' },
    { id: 12, name: 'Carrom', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/carrom_m1p30e.jpg' },
    { id: 13, name: 'Chaturanga', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaturanga_sbtzsp.jpg' },
    { id: 14, name: 'Canoeing', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/canoeing_x8gjcs.jpg' },
    { id: 15, name: 'Chaupar', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201927/chaupar_jrrmrv.jpg' },
    { id: 16, name: 'Chess', image: 'https://res.cloudinary.com/dwvwhzahe/image/upload/v1758201928/chess_cyxej0.jpg' }
  ];

  const EnhancedNavbarWithAdmin = () => {
  const { user, logout, isAuthenticated, login, adminLogin, loading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { t, language, setLanguage } = useTranslation();
  
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: '',
    password: ''
  });
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [exploreMenuAnchor, setExploreMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // Handle scroll effect for navbar
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search functionality
  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = sportsData.filter(game =>
      game.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit to 5 results

    setSearchResults(filtered);
    setShowSearchResults(filtered.length > 0);
  }, [searchQuery]);

  // Handle click outside to close search results
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (game) => {
    if (!isAuthenticated) {
      toast.error('Please login to view game details');
      navigate('/login');
      return;
    }

    setShowSearchResults(false);
    setSearchQuery('');
    navigate(`/games/${game._id}`);
  };

  // Main navigation items - always visible on desktop
  const mainNavigationItems = [
    { label: t('home'), path: '/', icon: <HomeIcon /> },
    { label: t('about'), path: '/about', icon: <InfoIcon /> }, // Moved About Us here
    { label: t('games'), path: '/games', icon: <SportsIcon /> },
    { label: t('fitness'), path: '/fitness', icon: <FitnessCenterIcon /> },
    { label: t('trainers'), path: '/trainers', icon: <PersonIcon /> },
  ];

  // Secondary navigation items - might be hidden on smaller screens
  const secondaryNavigationItems = [
    { label: t('nutrition'), path: '/nutrition', icon: <RestaurantIcon /> },
    { label: t('store'), path: '/store', icon: <ShoppingCartIcon /> },
    { label: t('sponsorship'), path: '/sponsorship', icon: <HandshakeOutlinedIcon /> },
    { label: t('collaborations'), path: '/collaborations', icon: <Groups2OutlinedIcon /> },
    { label: t('contact'), path: '/contact', icon: <ContactPhoneIcon /> },
  ];

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleExploreMenuOpen = (event) => {
    setExploreMenuAnchor(event.currentTarget);
  };

  const handleExploreMenuClose = () => {
    setExploreMenuAnchor(null);
  };

  const handleAdminClick = () => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    } else {
      setAdminDialogOpen(true);
      setAdminError('');
    }
  };

  const allNavigationItems = [...mainNavigationItems, ...secondaryNavigationItems];

  const handleAdminLogin = async () => {
    if (!adminCredentials.email || !adminCredentials.password) {
      setAdminError('Please fill in all fields');
      return;
    }
    
    setAdminLoginLoading(true);
    setAdminError('');
    
    try {
      // Use the adminLogin function from AuthContext
      await adminLogin(adminCredentials);
      toast.success('Admin login successful!');
      setAdminDialogOpen(false);
      navigate('/admin');
    } catch (error) {
      setAdminError(error.message || 'Invalid admin credentials');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAdminDialogClose = () => {
    setAdminDialogOpen(false);
    setAdminCredentials({ email: '', password: '' });
    setAdminError('');
  };

  const renderDesktopNavigation = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: isLargeScreen ? 1 : 0.5, flexWrap: 'nowrap' }}>
      {/* Explore Button with Dropdown */}
      <ExploreButton
        onClick={handleExploreMenuOpen}
        endIcon={<ExpandMoreIcon />}
      >
        {t('explore')}
      </ExploreButton>
      <Menu
        anchorEl={exploreMenuAnchor}
        open={Boolean(exploreMenuAnchor)}
        onClose={handleExploreMenuClose}
        TransitionComponent={Grow}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 0,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            minWidth: 200,
            overflow: 'hidden',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {allNavigationItems.map((item) => (
          <StyledMenuItem
            key={item.path}
            component={Link}
            to={item.path}
            onClick={handleExploreMenuClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </StyledMenuItem>
        ))}
        {isAuthenticated && (
          <>
            <Divider />
            <StyledMenuItem
              component={Link}
              to="/dashboard"
              onClick={handleExploreMenuClose}
            >
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </StyledMenuItem>
          </>
        )}
        <Divider />
        <StyledMenuItem
          component={Link}
          to="/admin/login"
          onClick={handleExploreMenuClose}
        >
          <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
          <ListItemText>Admin Login</ListItemText>
        </StyledMenuItem>
        <Divider />
        <Box sx={{ px: 1, py: 0.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            {t('language')}
          </Typography>
          <MenuItem
            selected={language === 'en'}
            onClick={() => setLanguage('en')}
            sx={{ py: 0.75, borderRadius: 1 }}
          >
            <ListItemIcon>
              {language === 'en' && <CheckCircle fontSize="small" color="primary" />}
            </ListItemIcon>
            <ListItemText>{t('english')}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={language === 'te'}
            onClick={() => setLanguage('te')}
            sx={{ py: 0.75, borderRadius: 1 }}
          >
            <ListItemIcon>
              {language === 'te' && <CheckCircle fontSize="small" color="primary" />}
            </ListItemIcon>
            <ListItemText>{t('telugu')}</ListItemText>
          </MenuItem>
          <MenuItem
            selected={language === 'hi'}
            onClick={() => setLanguage('hi')}
            sx={{ py: 0.75, borderRadius: 1 }}
          >
            <ListItemIcon>
              {language === 'hi' && <CheckCircle fontSize="small" color="primary" />}
            </ListItemIcon>
            <ListItemText>{t('hindi')}</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
      
      {/* Search Bar */}
      <Box ref={searchRef} sx={{ position: 'relative' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search games…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchQuery.trim() !== '') {
                  navigate(`/games?search=${encodeURIComponent(searchQuery.trim())}`);
                  setShowSearchResults(false);
                  setSearchQuery('');
                }
              }
            }}
          />
        </Search>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              maxHeight: 300,
              overflow: 'auto',
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            {searchResults.map((game) => (
              <MenuItem
                key={game._id}
                onClick={() => handleSearchResultClick(game)}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 32,
                      height: 32,
                      fontSize: '1rem'
                    }}
                  >
                    {game.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={game.name}
                  secondary={game.type}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: theme.palette.text.secondary,
                  }}
                />
              </MenuItem>
            ))}
          </Paper>
        )}
      </Box>
      

      
      {isAuthenticated ? (
        <>
          <IconButton
            onClick={handleUserMenuOpen}
            sx={{
              ml: 0.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                color: theme.palette.primary.main,
              }
            }}
            color="primary"
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            TransitionComponent={Grow}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                minWidth: 200,
                overflow: 'hidden',
              }
            }}
          >
            <StyledMenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </StyledMenuItem>
            <StyledMenuItem onClick={() => { navigate('/dashboard'); handleUserMenuClose(); }}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText>Dashboard</ListItemText>
            </StyledMenuItem>
            <Divider />
            <StyledMenuItem onClick={handleLogout}>
              <ListItemIcon><CloseIcon /></ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </StyledMenuItem>
          </Menu>
        </>
      ) : (
        <AuthButton
          variant="contained"
          component={Link}
          to="/login"
        >
          Login
        </AuthButton>
      )}
    </Box>
  );

  const renderMobileNavigation = () => (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setMobileMenuOpen(true)}
        sx={{
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            color: theme.palette.primary.main,
          }
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      
      <StyledDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        TransitionComponent={Slide}
        transitionDuration={300}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <List>
            {/* All navigation items in mobile menu */}
            {[...mainNavigationItems, ...secondaryNavigationItems].map((item) => (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                    color: theme.palette.primary.main,
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            
            <Divider sx={{ my: 1 }} />
            
            {/* Admin Button in Mobile - Removed */}
            {/* <ListItem
              onClick={() => { handleAdminClick(); setMobileMenuOpen(false); }}
              sx={{ 
                cursor: 'pointer', 
                color: theme.palette.error.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: `${theme.palette.error.main}10`,
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItem> */}
            
            <Divider sx={{ my: 1 }} />
            
            {/* Admin Login Button */}
            <ListItem
              component={Link}
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ 
                textDecoration: 'none', 
                color: theme.palette.error.main,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: `${theme.palette.error.main}10`,
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Admin Login" />
            </ListItem>
            
            <Divider sx={{ my: 1 }} />
            
            {isAuthenticated ? (
              <>
                <ListItem
                  component={Link}
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem
                  component={Link}
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  sx={{ 
                    cursor: 'pointer',
                    color: theme.palette.error.main,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${theme.palette.error.main}10`,
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <CloseIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem
                  component={Link}
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem
                  component={Link}
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </StyledDrawer>
    </>
  );

  return (
    <>
      <StyledAppBar position="sticky" top={0} className={scrolled ? 'scrolled' : ''}>
        <Toolbar>
          <Logo 
            onClick={() => navigate('/')} 
            sx={{ 
              flexGrow: isMobile ? 1 : 0, 
              mr: isMobile ? 0 : 2 
            }} 
          />
          
          {isMobile ? renderMobileNavigation() : (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Left side can be empty or have other nav items if needed */}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {renderDesktopNavigation()}
              </Box>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
      
      {/* Admin Login Dialog */}
      <Dialog 
        open={adminDialogOpen} 
        onClose={handleAdminDialogClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
          color: 'white',
          py: 2,
          px: 3,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Admin Login</Typography>
          </Box>
          <IconButton onClick={handleAdminDialogClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {adminError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {adminError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            value={adminCredentials.email}
            onChange={(e) => setAdminCredentials({ ...adminCredentials, email: e.target.value })}
            margin="normal"
            disabled={adminLoginLoading}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.error.main,
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.error.main,
                    borderWidth: 2,
                  },
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Admin Password"
            type="password"
            value={adminCredentials.password}
            onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
            margin="normal"
            disabled={adminLoginLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAdminLogin();
              }
            }}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.error.main,
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.error.main,
                    borderWidth: 2,
                  },
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleAdminDialogClose} 
            disabled={adminLoginLoading}
            sx={{ 
              borderRadius: 8,
              fontWeight: 600,
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAdminLogin}
            disabled={adminLoginLoading}
            startIcon={adminLoginLoading ? <CircularProgress size={20} /> : <AdminPanelSettingsIcon />}
            sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
              borderRadius: 8,
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: '0 4px 10px rgba(244, 67, 54, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(244, 67, 54, 0.4)',
              },
            }}
          >
            {adminLoginLoading ? 'Logging in...' : 'Login as Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnhancedNavbarWithAdmin;