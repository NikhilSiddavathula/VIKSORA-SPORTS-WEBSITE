// client/src/pages/SponsorshipPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Group,
  EmojiEvents,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';

const SponsorshipPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [sponsorshipForm, setSponsorshipForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    sport: '',
    experience: '',
    purpose: '',
    detailedPurpose: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { isAuthenticated, user } = useAuth();

  const steps = [
    {
      label: 'Personal Information',
      description: 'Tell us about yourself',
      icon: <Group />,
    },
    {
      label: 'Sponsorship Details',
      description: 'What kind of sponsorship do you need?',
      icon: <EmojiEvents />,
    },
  ];

  useEffect(() => {
    // Pre-fill form with user data if authenticated
    if (isAuthenticated && user) {
      setSponsorshipForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  // Reset success state after 8 seconds
  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 8000); // Extended time to allow users to read the message
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [submitSuccess]);

  const handleFormChange = (e) => {
    setSponsorshipForm({
      ...sponsorshipForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to apply for sponsorship');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Use shared api helper which attaches Authorization header automatically
      const endpoint = '/sponsorships';
      console.log('Posting sponsorship to endpoint:', endpoint);
      const responseData = await api.post(endpoint, sponsorshipForm);
      console.log('Sponsorship response data:', responseData);
      
      // Check the response structure properly
      if (responseData && responseData.success) {
        setSubmitSuccess(true);
        setSubmitError('');
        toast.success('✅ Sponsorship application submitted successfully! Our team will review your application and contact you soon.');
        
        // Reset form
        setSponsorshipForm({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: '',
          sport: '',
          experience: '',
          purpose: '',
          detailedPurpose: '',
        });
        setActiveStep(0);
      } else {
        const errorMessage = responseData?.message || 'Failed to submit sponsorship application';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Sponsorship submission error:', error);
      
      let errorMessage = 'Failed to submit sponsorship application. Please try again.';
      
      // Handle different types of errors
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error.message && error.message.includes('HTTP 404')) {
        errorMessage = 'Sponsorship service endpoint not found. The service may be temporarily unavailable.';
        console.error('404 Error Details:');
        console.error('- Attempted URL:', sponsorshipEndpoint);
        console.error('- Expected backend route: /api/sponsorships');
        console.error('- Check if backend server is running and routes are properly mounted');
        
        // Try to provide additional troubleshooting info
        toast.error('Service temporarily unavailable. Please contact support if this persists.');
      } else if (error.message && error.message.includes('Authentication token not found')) {
        errorMessage = 'Please login again to submit your sponsorship application.';
      } else if (error.message && error.message.includes('HTTP 401')) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.message && error.message.includes('HTTP 403')) {
        errorMessage = 'Access denied. Please ensure you have permission to submit sponsorship applications.';
      } else if (error.message && error.message.includes('HTTP 500')) {
        errorMessage = 'Server error. Our team has been notified. Please try again later.';
      }
      
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            VIKSORA Sponsorship Program
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Empowering Athletes to Achieve Their Dreams
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
            Our sponsorship program is designed to support talented athletes at every level. 
            Fill out the form below to apply for our sponsorship program.
          </Typography>
        </motion.div>
      </Box>
      
      {/* Application Form */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Apply for Sponsorship
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Fill out the form below to apply for our sponsorship program
        </Typography>
        
        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please <Button href="/login">login</Button> to submit your sponsorship application.
          </Alert>
        )}
        
        {submitSuccess && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              animation: 'successSlideIn 0.6s ease-out, successPulse 2s ease-in-out infinite',
              border: '2px solid #4caf50',
              borderRadius: 2,
              fontWeight: 500,
              fontSize: '1rem'
            }}
          >
            ✅ <strong>Success!</strong> Your sponsorship application has been submitted successfully! Our team will review your application and contact you within 5-7 business days.
          </Alert>
        )}
        
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    {index === 0 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Full Name"
                              name="name"
                              value={sponsorshipForm.name}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              type="email"
                              value={sponsorshipForm.email}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <TextField
                              fullWidth
                              label="Phone Number"
                              name="phone"
                              value={sponsorshipForm.phone}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Address"
                              name="address"
                              value={sponsorshipForm.address}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                      </Grid>
                    )}
                    
                    {index === 1 && (
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FormControl fullWidth required>
                              <InputLabel>Name of the Sport</InputLabel>
                              <Select
                                name="sport"
                                value={sponsorshipForm.sport}
                                onChange={handleFormChange}
                                label="Name of the Sport"
                              >
                                <MenuItem value="football">Football</MenuItem>
                                <MenuItem value="cricket">Cricket</MenuItem>
                                <MenuItem value="basketball">Basketball</MenuItem>
                                <MenuItem value="badminton">Badminton</MenuItem>
                                <MenuItem value="tennis">Tennis</MenuItem>
                                <MenuItem value="swimming">Swimming</MenuItem>
                                <MenuItem value="athletics">Athletics</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                              </Select>
                            </FormControl>
                          </motion.div>
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <TextField
                              fullWidth
                              label="Experience"
                              name="experience"
                              multiline
                              rows={3}
                              value={sponsorshipForm.experience}
                              onChange={handleFormChange}
                              placeholder="Describe your experience in this sport..."
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <TextField
                              fullWidth
                              label="Purpose of Sponsorship"
                              name="purpose"
                              value={sponsorshipForm.purpose}
                              onChange={handleFormChange}
                              placeholder="e.g., Training expenses, Equipment, Competition fees"
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <TextField
                              fullWidth
                              label="Detailed Explanation of Purpose"
                              name="detailedPurpose"
                              multiline
                              rows={4}
                              value={sponsorshipForm.detailedPurpose}
                              onChange={handleFormChange}
                              placeholder="Provide detailed information about how you plan to use the sponsorship..."
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </motion.div>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        color="inherit"
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        startIcon={<ArrowBack />}
                      >
                        Back
                      </Button>
                    </motion.div>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          color={submitSuccess ? "success" : "primary"}
                          onClick={handleSubmit}
                          disabled={!isAuthenticated || isSubmitting}
                          startIcon={submitSuccess ? <CheckCircle /> : <CheckCircle />}
                          sx={{
                            py: 1.5,
                            px: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          {isSubmitting ? (
                            'Submitting Application...'
                          ) : submitSuccess ? (
                            '✅ Application Submitted!'
                          ) : (
                            'Submit Application'
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          endIcon={<ArrowForward />}
                        >
                          Next
                        </Button>
                      )}
                    </motion.div>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};

export default SponsorshipPage;