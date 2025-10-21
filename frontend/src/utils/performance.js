// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName, startTime) => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  },

  // Measure API call performance
  measureApiCall: async (apiCall, endpoint) => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall;
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) { // More than 1 second
        console.warn(`Slow API call to ${endpoint}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.error(`API call failed to ${endpoint} after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Debounce function for performance
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for performance
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Performance observer for long tasks
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) { // Tasks longer than 50ms
        console.warn('Long task detected:', {
          duration: entry.duration,
          startTime: entry.startTime
        });
      }
    }
  });
  
  observer.observe({ entryTypes: ['longtask'] });
}
