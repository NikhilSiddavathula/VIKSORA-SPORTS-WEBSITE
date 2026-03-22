// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';

// Initialize service worker for offline functionality
try {
  serviceWorkerRegistration.register({
    onUpdate: (registration) => {
      // Handle service worker updates
      console.log('Service worker updated');
      // Optionally show a notification to the user about the update
    },
    onSuccess: (registration) => {
      console.log('Service worker registered successfully');
    }
  });
} catch (error) {
  console.warn('Service worker registration failed:', error);
}

// Initialize performance monitoring
try {
  initPerformanceMonitoring();
} catch (error) {
  console.warn('Performance monitoring initialization failed:', error);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);