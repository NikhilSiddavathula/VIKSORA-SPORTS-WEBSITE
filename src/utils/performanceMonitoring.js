// Performance monitoring utility for VIKSORASPORTS
import React from 'react';

// Check if we should enable performance monitoring (only in development or when explicitly enabled)
const shouldEnablePerformanceMonitoring = () => {
  // Only enable in development or when explicitly enabled via environment variable
  return process.env.NODE_ENV === 'development' || 
         process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true';
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Only initialize if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return;
  }
  
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Track initial page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          trackMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          trackMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
        }

        // Track resource loading (limit to first 50 resources to avoid performance impact)
        const resources = performance.getEntriesByType('resource').slice(0, 50);
        const resourceStats = {
          count: resources.length,
          totalSize: 0,
          totalTime: 0,
          byType: {}
        };

        resources.forEach(resource => {
          resourceStats.totalSize += resource.transferSize || 0;
          resourceStats.totalTime += resource.duration;

          const type = resource.initiatorType || 'other';
          if (!resourceStats.byType[type]) {
            resourceStats.byType[type] = {
              count: 0,
              totalSize: 0,
              totalTime: 0
            };
          }

          resourceStats.byType[type].count++;
          resourceStats.byType[type].totalSize += resource.transferSize || 0;
          resourceStats.byType[type].totalTime += resource.duration;
        });

        trackMetric('resource_count', resourceStats.count);
        trackMetric('resource_total_size', resourceStats.totalSize);
        trackMetric('resource_total_time', resourceStats.totalTime);

        // Track largest contentful paint
        if ('PerformanceObserver' in window) {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            trackMetric('largest_contentful_paint', lastEntry.startTime);
          });

          try {
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          } catch (e) {
            console.warn('LCP observer not supported');
          }
        }

        // Track first input delay
        if ('PerformanceObserver' in window) {
          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              trackMetric('first_input_delay', entry.processingStart - entry.startTime);
            });
          });

          try {
            fidObserver.observe({ type: 'first-input', buffered: true });
          } catch (e) {
            console.warn('FID observer not supported');
          }
        }

        // Track cumulative layout shift
        if ('PerformanceObserver' in window) {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            trackMetric('cumulative_layout_shift', clsValue);
          });

          try {
            clsObserver.observe({ type: 'layout-shift', buffered: true });
          } catch (e) {
            console.warn('CLS observer not supported');
          }
        }
      }, 1000); // Delay metrics collection to avoid blocking initial render
    });

    // Track route changes in SPA (with debouncing)
    if (window.history && window.history.pushState) {
      let routeChangeTimeout;
      
      const originalPushState = window.history.pushState;
      window.history.pushState = function() {
        originalPushState.apply(this, arguments);
        // Debounce route change tracking
        clearTimeout(routeChangeTimeout);
        routeChangeTimeout = setTimeout(trackRouteChange, 100);
      };

      window.addEventListener('popstate', () => {
        clearTimeout(routeChangeTimeout);
        routeChangeTimeout = setTimeout(trackRouteChange, 100);
      });
    }
  }
};

// Track route change performance
const trackRouteChange = () => {
  if (!shouldEnablePerformanceMonitoring()) {
    return;
  }
  
  if ('performance' in window) {
    // Clear previous marks
    performance.clearMarks();
    performance.clearMeasures();

    // Mark the start of route change
    performance.mark('routeChangeStart');

    // Measure when the route change is complete
    setTimeout(() => {
      performance.mark('routeChangeEnd');
      performance.measure('routeChange', 'routeChangeStart', 'routeChangeEnd');
      const measures = performance.getEntriesByName('routeChange');
      if (measures.length > 0) {
        trackMetric('route_change_time', measures[0].duration);
      }
    }, 0);
  }
};

