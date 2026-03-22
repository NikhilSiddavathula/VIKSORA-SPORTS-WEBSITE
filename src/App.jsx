import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
// import { GoogleOAuthProvider } from '@react-oauth/google'; // Temporarily disabled
import enhancedTheme from './theme/enhancedTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery, CircularProgress } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TranslationProvider } from './context/TranslationContext';
import EnhancedNavbarWithAdmin from './components/common/EnhancedNavbarWithAdmin';
import Footer from './components/common/Footer';
import FloatingChatButton from './components/chatbot/FloatingChatButton';
import { usePerformanceTracking } from './utils/performanceMonitoring';
import { registerNetworkStatusChangeHandler } from './utils/serviceWorkerRegistration';
import './App.css'; // Import global styles and animations
// import './styles/largeScreenFix.css'; // Import aggressive large screen fixes
// import { autoDebugLargeScreen, forceLargeScreenVisibility } from './utils/debugLargeScreen';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminLogin from './pages/AdminLogin';
// Debug component for troubleshooting
import AuthDebug from './components/debug/AuthDebug';
import AdminDebug from './components/debug/AdminDebug';
import LogoTest from './components/debug/LogoTest'; // Add this import

// Lazy load components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const GameDetail = lazy(() => import('./pages/GameDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Fitness = lazy(() => import('./pages/Fitness'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Trainers = lazy(() => import('./pages/Trainers'));
const About = lazy(() => import('./pages/About'));
const Games = lazy(() => import('./pages/Games'));
const SponsorshipPage = lazy(() => import('./pages/SponsorshipPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CollaborationPage = lazy(() => import('./pages/CollaborationPage'));
const Store = lazy(() => import('./pages/Store'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Loading component for Suspense
const LoadingComponent = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // Track App component performance
  usePerformanceTracking('App');
  
  // Handle network status changes
  useEffect(() => {
    const handleNetworkStatusChange = (isOnline) => {
      // Show toast notification when network status changes
      if (!isOnline) {
        // You could use a toast notification here
        console.log('You are offline. Some features may be limited.');
      } else {
        console.log('You are back online.');
      }
    };
    
    // Register for network status changes
    registerNetworkStatusChangeHandler(handleNetworkStatusChange);
    
    // Debug large screen display issues - TEMPORARILY DISABLED
    // autoDebugLargeScreen();
    // forceLargeScreenVisibility();
    
    // Re-run visibility fix on window resize - TEMPORARILY DISABLED
    // const handleResize = () => {
    //   forceLargeScreenVisibility();
    // };
    
    // window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      // Clean up any event listeners if needed
      // window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <TranslationProvider>
      <AuthProvider>
        <ThemeProvider theme={enhancedTheme}>
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', minWidth: '100vw' }}>
              <EnhancedNavbarWithAdmin />
              <Box component="main" sx={{ flexGrow: 1, width: '100%', minWidth: '100vw' }}>
                <Suspense fallback={<LoadingComponent />}>
                  <Routes>
                    {/* Public Routes - accessible to all */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/fitness" element={<Fitness />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/trainers" element={<Trainers />} />
                    <Route path="/sponsorship" element={<SponsorshipPage />} />
                    <Route path="/collaborations" element={<CollaborationPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/store" element={<Store />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    
                    {/* Admin Login Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* Debug Route for troubleshooting authentication */}
                    <Route path="/debug/auth" element={<AuthDebug />} />
                    
                    {/* Admin Debug Route for troubleshooting admin authentication */}
                    <Route path="/debug/admin" element={<AdminDebug />} />
                    
                    {/* Logo Test Route */}
                    <Route path="/debug/logo" element={<LogoTest />} /> // Add this route
                    
                    {/* Protected Routes - Only for logged-in users */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    
                    {/* Game Detail Route - Now protected */}
                    <Route path="/game/:name" element={
                      <ProtectedRoute>
                        <GameDetail />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes - Only for admin users - Redirecting to AdminPanel */}
                    <Route path="/admin" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                    
                    {/* New Admin Panel Route */}
                    <Route path="/adminpanel" element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } />
                  </Routes>
                </Suspense>
              </Box>
              <Footer />
              
              {/* AI Sports Career Chatbot - Available on all pages */}
              <FloatingChatButton />
            </Box>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}

export default App;