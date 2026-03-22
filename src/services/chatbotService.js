// client/src/services/chatbotService.js
import axios from 'axios';

class ChatbotService {
  constructor() {
    this.apiKey = process.env.VITE_OPENAI_API_KEY; // Will be set up later
    this.baseURL = process.env.VITE_API_URL || 'http://localhost:5000';
  }

  async getCareerGuidance(userMessage) {
    try {
      // Try to use the backend API first
      if (this.baseURL) {
        try {
          const response = await axios.post(`${this.baseURL}/api/chatbot/query`, {
            message: userMessage,
            context: 'sports_knowledge'
          });

          if (response.data && response.data.success) {
            return {
              message: response.data.message,
              hasVisualization: response.data.hasVisualization || false,
              treeData: response.data.treeData || null,
              source: response.data.source || 'api'
            };
          }
        } catch (apiError) {
          console.log('API unavailable, using fallback responses:', apiError.message);
        }
      }

      // Fallback response when API is unavailable
      return {
        message: this.generateFallbackResponse(userMessage),
        hasVisualization: false,
        treeData: null,
        source: 'fallback'
      };

    } catch (error) {
      console.error('Chatbot service error:', error);
      throw new Error('Failed to get sports guidance');
    }
  }

  generateFallbackResponse(message) {
    // Simple fallback response for offline mode
    return `Sorry, the chatbot service is currently unavailable. Please try again later.`;
  }
}

export const chatbotService = new ChatbotService();
