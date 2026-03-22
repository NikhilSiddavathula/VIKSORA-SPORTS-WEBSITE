import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import {
  createTrainerApplication,
  deleteTrainerApplication,
  approveTrainerApplication,
  rejectTrainerApplication
} from '../../services/adminService';

const TrainerApplicationsTab = ({ 
  trainerApplications, 
  setTrainerApplications, 
  stats, 
  setStats,
  users,
  loading,
  setLoading 
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view');
  const [selectedItem, setSelectedItem] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('TrainerApplicationsTab - trainerApplications:', trainerApplications);
    console.log('TrainerApplicationsTab - users:', users);
  }, [trainerApplications, users]);



  // Dialog handlers
  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this trainer application? This action cannot be undone.')) return;

    try {
      setLoading(true);
      const response = await deleteTrainerApplication(id);

      if (response.success) {
        setTrainerApplications(prev => prev.filter(item => item._id !== id));
        setStats(prev => ({ ...prev, pendingTrainerApplications: prev.pendingTrainerApplications - 1 }));
        toast.success('✅ Trainer application deleted successfully!');
      } else {
        toast.error('❌ Failed to delete trainer application');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`❌ Delete error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Status update handler
  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      let response;
      
      if (status === 'approve') {
        response = await approveTrainerApplication(id);
      } else if (status === 'reject') {
        response = await rejectTrainerApplication(id);
      }

      if (response.success) {
        setTrainerApplications(prev => prev.map(item =>
          item._id === id ? { ...item, status: status === 'approve' ? 'approved' : 'rejected' } : item
        ));
        if (status === 'approve' || status === 'reject') {
          setStats(prev => ({ ...prev, pendingTrainerApplications: prev.pendingTrainerApplications - 1 }));
        }
        toast.success(`✅ Trainer application ${status}d successfully!`);
      } else {
        toast.error(`❌ Failed to update trainer application status`);
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(`❌ Status update error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save/Create handler
  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!selectedItem?.userId || !selectedItem?.game || !selectedItem?.experience || 
          !selectedItem?.qualifications || !selectedItem?.location || !selectedItem?.bio) {
        toast.error('❌ All fields are required!');
        setLoading(false);
        return;
      }

      let result;

      if (dialogType === 'add') {
        const applicationData = {
          userId: selectedItem.userId,
          game: selectedItem.game,
          experience: selectedItem.experience,
          qualifications: selectedItem.qualifications,
          location: selectedItem.location,
          bio: selectedItem.bio
        };

        result = await createTrainerApplication(applicationData);

        if (result.success) {
          const newApplication = result.data;
          setTrainerApplications(prev => [...prev, newApplication]);
          setStats(prev => ({ ...prev, pendingTrainerApplications: prev.pendingTrainerApplications + 1 }));
          toast.success('✅ Trainer application created successfully!');
        }
      }

      // Close dialog after successful operation
      handleCloseDialog();

    } catch (error) {
      console.error('Database operation failed:', error);
      let errorMessage = 'Database operation failed';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`❌ Database Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Trainer Applications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': { backgroundColor: '#45a049' }
          }}
        >
          Add Application
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Game</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Applied</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainerApplications.map((application) => {
              // Get user information - either from populated data or by finding in users array
              let user = {};
              if (application.userId && typeof application.userId === 'object') {
                // If userId is populated, it's an object
                user = application.userId;
              } else {
                // If userId is not populated, find in users array
                user = users.find(u => u._id === application.userId) || {};
              }

              return (
                <TableRow key={application._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar>{user.name?.charAt(0) || 'U'}</Avatar>
                      {user.name || 'Unknown User'}
                    </Box>
                  </TableCell>
                  <TableCell>{application.game}</TableCell>
                  <TableCell>{application.experience.substring(0, 50)}...</TableCell>
                  <TableCell>{application.location}</TableCell>
                  <TableCell>
                    <Chip
                      label={application.status}
                      color={application.status === 'approved' ? 'success' : 
                             application.status === 'rejected' ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog('view', application)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog('edit', application)}>
                      <EditIcon />
                    </IconButton>
                    {application.status === 'pending' && (
                      <>
                        <IconButton onClick={() => handleStatusUpdate(application._id, 'approve')} color="success">
                          <ApproveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleStatusUpdate(application._id, 'reject')} color="error">
                          <RejectIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton onClick={() => handleDelete(application._id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit/View Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogType === 'view' ? 'View Application Details' :
           dialogType === 'edit' ? 'Edit Trainer Application' : 'Add New Trainer Application'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            {dialogType === 'add' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>User</InputLabel>
                <Select
                  value={selectedItem?.userId || ''}
                  label="User"
                  onChange={(e) => {
                    setSelectedItem(prev => ({ ...prev, userId: e.target.value }));
                  }}
                >
                  {users.map(user => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              label="Game"
              name="game"
              value={selectedItem?.game || ''}
              margin="normal"
              disabled={dialogType === 'view'}
              required
              onChange={(e) => {
                setSelectedItem(prev => ({ ...prev, game: e.target.value }));
              }}
            />

            <TextField
              fullWidth
              label="Experience"
              name="experience"
              value={selectedItem?.experience || ''}
              margin="normal"
              disabled={dialogType === 'view'}
              required
              multiline
              rows={3}
              onChange={(e) => {
                setSelectedItem(prev => ({ ...prev, experience: e.target.value }));
              }}
            />

            <TextField
              fullWidth
              label="Qualifications"
              name="qualifications"
              value={selectedItem?.qualifications || ''}
              margin="normal"
              disabled={dialogType === 'view'}
              required
              multiline
              rows={3}
              onChange={(e) => {
                setSelectedItem(prev => ({ ...prev, qualifications: e.target.value }));
              }}
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={selectedItem?.location || ''}
              margin="normal"
              disabled={dialogType === 'view'}
              required
              onChange={(e) => {
                setSelectedItem(prev => ({ ...prev, location: e.target.value }));
              }}
            />

            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={selectedItem?.bio || ''}
              margin="normal"
              disabled={dialogType === 'view'}
              required
              multiline
              rows={4}
              onChange={(e) => {
                setSelectedItem(prev => ({ ...prev, bio: e.target.value }));
              }}
            />

            {dialogType === 'view' && (
              <>
                <TextField
                  fullWidth
                  label="Application ID"
                  value={selectedItem?._id || 'N/A'}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Application Date"
                  value={selectedItem?.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'N/A'}
                  margin="normal"
                  disabled
                />
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedItem?.status || 'N/A'}
                  margin="normal"
                  disabled
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogType !== 'view' && (
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={20} /> :
               dialogType === 'edit' ? 'Save Changes' : 'Add Application'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerApplicationsTab;
