
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  keyframes,
  Card,
  CardContent
} from '@mui/material';
import {
  Security,
  Lock,
  Shield,
  Visibility
} from '@mui/icons-material';
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from '../utils/animations';

const PrivacyPolicy = () => {
  const theme = useTheme();

  const sections = [
    {
      title: 'Information We Collect',
      icon: <Visibility />,
      content: [
        'Personal Information: Name, email address, phone number, and other contact details you provide when registering',
        'Account Information: Username, password (encrypted), profile information, and preferences',
        'Usage Data: Pages visited, time spent, features used, and other interaction data',
        'Device Information: IP address, browser type, operating system, and device identifiers',
        'Payment Information: Payment details processed securely through Razorpay (we never store your full card details)'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Security />,
      content: [
        'To provide and maintain our sports training and fitness services',
        'To process and manage your bookings and payments',
        'To communicate with you about updates, promotions, and relevant information',
        'To improve our services and develop new features',
        'To ensure security and prevent fraud or unauthorized access',
        'To comply with legal obligations and protect our rights'
      ]
    },
    {
      title: 'Information Sharing',
      icon: <Shield />,
      content: [
        'We never sell your personal information to third parties',
        'We share data only with trusted partners who help us operate our platform',
        'Service providers who assist in payment processing, data analytics, and email delivery',
        'Legal authorities when required by law or to protect our rights',
        'With your explicit consent for specific purposes'
      ]
    },
    {
      title: 'Data Security',
      icon: <Lock />,
      content: [
        'Industry-standard encryption for data transmission (SSL/TLS)',
        'Secure storage with access controls and regular security audits',
        'Regular security updates and vulnerability assessments',
        'Limited access to personal data - only authorized personnel',
        'Secure payment processing through PCI DSS compliant Razorpay',
        'Data backup and disaster recovery procedures'
      ]
    }
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            <Security
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
            Privacy Policy
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
            Your privacy is our top priority. Learn how we protect and handle your personal information.
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
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {section.content.map((item, idx) => (
                    <Typography
                      key={idx}
                      component="li"
                      variant="body1"
                      sx={{
                        mb: 1.5,
                        color: 'text.primary',
                        lineHeight: 1.8,
                        '&::marker': {
                          color: theme.palette.secondary.main,
                        },
                      }}
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Additional Information */}
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
            Your Rights
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {[
              'Right to access your personal information',
              'Right to correct inaccurate information',
              'Right to delete your account and data',
              'Right to opt-out of marketing communications',
              'Right to data portability',
              'Right to object to processing of your data'
            ].map((right, index) => (
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
                  {right}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Contact Section */}
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
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', mb: 2 }}>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;
