// client/src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';
import {
  EmojiEvents,
  Group,
  TrendingUp,
  Verified,
  Lightbulb,
  WorkspacePremium,
  Groups,
  Person,
} from '@mui/icons-material';
import { keyframes } from '@mui/material/styles';
import {
  fadeInUp,
  scaleIn,
  fadeInLeft,
  fadeInRight,
  textEffects
} from '../utils/animations';

// Create custom animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: <Group />, value: '10,000+', label: 'Active Users' },
    { icon: <EmojiEvents />, value: '500+', label: 'Certified Trainers' },
    { icon: <TrendingUp />, value: '50+', label: 'Sports Categories' },
    { icon: <Verified />, value: '99%', label: 'Success Rate' },
  ];

  const whatWeOffer = [
    {
      icon: <Person fontSize="large" />,
      title: "Professional Training",
      description: "Connect with certified trainers across various sports disciplines. Get personalized coaching sessions tailored to your skill level and goals."
    },
    {
      icon: <WorkspacePremium fontSize="large" />,
      title: "Comprehensive Programs",
      description: "Access structured fitness and nutrition programs designed by experts. From beginner to advanced levels, we have something for everyone."
    },
    {
      icon: <Groups fontSize="large" />,
      title: "Community Support",
      description: "Join a vibrant community of athletes and fitness enthusiasts. Share experiences, get motivated, and achieve your goals together."
    }
  ];

  const values = [
    {
      icon: <EmojiEvents />,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do"
    },
    {
      icon: <Verified />,
      title: "Integrity",
      description: "We build trust through transparency and honest communication"
    },
    {
      icon: <Lightbulb />,
      title: "Innovation",
      description: "We embrace technology to enhance the sports experience"
    },
    {
      icon: <Groups />,
      title: "Community",
      description: "We believe in the power of collective growth and support"
    }
  ];

  return (
    <Box sx={{
      pt: 8,
      pb: 12,
      background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '300px',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
        zIndex: -1,
      }
    }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              position: 'relative',
              display: 'inline-block',
              mb: 2,
              animation: `${fadeInUp} 0.8s ease-out`,
              opacity: isVisible ? 1 : 0,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: theme.palette.secondary.main,
                borderRadius: '2px',
              }
            }}
          >
            About VIKSORASPORTS
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              fontWeight: 500,
              animation: `${fadeInUp} 0.8s ease-out`,
              opacity: isVisible ? 1 : 0,
            }}
          >
            Empowering Athletes, Building Champions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              animation: `${fadeInUp} 0.8s ease-out`,
              opacity: isVisible ? 1 : 0,
            }}
          >
            VIKSORASPORTS is India's premier sports and fitness platform, dedicated to connecting
            athletes with world-class trainers, providing comprehensive fitness programs, and
            fostering a community of sports enthusiasts.
          </Typography>
        </Box>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                borderRadius: 4,
                animation: `${fadeInLeft} 0.8s ease-out`,
                opacity: isVisible ? 1 : 0,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box
                sx={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: `${theme.palette.primary.main}10`,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  animation: `${float} 3s ease-in-out infinite`,
                }}
              >
                <Lightbulb fontSize="large" />
              </Box>
              <Typography variant="h4" gutterBottom color="primary" fontWeight={600}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                To empower athlete by providing guidance, training and carrier path in achieving their goals.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                borderRadius: 4,
                animation: `${fadeInRight} 0.8s ease-out`,
                opacity: isVisible ? 1 : 0,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box
                sx={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: `${theme.palette.secondary.main}10`,
                  color: theme.palette.secondary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  animation: `${float} 3s ease-in-out infinite`,
                  animationDelay: '0.5s',
                }}
              >
                <WorkspacePremium fontSize="large" />
              </Box>
              <Typography variant="h4" gutterBottom color="primary" fontWeight={600}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                To build a recognised ecosystem of sports excellence by identifying Talent providing elite resources and cutting edge solutions for athletes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Statistics */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 4,
              animation: `${fadeInUp} 0.8s ease-out`,
              opacity: isVisible ? 1 : 0,
            }}
          >
            Our Impact
          </Typography>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    animation: `${fadeInUp} 0.8s ease-out`,
                    opacity: isVisible ? 1 : 0,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                      animation: `${pulse} 2s ease-in-out infinite`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    {React.cloneElement(stat.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography variant="h4" gutterBottom color="primary" fontWeight={700}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* What We Offer */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 4,
              animation: `${fadeInUp} 0.8s ease-out`,
              opacity: isVisible ? 1 : 0,
            }}
          >
            What We Offer
          </Typography>
          <Grid container spacing={3}>
            {whatWeOffer.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 4,
                    animation: `${fadeInUp} 0.8s ease-out`,
                    opacity: isVisible ? 1 : 0,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom color="primary" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Values */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            animation: `${fadeInUp} 0.8s ease-out`,
            opacity: isVisible ? 1 : 0,
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Our Values
          </Typography>
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {values.map((value, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      color: 'white',
                      mb: 2,
                      opacity: 0.9,
                      animation: `${pulse} 2s ease-in-out infinite`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    {React.cloneElement(value.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
