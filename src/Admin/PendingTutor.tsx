import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Skeleton, Snackbar, Alert, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MySwal = withReactContent(Swal);

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      contrastText: '#ffffff'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
});

interface Teacher {
  _id: string;
  name: string;
  qualification: string;
  email: string;
  status: string;
  subjects: string[];
  lastActive: string;
  attachments: Array<{
    filename: string;
    originalName: string;
    path: string;
    mimeType: string;
  }>;
}

const PendingTutors = () => {
  const [tutors, setTutors] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [selectedTutor, setSelectedTutor] = useState<Teacher | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch unverified teachers on component mount
  useEffect(() => {
    fetchUnverifiedTeachers();
  }, []);

  const fetchUnverifiedTeachers = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${VITE_API_BASE_URL}/admin/unverified-teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unverified teachers');
      }

      const data = await response.json();
      console.log('Unverified teachers response:', data); // Debug log
      setTutors(data.teachers || []);
    } catch (error) {
      console.error('Error fetching unverified teachers:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch unverified teachers',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (tutorId: string) => {
    try {
      const result = await MySwal.fire({
        title: 'Verify this tutor?',
        text: "This will grant them access to the platform as a verified tutor.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2e7d32',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, verify them!'
      });

      if (result.isConfirmed) {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('JAA_access_token='))
          ?.split('=')[1];

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${VITE_API_BASE_URL}/admin/teachers/${tutorId}/verify`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to verify teacher');
        }

        // Remove the verified teacher from the list
        setTutors(tutors.filter(tutor => tutor._id !== tutorId));

        setSnackbar({
          open: true,
          message: 'Teacher verified successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error verifying teacher:', error);
      setSnackbar({
        open: true,
        message: 'Failed to verify teacher',
        severity: 'error'
      });
    }
  };

  const handleViewDocuments = (tutor: Teacher) => {
    setSelectedTutor(tutor);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTutor(null);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/pdf') {
      return <PictureAsPdfIcon sx={{ color: '#f44336' }} />;
    }
    return <DescriptionIcon sx={{ color: '#2196f3' }} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
          minHeight: '100vh'
        }}
      >
        {loading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Skeleton 
              key={index}
              variant="rectangular"
              width={1000}
              height={400}
              sx={{ 
                borderRadius: 3,
                backgroundColor: 'rgba(46, 125, 50, 0.1)'
              }}
            />
          ))
        ) : tutors.length > 0 ? (
          tutors.map((tutor) => (
            <Card
              key={tutor._id}
              sx={{
                width: '100%',
                maxWidth: 1000,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 16px rgba(46, 125, 50, 0.15)',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    fontSize: '2rem'
                  }}>
                    {tutor.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {tutor.name}
                      </Typography>
                      <Chip 
                        label="Pending Verification"
                        color="warning"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                      {tutor.qualification}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                      gap: 3,
                      mt: 3
                    }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Email:</strong>
                        </Typography>
                        <Typography variant="body1">{tutor.email}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Last Active:</strong>
                        </Typography>
                        <Typography variant="body1">{tutor.lastActive}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Documents Submitted:</strong>
                        </Typography>
                        <Typography variant="body1">{tutor.attachments?.length || 0} files</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Subjects:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {tutor.subjects.map((subject, index) => (
                      <Chip
                        key={index}
                        label={subject}
                        color="primary"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.9rem',
                          px: 1.5,
                          py: 0.5
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 4
                }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => handleViewDocuments(tutor)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 4
                    }}
                  >
                    View Documents
                  </Button>
                  <Button
                    onClick={() => handleVerify(tutor._id)}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      px: 4,
                      '&:hover': {
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    Verify Tutor
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6, 
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            width: '100%',
            maxWidth: 1000
          }}>
            <Typography variant="h6" sx={{ 
              color: 'text.secondary',
              mb: 2
            }}>
              No pending tutor verifications
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'text.secondary',
              fontStyle: 'italic'
            }}>
              All tutors have been verified or there are no new applications.
            </Typography>
          </Box>
        )}

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
              {selectedTutor?.name}'s Documents
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedTutor?.attachments && selectedTutor.attachments.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {selectedTutor.attachments.map((doc, index) => (
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
                      onClick={() => window.open(`${VITE_API_BASE_URL}/api/uploads/${doc.filename}`, '_blank')}
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default PendingTutors;