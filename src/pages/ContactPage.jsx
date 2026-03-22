// client/src/pages/ContactPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  AccessTime,
  Support,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import apiWithFallback from '../utils/apiHelper'; // Import the API helper with fallback

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const { isAuthenticated } = useAuth();

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contactForm.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!contactForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!contactForm.category) {
      errors.category = 'Category is required';
    }

    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    }

    return errors;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await apiWithFallback.submitContact(contactForm);

      if (response.success) {
        // Check if data was saved to database
        const savedToDatabase = response.data && response.data._id;
        
        if (savedToDatabase) {
          toast.success('✅ Message sent successfully! Your inquiry has been saved to our system and we will get back to you soon.');
        } else {
          toast.success('✅ Message sent successfully! Your inquiry has been logged and we will get back to you soon.');
        }
        
        setSubmitSuccess(true);
        setSubmitError('');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: '',
          priority: 'medium',
        });
        setFormErrors({});
      } else {
        const errorMessage = response.message || 'Failed to send message';
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Extract error message from the error object
      let errorMessage = 'An error occurred while sending your message. Please try again.';
      let showError = true;
      
      // Check if the backup method worked (error might contain success data)
      if (error.response && error.response.data && error.response.data.success) {
        // The backup method worked!
        console.log('Backup contact method worked successfully');
        setSubmitSuccess(true);
        setSubmitError('');
        toast.success('✅ Message sent successfully! Your inquiry has been logged and we will get back to you soon.');
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: '',
          priority: 'medium',
        });
        setFormErrors({});
        setIsSubmitting(false);
        return;
      }
      
      // Try to get the error message from the response if available
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (error.message.includes('Unable to connect to the server')) {
        errorMessage = 'Unable to connect to the server. Please try again later or contact us through email or phone.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('Missing required fields')) {
        errorMessage = 'Please fill in all required fields.';
      } else if (error.message.includes('Database not connected') || error.message.includes('Database connection error')) {
        errorMessage = 'There is a technical issue with our database. Please try again later.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Our team has been notified. Please try again later.';
      }
      
      setSubmitError(errorMessage);
      if (showError) {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form success state after 8 seconds (extended to give users more time to see success)
  useEffect(() => {
    let timer;
    if (submitSuccess) {
      timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 8000); // Extended from 5000 to 8000ms
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [submitSuccess]);

  const contactInfo = [
    {
      icon: <Email />,
      title: 'Email Us',
      details: ['teamviksorasports@gmail.com'],
      description: 'Send us an email anytime',
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      details: ['+91 9030497555'],
      description: 'Mon-Fri 9AM-6PM IST',
    },
    {
      icon: <LocationOn />,
      title: 'Visit Us',
      details: ['VIKSORASPORTS Office', 'Hyderabad, Telangana, India'],
      description: 'By appointment only',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h2" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          We're Here to Help You Succeed
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', fontSize: '1.1rem' }}>
          Have questions, feedback, or need support? Our team is ready to assist you.
          Reach out to us through any of the channels below or fill out our contact form.
        </Typography>
      </Box>

      {/* Contact Information */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Get in Touch
        </Typography>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {React.cloneElement(info.icon, { fontSize: 'large' })}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {info.title}
                </Typography>
                {info.details.map((detail, idx) => (
                  <Typography key={idx} variant="body1" sx={{ mb: 0.5 }}>
                    {detail}
                  </Typography>
                ))}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {info.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contact Form */}
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Send Us a Message
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 4, color: 'text.secondary' }}>
          Fill out the form below and we'll get back to you as soon as possible
        </Typography>

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
            ✅ <strong>Success!</strong> Your message has been sent successfully! Our team has received your inquiry and will respond to you soon.
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={contactForm.name}
                onChange={handleFormChange}
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                size="large"
                InputProps={{ style: { padding: '12px 14px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleFormChange}
                required
                error={!!formErrors.email}
                helperText={formErrors.email}
                size="large"
                InputProps={{ style: { padding: '12px 14px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={contactForm.phone}
                onChange={handleFormChange}
                size="large"
                InputProps={{ style: { padding: '12px 14px' } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!formErrors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={contactForm.category}
                  onChange={handleFormChange}
                  label="Category"
                  size="large"
                >
                  <MenuItem value="general">General Inquiry</MenuItem>
                  <MenuItem value="technical">Technical Support</MenuItem>
                  <MenuItem value="billing">Billing & Payments</MenuItem>
                  <MenuItem value="training">Training & Coaching</MenuItem>
                  <MenuItem value="sponsorship">Sponsorship</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="complaint">Complaint</MenuItem>
                </Select>
                {formErrors.category && (
                  <Typography variant="caption" color="error">
                    {formErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleFormChange}
                required
                error={!!formErrors.subject}
                helperText={formErrors.subject}
                size="large"
                InputProps={{ style: { padding: '12px 14px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={6}
                value={contactForm.message}
                onChange={handleFormChange}
                required
                error={!!formErrors.message}
                helperText={formErrors.message}
                size="large"
                InputProps={{ style: { padding: '12px 14px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={contactForm.priority}
                  onChange={handleFormChange}
                  label="Priority"
                  size="large"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color={submitSuccess ? "success" : "primary"}
                size="large"
                startIcon={submitSuccess ? <CheckCircle /> : <Send />}
                disabled={isSubmitting}
                fullWidth
                sx={{
                  py: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Sending Message...
                  </>
                ) : submitSuccess ? (
                  <>
                    ✅ Message Sent Successfully!
                  </>
                ) : (
                  <>
                    <Send sx={{ mr: 1 }} />
                    Send Message
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ContactPage;