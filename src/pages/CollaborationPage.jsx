import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  Send,
  ArrowForward,
  ArrowBack,
  Business,
  Email,
  Phone,
  Language,
  Person,
  Schedule,
  AccountBalanceWallet,
  Description,
  TrendingUp,
} from '@mui/icons-material';
import { useSpring, animated } from 'react-spring';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CollaborationPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [collaborationForm, setCollaborationForm] = useState({
    organizationName: '',
    collaborationType: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    purpose: '',
    timeline: '',
    budget: '',
    detailedProposal: '',
    expectedOutcome: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { user } = useAuth();

  // Form steps
  const steps = [
    {
      label: 'Organization Details',
      description: 'Provide information about your organization',
    },
    {
      label: 'Contact Information',
      description: 'Enter your contact details',
    },
    {
      label: 'Collaboration Details',
      description: 'Specify your collaboration requirements',
    },
    {
      label: 'Proposal',
      description: 'Describe your collaboration proposal',
    },
  ];

  // Handle form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCollaborationForm({
      ...collaborationForm,
      [name]: value,
    });
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (activeStep === 0) {
      if (!collaborationForm.organizationName.trim()) {
        errors.organizationName = 'Organization name is required';
      }
      if (!collaborationForm.collaborationType) {
        errors.collaborationType = 'Collaboration type is required';
      }
      if (!collaborationForm.industry) {
        errors.industry = 'Industry is required';
      }
    } else if (activeStep === 1) {
      if (!collaborationForm.contactPerson.trim()) {
        errors.contactPerson = 'Contact person is required';
      }
      if (!collaborationForm.email.trim()) {
        errors.email = 'Email is required';
      } else if (!emailRegex.test(collaborationForm.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!collaborationForm.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!phoneRegex.test(collaborationForm.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
      if (!collaborationForm.website.trim()) {
        errors.website = 'Website is required';
      }
    } else if (activeStep === 2) {
      if (!collaborationForm.purpose.trim()) {
        errors.purpose = 'Purpose of collaboration is required';
      }
      if (!collaborationForm.timeline.trim()) {
        errors.timeline = 'Timeline is required';
      }
    } else if (activeStep === 3) {
      if (!collaborationForm.detailedProposal.trim()) {
        errors.detailedProposal = 'Detailed proposal is required';
      }
      if (!collaborationForm.expectedOutcome.trim()) {
        errors.expectedOutcome = 'Expected outcome is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Get the current user's ID if logged in
      const userId = user ? user.id : null;

      // Prepare form data with user ID if available
      const formData = {
        ...collaborationForm,
        userId: userId,
      };

      // Submit the form
      const response = await api.post('/api/collaborations', formData);

      if (response.success) {
        setSubmitSuccess(true);
        toast.success('Your collaboration proposal has been submitted successfully!');

        // Reset form after successful submission
        setCollaborationForm({
          organizationName: '',
          collaborationType: '',
          industry: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          purpose: '',
          timeline: '',
          budget: '',
          detailedProposal: '',
          expectedOutcome: '',
        });

        // Reset form state
        setActiveStep(0);
      } else {
        throw new Error(response.message || 'Failed to submit collaboration proposal');
      }
    } catch (error) {
      setSubmitError(error.message || 'An error occurred while submitting your proposal');
      toast.error(error.message || 'Failed to submit collaboration proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form success state after 5 seconds
  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [submitSuccess]);

  // Animation styles
  const fadeInLeft = (delay = 0) => useSpring({
    opacity: 1,
    x: 0,
    from: { opacity: 0, x: -20 },
    config: { duration: 300, delay: delay * 100 }
  });

  const buttonHover = useSpring({
    scale: 1,
    from: { scale: 1 },
    to: { scale: 1.05 },
    config: { tension: 300, friction: 10 }
  });

  const buttonPress = useSpring({
    scale: 1,
    from: { scale: 1 },
    to: { scale: 0.95 },
    config: { tension: 300, friction: 10 }
  });

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Submit Collaboration Proposal
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Tell us about your organization and how we can work together
        </Typography>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your collaboration proposal has been submitted successfully! Our team will review it and get back to you soon.
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
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <animated.div style={fadeInLeft(0)}>
                            <TextField
                              fullWidth
                              label="Organization Name"
                              name="organizationName"
                              value={collaborationForm.organizationName}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.organizationName}
                              helperText={formErrors.organizationName}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.1)}>
                            <FormControl fullWidth required error={!!formErrors.collaborationType}>
                              <InputLabel>Collaboration Type</InputLabel>
                              <Select
                                name="collaborationType"
                                value={collaborationForm.collaborationType}
                                onChange={handleFormChange}
                                label="Collaboration Type"
                              >
                                <MenuItem value="educational">Educational Partnership</MenuItem>
                                <MenuItem value="corporate">Corporate Partnership</MenuItem>
                                <MenuItem value="brand">Brand Promotion</MenuItem>
                                <MenuItem value="strategic">Strategic Alliance</MenuItem>
                                <MenuItem value="technology">Technology Partnership</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                              </Select>
                              {formErrors.collaborationType && (
                                <Typography variant="caption" color="error">
                                  {formErrors.collaborationType}
                                </Typography>
                              )}
                            </FormControl>
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.2)}>
                            <FormControl fullWidth>
                              <InputLabel>Industry</InputLabel>
                              <Select
                                name="industry"
                                value={collaborationForm.industry}
                                onChange={handleFormChange}
                                label="Industry"
                              >
                                <MenuItem value="education">Education</MenuItem>
                                <MenuItem value="healthcare">Healthcare</MenuItem>
                                <MenuItem value="technology">Technology</MenuItem>
                                <MenuItem value="fitness">Fitness & Wellness</MenuItem>
                                <MenuItem value="sports">Sports Equipment</MenuItem>
                                <MenuItem value="media">Media & Entertainment</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                              </Select>
                            </FormControl>
                          </animated.div>
                        </Grid>
                      </Grid>
                    )}

                    {index === 1 && (
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0)}>
                            <TextField
                              fullWidth
                              label="Contact Person"
                              name="contactPerson"
                              value={collaborationForm.contactPerson}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.contactPerson}
                              helperText={formErrors.contactPerson}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.1)}>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              type="email"
                              value={collaborationForm.email}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.email}
                              helperText={formErrors.email}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.2)}>
                            <TextField
                              fullWidth
                              label="Phone"
                              name="phone"
                              value={collaborationForm.phone}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.phone}
                              helperText={formErrors.phone}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.3)}>
                            <TextField
                              fullWidth
                              label="Website"
                              name="website"
                              value={collaborationForm.website}
                              onChange={handleFormChange}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.website}
                              helperText={formErrors.website}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                      </Grid>
                    )}

                    {index === 2 && (
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <animated.div style={fadeInLeft(0)}>
                            <TextField
                              fullWidth
                              label="Purpose of Collaboration"
                              name="purpose"
                              value={collaborationForm.purpose}
                              onChange={handleFormChange}
                              multiline
                              rows={3}
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.purpose}
                              helperText={formErrors.purpose}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.1)}>
                            <TextField
                              fullWidth
                              label="Timeline"
                              name="timeline"
                              value={collaborationForm.timeline}
                              onChange={handleFormChange}
                              placeholder="e.g., 6 months, 1 year"
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <animated.div style={fadeInLeft(0.2)}>
                            <TextField
                              fullWidth
                              label="Budget Range (Optional)"
                              name="budget"
                              value={collaborationForm.budget}
                              onChange={handleFormChange}
                              placeholder="e.g., ₹1-5 lakhs, ₹5-10 lakhs"
                              variant="outlined"
                              sx={{ mb: 2 }}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                      </Grid>
                    )}

                    {index === 3 && (
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <animated.div style={fadeInLeft(0)}>
                            <TextField
                              fullWidth
                              label="Detailed Proposal"
                              name="detailedProposal"
                              multiline
                              rows={5}
                              value={collaborationForm.detailedProposal}
                              onChange={handleFormChange}
                              placeholder="Provide detailed information about your collaboration proposal, including objectives, target audience, and implementation plan..."
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.detailedProposal}
                              helperText={formErrors.detailedProposal}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                        <Grid item xs={12}>
                          <animated.div style={fadeInLeft(0.1)}>
                            <TextField
                              fullWidth
                              label="Expected Outcome"
                              name="expectedOutcome"
                              multiline
                              rows={3}
                              value={collaborationForm.expectedOutcome}
                              onChange={handleFormChange}
                              placeholder="What do you expect to achieve from this collaboration?"
                              required
                              variant="outlined"
                              sx={{ mb: 2 }}
                              error={!!formErrors.expectedOutcome}
                              helperText={formErrors.expectedOutcome}
                              InputProps={{ style: { padding: '12px 14px' } }}
                            />
                          </animated.div>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <animated.div 
                      style={buttonHover}
                      onMouseEnter={() => buttonHover.start({ scale: 1.05 })}
                      onMouseLeave={() => buttonHover.start({ scale: 1 })}
                      onMouseDown={() => buttonPress.start({ scale: 0.95 })}
                      onMouseUp={() => buttonPress.start({ scale: 1 })}
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
                    </animated.div>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <animated.div 
                      style={buttonHover}
                      onMouseEnter={() => buttonHover.start({ scale: 1.05 })}
                      onMouseLeave={() => buttonHover.start({ scale: 1 })}
                      onMouseDown={() => buttonPress.start({ scale: 0.95 })}
                      onMouseUp={() => buttonPress.start({ scale: 1 })}
                    >
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
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
                    </animated.div>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Container>
  );
};

export default CollaborationPage;