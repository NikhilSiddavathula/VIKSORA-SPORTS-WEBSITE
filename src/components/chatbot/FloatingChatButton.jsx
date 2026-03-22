// client/src/components/chatbot/FloatingChatButton.jsx
import React, { useState } from 'react';
import {
  Fab,
  Badge,
  Zoom,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  SmartToy,
  Close
} from '@mui/icons-material';
import ChatInterface from './ChatInterface';

const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Clear unread count when opening
    }
  };

  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  return (
    <>
      {/* Chat Interface */}
      {isOpen && (
        <ChatInterface 
          onClose={() => setIsOpen(false)}
          onNewMessage={handleNewMessage}
        />
      )}
      
      {/* Floating Action Button */}
      <Zoom in={!isOpen || isMobile}>
        <Fab
          color="primary"
          aria-label="sports career chatbot"
          onClick={handleToggle}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: 1300,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 16px rgba(25, 118, 210, 0.3)',
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error" 
            max={9}
            sx={{
              '& .MuiBadge-badge': {
                right: 8,
                top: 8,
              }
            }}
          >
            {isOpen && isMobile ? (
              <Close sx={{ fontSize: 28 }} />
            ) : (
              <SmartToy sx={{ fontSize: 28 }} />
            )}
          </Badge>
        </Fab>
      </Zoom>
    </>
  );
};

export default FloatingChatButton;