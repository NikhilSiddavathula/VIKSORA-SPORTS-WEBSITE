// Real-time Sports Updates Service
// Integrates with backend API for live updates from official sports websites

import api from './api';

class SportsUpdatesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    this.updateInterval = 60 * 1000; // Update every minute
    this.activePolls = new Set();
  }

  // Get updates for a specific sport from backend API
  async getSportUpdates(sportName, country = 'indian') {
    const cacheKey = `${sportName}_${country}`;
    
    // Check cache first
    const cached = this.getCachedUpdates(cacheKey);
    if (cached) {
      console.log(`Using cached updates for ${sportName}`);
      return cached;
    }

    try {
      console.log(`Fetching real-time updates for ${sportName} from backend API...`);
      
      // Call backend API endpoint
      const response = await api.get(`/sports-updates/${sportName}?limit=15`);
      
      if (response.data && response.data.success) {
        const updates = response.data.data;
        console.log(`Received ${updates.length} real updates for ${sportName}`);
        
        // Cache the results
        this.setCacheUpdates(cacheKey, updates);
        
        return updates;
      } else {
        console.warn(`No updates received for ${sportName}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching real-time updates for ${sportName}:`, error);
      
      // Return empty array instead of fallback data
      return [];
    }
  }

  // Refresh cache for a specific sport
  async refreshSportUpdates(sportName) {
    try {
      console.log(`Refreshing cache for ${sportName}...`);
      
      // Call backend refresh endpoint
      const response = await api.post(`/sports-updates/${sportName}/refresh`);
      
      if (response.data && response.data.success) {
        const updates = response.data.data;
        console.log(`Cache refreshed for ${sportName} - ${updates.length} updates`);
        
        // Update local cache
        this.setCacheUpdates(`${sportName}_indian`, updates);
        
        return updates;
      }
    } catch (error) {
      console.error(`Error refreshing updates for ${sportName}:`, error);
      return [];
    }
  }

  // Cache management
  getCachedUpdates(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCacheUpdates(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  // Utility functions
  generateUpdateId(title, index = 0) {
    // Generate deterministic ID based on title instead of random
    const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 12);
    return `${normalized}-${index}`;
  }

  // Real-time polling for updates
  startRealTimeUpdates(sportName, callback, interval = this.updateInterval) {
    const pollKey = `${sportName}_poll`;
    
    if (this.activePolls.has(pollKey)) {
      return; // Already polling for this sport
    }
    
    this.activePolls.add(pollKey);
    
    const poll = async () => {
      try {
        const updates = await this.getSportUpdates(sportName);
        callback(updates);
      } catch (error) {
        console.error(`Real-time update error for ${sportName}:`, error);
      }
    };
    
    // Initial fetch
    poll();
    
    // Set up interval
    const intervalId = setInterval(poll, interval);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
      this.activePolls.delete(pollKey);
    };
  }

  // Get all available sports
  getAvailableSports() {
    return ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'hockey', 'athletics', 'swimming'];
  }

  // Get source information for a sport
  getSourcesForSport(sportName) {
    // This would return information about sources being used for the sport
    // For now, return indication that we're using backend API
    return [
      {
        name: 'VIKSORASPORTS Backend API',
        description: 'Real-time data from Indian official sports websites',
        type: 'backend_api',
        realTime: true
      }
    ];
  }
}

export default new SportsUpdatesService();