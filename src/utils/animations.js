// client/src/utils/animations.js
import { keyframes } from '@mui/material/styles';

// Define all keyframes first
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const scaleUp = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
`;

export const bounceIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 109, 0, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 109, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 109, 0, 0);
  }
`;

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

export const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const typing = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

export const blinkCursor = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: currentColor;
  }
`;

// Add the missing ripple keyframe
export const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// Stagger animation utility
export const createStaggeredAnimation = (delay = 0.1) => ({
  '&:nth-of-type(1)': { animationDelay: `${delay * 1}s` },
  '&:nth-of-type(2)': { animationDelay: `${delay * 2}s` },
  '&:nth-of-type(3)': { animationDelay: `${delay * 3}s` },
  '&:nth-of-type(4)': { animationDelay: `${delay * 4}s` },
  '&:nth-of-type(5)': { animationDelay: `${delay * 5}s` },
  '&:nth-of-type(6)': { animationDelay: `${delay * 6}s` },
});

// Common animation styles
export const animationStyles = {
  fadeIn: {
    animation: `${fadeIn} 0.6s ease-out`,
  },
  fadeInUp: {
    animation: `${fadeInUp} 0.6s ease-out`,
  },
  fadeInDown: {
    animation: `${fadeInDown} 0.6s ease-out`,
  },
  fadeInLeft: {
    animation: `${fadeInLeft} 0.6s ease-out`,
  },
  fadeInRight: {
    animation: `${fadeInRight} 0.6s ease-out`,
  },
  scaleIn: {
    animation: `${scaleIn} 0.4s ease-out`,
  },
  bounceIn: {
    animation: `${bounceIn} 0.8s ease-out`,
  },
  slideInUp: {
    animation: `${slideInUp} 0.6s ease-out`,
  },
  slideInDown: {
    animation: `${slideInDown} 0.6s ease-out`,
  },
  pulse: {
    animation: `${pulse} 2s ease-in-out infinite`,
  },
  float: {
    animation: `${float} 3s ease-in-out infinite`,
  },
  spin: {
    animation: `${spin} 1s linear infinite`,
  },
};

// Hover effects
export const hoverEffects = {
  lift: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.15)',
    },
  },
  scale: {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  glow: {
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 0 20px rgba(26, 35, 126, 0.3)',
    },
  },
  slideUp: {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
};

// Text effects
export const textEffects = {
  gradient: {
    background: 'linear-gradient(45deg, #1a237e, #ff6d00)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '200% auto',
    animation: `${gradientShift} 3s ease infinite`,
  },
  underline: {
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 0,
      height: '2px',
      backgroundColor: '#ff6d00',
      transition: 'width 0.3s ease',
    },
    '&:hover::after': {
      width: '100%',
    },
  },
};

// Button effects
export const buttonEffects = {
  ripple: {
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '5px',
      height: '5px',
      background: 'rgba(255, 255, 255, 0.5)',
      opacity: 0,
      borderRadius: '100%',
      transform: 'scale(1, 1) translate(-50%)',
      transformOrigin: '50% 50%',
    },
    '&:focus:not(:active)::after': {
      animation: `${ripple} 1s ease-out`,
    },
  },
  slide: {
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.2)',
      transition: 'left 0.5s ease',
    },
    '&:hover::before': {
      left: '100%',
    },
  },
};

export default {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleUp,
  bounceIn,
  slideInUp,
  slideInDown,
  rotate,
  pulse,
  float,
  shake,
  gradientShift,
  spin,
  typing,
  blinkCursor,
  ripple,
  createStaggeredAnimation,
  animationStyles,
  hoverEffects,
  textEffects,
  buttonEffects,
};