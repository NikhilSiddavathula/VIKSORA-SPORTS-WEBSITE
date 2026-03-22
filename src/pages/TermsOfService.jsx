
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  keyframes,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Gavel,
  CheckCircle,
  Warning,
  Info
} from '@mui/icons-material';
import { fadeInUp, scaleIn } from '../utils/animations';

const TermsOfService = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <Info />,
      content: [
        'By accessing and using VIKSORASPORTS, you accept and agree to be bound by the terms and provisions of this agreement',
        'If you do not agree to abide by these terms, please do not use our service',
        'We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes',
        'It is your responsibility to review these terms periodically for updates'
      ]
    },
    {
      title: 'User Accounts',
      icon: <CheckCircle />,
      content: [
        'You must be at least 13 years old to create an account',
        'You are responsible for maintaining the confidentiality of your account credentials',
        'You agree to provide accurate, current, and complete information during registration',
        'You are responsible for all activities that occur under your account',
        'Notify us immediately of any unauthorized use of your account',
        'We reserve the right to suspend or terminate accounts that violate these terms'
      ]
    },
    {
      title: 'Service Usage',
      icon: <Gavel />,
      content: [
        'Use our services for lawful purposes only',
        'Do not use our platform to harass, abuse, or harm others',
        'Respect the intellectual property rights of others',
        'Do not attempt to gain unauthorized access to our systems',
        'Do not interfere with or disrupt our services',
        'Comply with all applicable laws and regulations'
      ]
    },
    {
      title: 'Prohibited Activities',
      icon: <Warning />,
      content: [
        'Sharing false or misleading information',
        'Impersonating any person or entity',
        'Uploading malicious code or viruses',
        'Engaging in fraudulent activities',
        'Violating any local, state, national, or international law',
        'Collecting or harvesting user data without consent'
      ]
    }
  ];

  const keyPoints = [
    'All bookings are subject to availability and confirmation',
    'Payments are processed securely through Razorpay',
    'Refunds are handled according to our refund policy',
    'We reserve the right to modify service prices',
    'Trainers are independent contractors, not employees',
    'We are not liable for injuries during training sessions'
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 6, md: 10 },
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              mb: 3,
              animation: `${scaleIn} 0.6s ease-out`,
            }}
          >
            <Gavel
              sx={{
                fontSize: { xs: 40, md: 50 },
                color: 'white',
              }}
            />
          </Box>
          <Typography
            variant={theme.breakpoints.down('md') ? "h3" : "h2"}
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'white',
              mb: 3,
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            Terms of Service
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 300,
            }}
          >
            Please read these terms carefully before using our platform.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              mt: 2,
            }}
          >
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            mb: 6,
          }}
        >
          {sections.map((section, index) => (
            <Card
              key={index}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: `${fadeInUp} 0.6s ease-out ${index * 0.1}s both`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {section.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.dark,
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {section.content.map((item, idx) => (
                    <ListItem
                      key={idx}
                      sx={{
                        px: 0,
                        py: 0.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 32,
                          color: theme.palette.secondary.main,
                        }}
                      >
                        <CheckCircle fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'text.primary',
                            fontSize: '1rem',
                            lineHeight: 1.8,
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Key Points Section */}
        <Paper
          sx={{
            p: { xs: 3, md: 5 },
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: `${fadeInUp} 0.6s ease-out 0.5s both`,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: theme.palette.primary.dark,
            }}
          >
            Important Points to Remember
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {keyPoints.map((point, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: theme.palette.secondary.main,
                    mr: 2,
                  }}
                />
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  {point}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Disclaimer Section */}
        <Box
          sx={{
            mt: 6,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: `${fadeInUp} 0.6s ease-out 0.6s both`,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.dark,
            }}
          >
            Disclaimer
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
            VIKSORASPORTS provides sports training and fitness services as described on our platform. While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of this information.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
            Any action you take upon the information on our website is strictly at your own risk. We will not be liable for any losses and/or damages in connection with the use of our website.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary' }}>
            Participation in sports and fitness activities involves risk of injury. By using our services, you acknowledge and accept these risks.
          </Typography>
        </Box>

        {/* Contact Section */}
        <Box
          sx={{
            mt: 6,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            animation: `${fadeInUp} 0.6s ease-out 0.7s both`,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: theme.palette.primary.dark,
            }}
          >
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
            If you have any questions about these Terms of Service, please contact us:
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Email: teamviksorasports@gmail.com
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Phone: +91 9030497555
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsOfService;
