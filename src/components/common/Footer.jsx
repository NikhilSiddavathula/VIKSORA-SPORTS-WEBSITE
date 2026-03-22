// client/src/components/common/Footer.jsx
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  Divider,
  useTheme,
  keyframes,
  TextField, // Added this import
  Button // Added this import
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn, 
  YouTube,
  LocationOn,
  Phone,
  Email,
  Send
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Create animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Footer = () => {
  const theme = useTheme();
  
  // Footer links organized by category
  const footerLinks = {
    explore: [
      { name: 'Home', path: '/' },
      { name: 'Games', path: '/games' },
      { name: 'Trainers', path: '/trainers' },
      { name: 'Programs', path: '/programs' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Press', path: '/press' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    contact: [
      { icon: <LocationOn />, text: 'Hyderabad, Telangana, India' },
      { icon: <Phone />, text: '+91 9030497555' },
      { icon: <Email />, text: 'teamviksorasports@gmail.com' },
    ]
  };

  // Social media links
  const socialLinks = [
    { icon: <Facebook />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <Twitter />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <Instagram />, name: 'Instagram', url: 'https://www.instagram.com/fitwithvikky/' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: <YouTube />, name: 'YouTube', url: 'https://www.youtube.com/@Thevikkyway' },
  ];

  // Newsletter form state would be handled with useState in a real implementation
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Newsletter submission logic would go here
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#0a192f', // Deep blue background
        color: 'white',
        pt: { xs: 8, md: 10 },
        pb: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(64, 85, 193, 0.15) 0%, transparent 50%), 
                             radial-gradient(circle at 90% 80%, rgba(219, 39, 119, 0.15) 0%, transparent 50%)`,
          zIndex: 1,
        }
      }}
      style={{ width: '100vw', maxWidth: 'none' }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }} style={{ maxWidth: 'none', width: '95%' }}>
        {/* Newsletter Section */}
        <Box 
          sx={{ 
            mb: { xs: 6, md: 8 },
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(64, 85, 193, 0.2), rgba(219, 39, 119, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: 'linear-gradient(90deg, #64b5f6, #e91e63)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Stay Connected
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
            Subscribe to our newsletter for the latest updates on sports programs, events, and exclusive offers.
          </Typography>
          
          <Box 
            component="form" 
            onSubmit={handleNewsletterSubmit}
            sx={{ 
              display: 'flex', 
              maxWidth: '500px', 
              mx: 'auto',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Your email address"
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 30,
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={<Send />}
              sx={{
                borderRadius: 30,
                px: 3,
                background: 'linear-gradient(90deg, #64b5f6, #e91e63)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #42a5f5, #d81b60)',
                },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: { xs: 6, md: 8 }, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Main Footer Content */}
        <Grid container spacing={6} sx={{ mb: { xs: 6, md: 8 } }}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  mb: 1,
                  background: 'linear-gradient(90deg, #64b5f6, #e91e63)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                VIKSORA SPORTS
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Empowering athletes and fitness enthusiasts across India with world-class training programs and community support.
              </Typography>
            </Box>

            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.explore.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#64b5f6',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.company.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#64b5f6',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#64b5f6',
                    },
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {footerLinks.contact.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ color: '#e91e63', mt: 0.2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright Section */}
        <Box 
          sx={{ 
            pt: { xs: 4, md: 5 },
            pb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © {new Date().getFullYear()} VIKSORA SPORTS. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                '&:hover': {
                  color: '#64b5f6',
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.8rem',
                '&:hover': {
                  color: '#64b5f6',
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;