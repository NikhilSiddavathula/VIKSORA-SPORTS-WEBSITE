import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import EnhancedNavbarWithAdmin from './components/common/EnhancedNavbarWithAdmin';

// Create a basic theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC',
      dark: '#004499',
    },
    secondary: {
      main: '#FF6B35',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Mock context providers
const MockAuthProvider = ({ children }) => {
  const mockAuthValue = {
    user: null,
    logout: () => {},
    isAuthenticated: false,
    login: () => {},
    adminLogin: () => {},
    loading: false,
  };

  return (
    <div>
      {React.cloneElement(children, { authContext: mockAuthValue })}
    </div>
  );
};

const MockTranslationProvider = ({ children }) => {
  const mockTranslationValue = {
    t: (key) => {
      const translations = {
        home: 'Home',
        about: 'About',
        games: 'Games',
        fitness: 'Fitness',
        trainers: 'Trainers',
        nutrition: 'Nutrition',
        store: 'Store',
        sponsorship: 'Sponsorship',
        collaborations: 'Collaborations',
        contact: 'Contact',
        explore: 'Explore',
        language: 'Language',
        english: 'English',
        telugu: 'Telugu',
        hindi: 'Hindi',
      };
      return translations[key] || key;
    },
    language: 'en',
    setLanguage: () => {},
  };

  return (
    <div>
      {React.cloneElement(children, { translationContext: mockTranslationValue })}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MockAuthProvider>
          <MockTranslationProvider>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
              <EnhancedNavbarWithAdmin />
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <h1>VIKSORASPORTS Logo Fix Demo</h1>
                <p>The navbar above should now display the VIKSORASPORTS logo properly.</p>
                <p>If the original logo image fails to load, it will automatically show a fallback logo or text.</p>
              </Box>
            </Box>
          </MockTranslationProvider>
        </MockAuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;