// Track custom metrics
export const trackMetric = (name, value) => {
  // Only track metrics if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return;
  }
  
  // In a real implementation, this would send data to an analytics service
  console.log(`Performance Metric: ${name} = ${value}`);

  // Store metrics locally for analysis (with size limit)
  if (typeof window !== 'undefined') {
    if (!window.viksoraMetrics) {
      window.viksoraMetrics = {};
    }

    if (!window.viksoraMetrics[name]) {
      window.viksoraMetrics[name] = [];
    }

    window.viksoraMetrics[name].push({
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    // Keep only the last 50 entries to avoid memory issues
    if (window.viksoraMetrics[name].length > 50) {
      window.viksoraMetrics[name] = window.viksoraMetrics[name].slice(-50);
    }
  }
};

// Track user interactions
export const trackInteraction = (element, action) => {
  // Only track interactions if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return;
  }
  
  const timestamp = performance.now();
  trackMetric(`interaction_${action}`, timestamp);

  // Track interaction latency
  if ('performance' in window && 'now' in performance) {
    const interactionId = `${element}_${action}_${Date.now()}`;
    performance.mark(`${interactionId}_start`);

    // Set up a listener to track when the interaction completes
    const completeInteraction = () => {
      performance.mark(`${interactionId}_end`);
      performance.measure(
        `interaction_${action}_latency`,
        `${interactionId}_start`,
        `${interactionId}_end`
      );

      const measures = performance.getEntriesByName(`interaction_${action}_latency`);
      if (measures.length > 0) {
        trackMetric(`interaction_${action}_latency`, measures[0].duration);
      }

      // Clean up
      element.removeEventListener('click', completeInteraction);
      element.removeEventListener('touchend', completeInteraction);
    };

    element.addEventListener('click', completeInteraction);
    element.addEventListener('touchend', completeInteraction);
  }
};

// Track API calls
export const trackApiCall = (endpoint, method, duration, status) => {
  // Only track API calls if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return;
  }
  
  trackMetric(`api_${endpoint}_${method}`, duration);

  if (status >= 400) {
    trackMetric(`api_error_${endpoint}_${method}`, status);
  }
};

// Get performance report
export const getPerformanceReport = () => {
  // Only return report if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return null;
  }
  
  if (typeof window === 'undefined' || !window.viksoraMetrics) {
    return null;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    metrics: {}
  };

  // Calculate statistics for each metric
  Object.keys(window.viksoraMetrics).forEach(metricName => {
    const values = window.viksoraMetrics[metricName].map(m => m.value);

    if (values.length > 0) {
      const sorted = [...values].sort((a, b) => a - b);
      const sum = values.reduce((acc, val) => acc + val, 0);

      report.metrics[metricName] = {
        count: values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: sum / values.length,
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
        latest: values[values.length - 1]
      };
    }
  });

  return report;
};

// Track component render time
export const withPerformanceTracking = (Component, componentName) => {
  // Only wrap component if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return Component;
  }
  
  return function TrackedComponent(props) {
    React.useEffect(() => {
      if ('performance' in window) {
        performance.mark(`${componentName}_mount_start`);
      }
    }, []);
    
    React.useEffect(() => {
      if ('performance' in window) {
        performance.mark(`${componentName}_update_start`);
      }
    });
    
    return React.createElement(Component, props);
  };
};

// Hook to track component render performance
export const usePerformanceTracking = (componentName) => {
  // Only track component if performance monitoring is enabled
  if (!shouldEnablePerformanceMonitoring()) {
    return;
  }
  
  React.useEffect(() => {
    if ('performance' in window) {
      performance.mark(`${componentName}_render_start`);

      return () => {
        try {
          performance.mark(`${componentName}_render_end`);
          
          // Check if the start mark exists before measuring
          const marks = performance.getEntriesByName(`${componentName}_render_start`);
          if (marks.length > 0) {
            performance.measure(
              `${componentName}_render`,
              `${componentName}_render_start`,
              `${componentName}_render_end`
            );

            const measures = performance.getEntriesByName(`${componentName}_render`);
            if (measures.length > 0) {
              trackMetric(`component_render_${componentName}`, measures[0].duration);
            }
          } else {
            console.warn(`Performance mark '${componentName}_render_start' not found`);
          }
        } catch (error) {
          console.warn(`Performance tracking error for ${componentName}:`, error.message);
        }
      };
    }
  }, [componentName]);
};

// Initialize performance monitoring when this module is imported
if (typeof window !== 'undefined') {
  initPerformanceMonitoring();
}