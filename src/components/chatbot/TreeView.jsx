import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Collapse,
  IconButton,
  Chip,
  useTheme
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Timeline,
  School,
  Sports,
  History,
  Build,
  FitnessCenter
} from '@mui/icons-material';

const TreeNode = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const theme = useTheme();

  const hasChildren = node.children && node.children.length > 0;

  // Get appropriate icon based on content
  const getIcon = () => {
    if (node.title?.toLowerCase().includes('career') || node.title?.toLowerCase().includes('path')) {
      return <School sx={{ fontSize: 18, color: theme.palette.primary.main }} />;
    }
    if (node.title?.toLowerCase().includes('rules') || node.title?.toLowerCase().includes('basic')) {
      return <Sports sx={{ fontSize: 18, color: theme.palette.secondary.main }} />;
    }
    if (node.title?.toLowerCase().includes('history') || node.title?.toLowerCase().includes('origin')) {
      return <History sx={{ fontSize: 18, color: theme.palette.info.main }} />;
    }
    if (node.title?.toLowerCase().includes('equipment') || node.title?.toLowerCase().includes('gear')) {
      return <Build sx={{ fontSize: 18, color: theme.palette.warning.main }} />;
    }
    if (node.title?.toLowerCase().includes('training') || node.title?.toLowerCase().includes('fitness')) {
      return <FitnessCenter sx={{ fontSize: 18, color: theme.palette.success.main }} />;
    }
    return <Timeline sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
  };

  // Get color based on level
  const getLevelColor = () => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.success.main
    ];
    return colors[level % colors.length] || theme.palette.text.primary;
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Paper
        elevation={level === 0 ? 2 : 1}
        sx={{
          p: level === 0 ? 2 : 1.5,
          ml: level * 3,
          borderLeft: level > 0 ? `3px solid ${getLevelColor()}` : 'none',
          backgroundColor: level === 0 ? theme.palette.background.paper : theme.palette.grey[50],
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            transform: 'translateX(2px)'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: hasChildren ? 'pointer' : 'default',
            minHeight: 40
          }}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {hasChildren && (
            <IconButton size="small" sx={{ mr: 1, p: 0.5 }}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
          {!hasChildren && <Box sx={{ width: 32 }} />} {/* Spacer for alignment */}

          <Box sx={{ mr: 1.5 }}>
            {getIcon()}
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant={level === 0 ? "h6" : level === 1 ? "subtitle1" : "body1"}
              sx={{
                fontWeight: level === 0 ? 600 : level === 1 ? 500 : 400,
                color: getLevelColor(),
                mb: node.description ? 0.5 : 0
              }}
            >
              {node.title}
            </Typography>

            {node.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.4 }}
              >
                {node.description}
              </Typography>
            )}

            {/* Display additional details */}
            {node.details && node.details.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {node.details.map((detail, idx) => (
                  <Chip
                    key={idx}
                    label={detail}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5, fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            )}

            {/* Display requirements */}
            {node.requirements && node.requirements.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {node.requirements.map((req, idx) => (
                  <Chip
                    key={idx}
                    label={req}
                    size="small"
                    color="primary"
                    variant="filled"
                    sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            )}

            {/* Display timeline */}
            {node.timeline && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={`Timeline: ${node.timeline}`}
                  size="small"
                  color="secondary"
                  sx={{ fontSize: '0.7rem' }}
                />
              </Box>
            )}

            {/* Display sources */}
            {node.sources && node.sources.length > 0 && (
              <Box sx={{ mt: 1 }}>
                {node.sources.map((source, idx) => (
                  <Chip
                    key={idx}
                    label={source}
                    size="small"
                    variant="outlined"
                    color="info"
                    sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Render children */}
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

const TreeView = ({ data }) => {
  const theme = useTheme();

  if (!data) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          No tree data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          color: theme.palette.primary.main
        }}
      >
        <Timeline sx={{ mr: 1 }} />
        Interactive Roadmap
      </Typography>
      <TreeNode node={data} />
    </Box>
  );
};

export default TreeView;
