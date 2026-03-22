// API helper utility for development mode
import api from '../services/api';

// For production builds, always use real API

// Create a wrapped API object that uses the mock API when needed
const apiWithFallback = {
  get: async (endpoint) => {
    try {
      return await api.get(endpoint);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      return await api.post(endpoint, data);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // Add a specific method for contact form
  submitContact: async (data) => {
    console.log('Submitting contact form directly to API');
    // Use full URL for contact form to ensure it works
    return fetch('https://api.viksorasports.com/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(async response => {
      // Try to parse the response JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error('Invalid response from server');
      }
      
      console.log('Contact form response:', responseData);
      
      // If response is successful, return the data directly
      if (response.ok && responseData && responseData.success) {
        console.log('Contact form submission successful');
        return responseData; // Return the response directly, not wrapped in .data
      }
      
      // If response is not ok or doesn't contain success, throw an error
      const errorMessage = responseData?.error || responseData?.message || `Network error: ${response.status} ${response.statusText}`;
      console.error('Contact form submission failed:', errorMessage);
      throw new Error(errorMessage);
    })
    .catch(error => {
      console.error('Contact form submission error:', error);
      throw error;
    });
  }
};

export default apiWithFallback;
