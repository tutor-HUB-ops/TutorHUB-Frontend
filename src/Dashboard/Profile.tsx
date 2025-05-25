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
  Alert,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { UserContext } from '../UserContext';
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
  password?: string;
}

const Profile: React.FC = () => {
  const { name, email, id, setName } = useContext(UserContext) as UserContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: name || '',
    email: email || '',
    password: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Update local state when context changes
  useEffect(() => {
    setEditedData(prev => ({
      ...prev,
      name: name || '',
      email: email || ''
    }));
  }, [name, email]);

  // Fetch user profile when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

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

      const response = await fetch(`${VITE_API_BASE_URL}/student/profile`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setEditedData({
          name: data.student.name || '',
          email: data.student.email || '',
          password: ''
        });
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch profile',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setSnackbar({
        open: true,
        message: 'Error fetching profile',
        severity: 'error'
      });
    }
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
        email: editedData.email
      };

      // Only add password to request body if it's not empty
      if (editedData.password.trim()) {
        requestBody.password = editedData.password;
      }

      const response = await fetch(`${VITE_API_BASE_URL}/student/profile`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      
      if (response.ok) {
        setIsEditing(false);
        setSnackbar({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        // Update the name in UserContext
        setName(editedData.name);
        // Clear password field after successful update
        setEditedData(prev => ({ ...prev, password: '' }));
        // Refresh profile data
        fetchProfile();
      } else {
        setSnackbar({
          open: true,
          message: result.msg || 'Failed to update profile',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset to original data
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const ProfilePaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    borderRadius: '16px',
    boxShadow: theme.shadows[4],
    maxWidth: '600px',
    margin: '0 auto'
  }));

  const ProfileHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3)
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ProfilePaper>
        <ProfileHeader>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            My Profile
          </Typography>
          {!isEditing ? (
            <IconButton 
              onClick={handleEdit}
              color="primary"
              sx={{ backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#388E3C' } }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <Box>
              <IconButton 
                onClick={handleSave}
                color="primary"
                sx={{ backgroundColor: '#4CAF50', color: 'white', mr: 1, '&:hover': { backgroundColor: '#388E3C' } }}
              >
                <SaveIcon />
              </IconButton>
              <IconButton 
                onClick={handleCancel}
                color="secondary"
                sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }}
              >
                <CancelIcon />
              </IconButton>
            </Box>
          )}
        </ProfileHeader>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: '#4CAF50',
                fontSize: '2rem'
              }}
            >
              {editedData.name ? editedData.name.charAt(0).toUpperCase() : ''}
            </Avatar>
          </Box>

          <Divider sx={{ my: 2 }} />

          <TextField
            label="Full Name"
            name="name"
            value={editedData.name}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: '12px' }
            }}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={editedData.email}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: '12px' }
            }}
          />

          {isEditing && (
            <TextField
              label="New Password"
              name="password"
              type="password"
              value={editedData.password}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Leave blank to keep current password"
              InputProps={{
                sx: { borderRadius: '12px' }
              }}
            />
          )}
        </Box>
      </ProfilePaper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
