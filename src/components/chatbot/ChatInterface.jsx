import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Chip,
  CircularProgress,
  Fade,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Send,
  Close,
  SmartToy,
  Person,
  Timeline,
  Psychology,
  ExpandMore
} from '@mui/icons-material';
import CareerRoadmapVisualization from './CareerRoadmapVisualization';
import TreeView from './TreeView';
import { chatbotService } from '../../services/chatbotService';

const ChatInterface = ({ onClose, onNewMessage }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '🏆 Welcome to VIKSORASPORTS Career Guidance! I help athletes create personalized career roadmaps. What sport are you interested in?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [careerData, setCareerData] = useState(null);

  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Predefined sport suggestions
  const sportSuggestions = [
    'Cricket', 'Football', 'Tennis', 'Basketball', 'Swimming',
    'Athletics', 'Boxing', 'Badminton', 'Hockey', 'Volleyball'
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Call chatbot service
      const response = await chatbotService.getCareerGuidance(inputValue);

      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          text: response.message,
          timestamp: new Date(),
          hasVisualization: response.hasVisualization,
          careerData: response.careerData,
          treeData: response.treeData,
          source: response.source
        };

        setMessages(prev => [...prev, botMessage]);

        if (response.hasVisualization) {
          setCareerData(response.careerData);
          setShowVisualization(true);
        }

        setIsTyping(false);
        setIsLoading(false);
        onNewMessage?.();
      }, 1500); // Simulate AI processing time

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again or contact our support team.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleSportSuggestionClick = (sport) => {
    setInputValue(`I want to know about ${sport} career path`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const TypingIndicator = () => (
    <ListItem sx={{ py: 1 }}>
      <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
        <SmartToy />
      </Avatar>
      <Box sx={{
        bgcolor: theme.palette.grey[100],
        borderRadius: 2,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Analyzing your question...
        </Typography>
      </Box>
    </ListItem>
  );

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: isMobile ? 0 : 100,
        right: isMobile ? 0 : 24,
        width: isMobile ? '100%' : 400,
        height: isMobile ? '100%' : 600,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        borderRadius: isMobile ? 0 : 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 2,
        bgcolor: theme.palette.primary.main,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy />
          <Box>
            <Typography variant="h6">Sports Knowledge Assistant</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              AI-Powered • 84+ Sports Covered
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Messages */}
      <List sx={{
        flex: 1,
        overflow: 'auto',
        p: 1,
        bgcolor: theme.palette.background.default
      }}>
        {messages.map((message) => (
          <ListItem key={message.id} sx={{ py: 1, alignItems: 'flex-start' }}>
            <Avatar sx={{
              bgcolor: message.type === 'bot' ? theme.palette.primary.main : theme.palette.secondary.main,
              mr: 2,
              mt: 0.5
            }}>
              {message.type === 'bot' ? <SmartToy /> : <Person />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{
                p: 2,
                bgcolor: message.type === 'bot' ? theme.palette.grey[100] : theme.palette.primary.light,
                color: message.type === 'bot' ? 'text.primary' : 'white',
                borderRadius: 2
              }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.text}
                </Typography>

                {/* Tree Structure Display */}
                {message.treeData && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      📊 Structured Information:
                    </Typography>
                    <TreeView data={message.treeData} />
                  </Box>
                )}

                {message.hasVisualization && (
                  <Button
                    startIcon={<Timeline />}
                    variant="outlined"
                    size="small"
                    onClick={() => setShowVisualization(true)}
                    sx={{ mt: 1 }}
                  >
                    View Career Roadmap
                  </Button>
                )}

                {message.source && (
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.7 }}>
                    Source: {message.source}
                  </Typography>
                )}
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Box>
          </ListItem>
        ))}

        {isTyping && <TypingIndicator />}

        {/* Sport Suggestions */}
        {messages.length === 1 && (
          <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Popular Sports:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {sportSuggestions.map((sport) => (
                <Chip
                  key={sport}
                  label={sport}
                  variant="outlined"
                  size="small"
                  onClick={() => handleSportSuggestionClick(sport)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </ListItem>
        )}

        <div ref={messagesEndRef} />
      </List>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about any sport, career path, rules, equipment..."
          variant="outlined"
          size="small"
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                color="primary"
              >
                <Send />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Career Roadmap Visualization Modal */}
      {showVisualization && careerData && (
        <CareerRoadmapVisualization
          open={showVisualization}
          onClose={() => setShowVisualization(false)}
          careerData={careerData}
        />
      )}
    </Paper>
  );
};

export default ChatInterface;
