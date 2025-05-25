import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Container,
  Paper,
  Avatar,
  Button,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserContext } from '../UserContext';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UserContextType {
  name: string;
  email: string;
  id: string;
  setName: (name: string) => void;
}

interface ProfileUpdateRequest {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

interface Availability {
  day: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  availability: Availability[];
  verified: boolean;
  attachments: Array<{
    filename: string;
    originalName: string;
    path: string;
    mimeType: string;
  }>;
}

const Profile: React.FC = () => {
  const { name, email, id, setName } = useContext(UserContext) as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trialInfo, setTrialInfo] = useState<{
    daysRemaining: number;
    isActive: boolean;
  } | null>(null);
  const [showTrialDialog, setShowTrialDialog] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    subjects: [] as string[],
    availability: [] as Availability[]
  });
  const [newSubject, setNewSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('09:00', 'HH:mm'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('17:00', 'HH:mm'));
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [timeError, setTimeError] = useState<string>('');

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/profile`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Profile response:', data); // Debug log
      
      if (response.ok) {
        setProfile(data.teacher);
        setEditedData({
          name: data.teacher.name,
          email: data.teacher.email,
          phone: data.teacher.phone || '',
          password: '',
          subjects: data.teacher.subjects || [],
          availability: data.teacher.availability || []
        });
        
        // Show verification dialog if teacher is not verified
        if (!data.teacher.verified) {
          setShowVerificationDialog(true);
        }
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch profile',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error fetching profile',
        severity: 'error'
      });
    }
  };

  // Add this new function to fetch trial information
  const fetchTrialInfo = async () => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        console.error('Authentication token not found');
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/account-info`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        const daysSinceCreation = data.accountInfo.daysSinceCreation;
        const daysRemaining = Math.max(0, 7 - daysSinceCreation);
        const isActive = daysRemaining > 0;
        
        setTrialInfo({
          daysRemaining,
          isActive
        });

        // Show dialog if trial is about to end (less than 2 days remaining)
        if (daysRemaining <= 2 && daysRemaining > 0) {
          setShowTrialDialog(true);
        }
      }
    } catch (error) {
      console.error('Error fetching trial info:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchTrialInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      // Create request body without password if it's empty
      const requestBody: ProfileUpdateRequest = {
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone
      };

      // Only add password to request body if it's not empty
      if (editedData.password.trim()) {
        requestBody.password = editedData.password;
      }

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/profile`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update the UserContext with the new name
        setName(editedData.name);
        
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        setIsEditing(false);
        // Clear password field after successful update
        setEditedData(prev => ({ ...prev, password: '' }));
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to update profile',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/subjects/add`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ subjects: [newSubject.trim()] })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Subject added successfully',
          severity: 'success'
        });
        setNewSubject('');
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to add subject',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding subject',
        severity: 'error'
      });
    }
  };

  const handleRemoveSubject = async (subject: string) => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/subjects/remove`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ subject })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Subject removed successfully',
          severity: 'success'
        });
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to remove subject',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error removing subject',
        severity: 'error'
      });
    }
  };

  const validateTimeRange = (start: Dayjs | null, end: Dayjs | null) => {
    if (!start || !end) return false;
    return start.isBefore(end);
  };

  const handleAddAvailability = async () => {
    if (!selectedDay || !startTime || !endTime) return;

    // Validate time range
    if (!validateTimeRange(startTime, endTime)) {
      setTimeError('End time must be after start time');
      return;
    }
    setTimeError('');

    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}teacher/availability/add`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          date: selectedDay,
          startTime: startTime.format('HH:mm'),
          endTime: endTime.format('HH:mm')
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Availability added successfully',
          severity: 'success'
        });
        setSelectedDay('');
        setStartTime(dayjs('09:00', 'HH:mm'));
        setEndTime(dayjs('17:00', 'HH:mm'));
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to add availability',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding availability',
        severity: 'error'
      });
    }
  };

  const handleRemoveAvailability = async (slot: Availability) => {
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      
      if (!tokenMatch) {
        setSnackbar({
          open: true,
          message: 'Authentication token not found',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/availability/remove`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          day: slot.day,
          startTime: slot.startTime,
          endTime: slot.endTime
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Availability removed successfully',
          severity: 'success'
        });
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to remove availability',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error removing availability',
        severity: 'error'
      });
    }
  };

  const handleViewDocuments = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <PictureAsPdfIcon sx={{ color: '#f44336' }} />;
    }
    return <DescriptionIcon sx={{ color: '#2196f3' }} />;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Add this new component for the trial status dialog
  const TrialStatusDialog = () => (
    <Dialog
      open={showTrialDialog}
      onClose={() => setShowTrialDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: trialInfo?.daysRemaining === 0 ? 'error.main' : 'warning.main',
        color: 'white'
      }}>
        <Typography variant="h6">
          {trialInfo?.daysRemaining === 0 ? 'Trial Period Ended' : 'Trial Period Ending Soon'}
        </Typography>
        <IconButton onClick={() => setShowTrialDialog(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          {trialInfo?.daysRemaining === 0 ? (
            <>
              <Typography variant="h6" color="error" gutterBottom>
                Your free trial has ended
              </Typography>
              <Typography variant="body1" paragraph>
                To continue using TutorConnect, please contact the administrator to set up your subscription.
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h6" color="warning.main" gutterBottom>
                {trialInfo?.daysRemaining} {trialInfo?.daysRemaining === 1 ? 'day' : 'days'} remaining in your trial
              </Typography>
              <Typography variant="body1" paragraph>
                Your free trial period will end soon. To continue using TutorConnect after the trial, please contact the administrator to set up your subscription.
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => setShowTrialDialog(false)} 
          color="primary"
          variant="contained"
        >
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Add this component for the trial status banner
  const TrialStatusBanner = () => {
    if (!trialInfo) return null;

    return (
      <Box sx={{ 
        mb: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: trialInfo.daysRemaining === 0 ? 'error.light' : 'warning.light',
        color: trialInfo.daysRemaining === 0 ? 'error.dark' : 'warning.dark',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography>
          {trialInfo.daysRemaining === 0 
            ? 'Your free trial has ended. Please contact the administrator to continue using TutorConnect.'
            : `${trialInfo.daysRemaining} ${trialInfo.daysRemaining === 1 ? 'day' : 'days'} remaining in your free trial`}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowTrialDialog(true)}
          sx={{ 
            color: 'inherit',
            borderColor: 'inherit',
            '&:hover': {
              borderColor: 'inherit',
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Learn More
        </Button>
      </Box>
    );
  };

  // Add this new component for the verification dialog
  const VerificationDialog = () => (
    <Dialog
      open={showVerificationDialog}
      onClose={() => setShowVerificationDialog(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'warning.main',
        color: 'white'
      }}>
        <Typography variant="h6">
          Get Verified
        </Typography>
        <IconButton onClick={() => setShowVerificationDialog(false)} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h6" color="warning.main" gutterBottom>
            Your account is not verified
          </Typography>
          <Typography variant="body1" paragraph>
            To get verified and access all features of TutorConnect, please contact the administrator to set up your subscription payment.
          </Typography>
          <Typography variant="body1" paragraph>
            Contact us at ethio.tutorhub@gmail.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verification includes:
          </Typography>
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Full access to student bookings
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              • Priority in search results
            </Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              • Verified badge on your profile
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: '16px', boxShadow: 4 }}>
        <TrialStatusBanner />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>My Profile</Typography>
            {profile?.verified && (
              <VerifiedIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
            )}
          </Box>
          {!isEditing ? (
            <IconButton onClick={handleEdit} color="primary"><EditIcon /></IconButton>
          ) : (
            <Box>
              <IconButton onClick={handleSave} color="primary"><SaveIcon /></IconButton>
              <IconButton onClick={() => setIsEditing(false)} color="secondary"><CancelIcon /></IconButton>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80, backgroundColor: '#4CAF50' }}>{profile.name ? profile.name.charAt(0).toUpperCase(): '?'}</Avatar>
          <Divider sx={{ my: 2 }} />
          <TextField 
            label="Full Name" 
            name="name" 
            value={editedData.name} 
            fullWidth 
            disabled={!isEditing} 
            onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} 
          />
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            value={editedData.email} 
            fullWidth 
            disabled={!isEditing} 
            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} 
          />
          <TextField 
            label="Phone" 
            name="phone" 
            value={editedData.phone} 
            fullWidth 
            disabled={!isEditing} 
            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })} 
          />

          {isEditing && (
            <TextField 
              label="New Password" 
              name="password" 
              type="password" 
              value={editedData.password} 
              fullWidth 
              placeholder="Leave blank to keep current password" 
              onChange={(e) => setEditedData({ ...editedData, password: e.target.value })} 
            />
          )}

          <Box>
            <Typography variant="subtitle1">Subjects</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField 
                fullWidth 
                value={newSubject} 
                onChange={(e) => setNewSubject(e.target.value)} 
                disabled={!isEditing} 
              />
              {isEditing && (
                <IconButton 
                  onClick={handleAddSubject} 
                  disabled={!newSubject.trim()} 
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {profile.subjects.map((subject, index) => (
                <Chip 
                  key={index} 
                  label={subject} 
                  onDelete={isEditing ? () => handleRemoveSubject(subject) : undefined} 
                  deleteIcon={isEditing ? <DeleteIcon /> : undefined} 
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1">Availability</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="date"
                fullWidth
                label="Date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
                disabled={!isEditing}
                sx={{
                  '& .MuiInputBase-root': {
                    position: 'relative'
                  }
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newValue) => {
                    setStartTime(newValue);
                    if (endTime && newValue && !validateTimeRange(newValue, endTime)) {
                      setTimeError('End time must be after start time');
                    } else {
                      setTimeError('');
                    }
                  }}
                  components={{ 
                    TextField: (props) => <TextField {...props} fullWidth /> 
                  }}
                  disabled={!isEditing}
                />
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newValue) => {
                    setEndTime(newValue);
                    if (startTime && newValue && !validateTimeRange(startTime, newValue)) {
                      setTimeError('End time must be after start time');
                    } else {
                      setTimeError('');
                    }
                  }}
                  components={{ 
                    TextField: (props) => <TextField {...props} fullWidth /> 
                  }}
                  disabled={!isEditing}
                />
              </LocalizationProvider>
            </Box>
            {timeError && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {timeError}
              </Typography>
            )}
            {isEditing && (
              <Button 
                onClick={handleAddAvailability} 
                disabled={!selectedDay || !!timeError} 
                startIcon={<AddIcon />} 
                sx={{ mt: 1 }}
              >
                Add Availability
              </Button>
            )}
            <Box sx={{ mt: 2 }}>
              {profile.availability.map((slot, index) => (
                <Chip 
                  key={index} 
                  label={`${formatDate(slot.date)}: ${slot.startTime} - ${slot.endTime}`} 
                  onDelete={isEditing ? () => handleRemoveAvailability(slot) : undefined} 
                  deleteIcon={isEditing ? <DeleteIcon /> : undefined} 
                  sx={{ m: 0.5 }} 
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Documents</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {profile.attachments && profile.attachments.length > 0 ? (
                profile.attachments.map((doc, index) => (
                  <Chip
                    key={index}
                    icon={getFileIcon(doc.mimeType)}
                    label={doc.originalName}
                    onClick={() => window.open(`${VITE_API_BASE_URL}/uploads/${doc.filename}`, '_blank')}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                ))
              ) : (
                <Typography color="text.secondary">No documents uploaded</Typography>
              )}
            </Box>
          </Box>

          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white'
            }}>
              <Typography variant="h6">
                My Documents
              </Typography>
              <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {profile.attachments && profile.attachments.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {profile.attachments.map((doc, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      {getFileIcon(doc.mimeType)}
                      <Typography sx={{ ml: 2, flexGrow: 1 }}>
                        {doc.originalName}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => window.open(`${VITE_API_BASE_URL}/uploads/${doc.filename}`, '_blank')}
                      >
                        View
                      </Button>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No documents available
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <VerificationDialog />
      <TrialStatusDialog />
    </Container>
  );
};

export default Profile;