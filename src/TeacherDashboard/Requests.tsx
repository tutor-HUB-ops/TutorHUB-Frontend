import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Stack,
  Chip,
  Divider,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TimeSlot {
  start: string;
  end: string;
}

interface Booking {
  _id: string;
  id?: string;
  subject: string;
  date: string;
  timeSlot: TimeSlot;
  studentEmail: string;
  status: string;
}

interface ApiResponse {
  bookings?: Booking[];
  msg?: string;
}

// Create green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      light: '#4caf50', // Medium green
      dark: '#1b5e20', // Dark green
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#81c784', // Light green
      contrastText: '#000000'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          minWidth: '120px'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderLeft: '6px solid #2e7d32',
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: '1000px' // Increased card width
        }
      }
    }
  }
});

const Requests = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch pending bookings
  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));

      if (!tokenMatch) {
        setError('Authentication token not found');
        setSnackbar({
          open: true,
          message: 'Please log in to view pending requests',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/bookings/pending`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data: ApiResponse = await response.json();
      
      if (response.ok) {
        if (data.bookings) {
          const mappedBookings = data.bookings.map(booking => ({
            ...booking,
            _id: booking.id || booking._id
          }));
          setBookings(mappedBookings);
          setError(null);
        } else {
          setBookings([]);
          setError(null);
        }
      } else if (response.status === 404) {
        setBookings([]);
        setError(null);
      } else {
        setError(data.msg || 'Failed to fetch pending bookings');
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch pending bookings',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      setError('Error fetching pending bookings');
      setSnackbar({
        open: true,
        message: 'Error fetching pending bookings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirm booking
  const handleConfirm = async (bookingId: string) => {
    if (!bookingId) {
      setSnackbar({
        open: true,
        message: 'Invalid booking ID',
        severity: 'error'
      });
      return;
    }

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

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/bookings/${bookingId}/confirm`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking confirmed successfully',
          severity: 'success'
        });
        fetchPendingBookings(); // Refresh pending bookings
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to confirm booking',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      setSnackbar({
        open: true,
        message: 'Error confirming booking',
        severity: 'error'
      });
    }
  };

  // Decline booking
  const handleDecline = async (bookingId: string) => {
    if (!bookingId) {
      setSnackbar({
        open: true,
        message: 'Invalid booking ID',
        severity: 'error'
      });
      return;
    }

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

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/bookings/${bookingId}/decline`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking declined successfully',
          severity: 'success'
        });
        fetchPendingBookings(); // Refresh pending bookings
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to decline booking',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error declining booking:', error);
      setSnackbar({
        open: true,
        message: 'Error declining booking',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fetch pending bookings on component mount
  React.useEffect(() => {
    fetchPendingBookings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading pending requests...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        p: 4, // Increased padding
        mx: 'auto',
        width: '100%',
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Center content horizontally
      }}>
        <Box sx={{ 
          width: '100%',
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            mb: 4, // Increased margin
            color: 'primary.dark',
            display: 'flex',
            alignItems: 'center',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            Pending Requests
            <Chip 
              label={`${bookings.length} New`}
              color="primary"
              size="medium" // Larger chip
              sx={{ 
                ml: 2,
                fontWeight: 'bold',
                fontSize: '0.9rem',
                height: '32px'
              }}
            />
          </Typography>

          <Grid container spacing={4} sx={{ justifyContent: 'center' }}> {/* Centered grid */}
            {bookings.length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No pending requests found
                  </Typography>
                </Box>
              </Grid>
            ) : (
              bookings.map((booking) => (
                <Grid item key={booking._id} xs={12} sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <Card sx={{
  borderRadius: 3, // More rounded corners
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(46, 125, 50, 0.2)'
  },
  width: '100%', // Use full width of the Grid item
  maxWidth: '400px', // Set a fixed maximum width for cards
  margin: '0 auto' // Center the card within the Grid item
}}>
                    <CardActionArea>
                      <CardContent sx={{ p: 4 }}> {/* Increased padding */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 3 // Increased margin
                        }}>
                          <Typography variant="h5" sx={{ // Larger text
                            fontWeight: 700,
                            color: 'primary.dark'
                          }}>
                            {booking.subject}
                          </Typography>
                        </Box>

                        <Grid container spacing={3} sx={{ mb: 3 }}> {/* Using Grid for layout */}
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon sx={{ 
                                mr: 2, 
                                color: 'primary.main',
                                fontSize: '1.5rem'
                              }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Date
                                </Typography>
                                <Typography variant="body1">
                                  {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <ScheduleIcon sx={{ 
                                mr: 2, 
                                color: 'primary.main',
                                fontSize: '1.5rem'
                              }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Time Slot
                                </Typography>
                                <Typography variant="body1">
                                  {booking.timeSlot.start} - {booking.timeSlot.end}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon sx={{ 
                                mr: 2, 
                                color: 'primary.main',
                                fontSize: '1.5rem'
                              }} />
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Student Email
                                </Typography>
                                <Typography variant="body1">
                                  {booking.studentEmail}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />
                        <Box sx={{ 
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 3
                        }}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => {
                              const bookingId = booking._id || booking.id;
                              if (bookingId) {
                                handleConfirm(bookingId);
                              } else {
                                setSnackbar({
                                  open: true,
                                  message: 'Invalid booking ID',
                                  severity: 'error'
                                });
                              }
                            }}
                            startIcon={<CheckCircleIcon sx={{ fontSize: '1.2rem' }} />}
                            sx={{
                              boxShadow: '0 3px 6px rgba(46, 125, 50, 0.3)',
                              '&:hover': {
                                boxShadow: '0 6px 12px rgba(46, 125, 50, 0.4)',
                                backgroundColor: 'primary.dark'
                              },
                              py: 1.5,
                              px: 3
                            }}
                          >
                            Confirm Request
                          </Button>
                          <Button 
                            variant="outlined" 
                            color="error"
                            onClick={() => {
                              const bookingId = booking._id || booking.id;
                              if (bookingId) {
                                handleDecline(bookingId);
                              } else {
                                setSnackbar({
                                  open: true,
                                  message: 'Invalid booking ID',
                                  severity: 'error'
                                });
                              }
                            }}
                            startIcon={<CancelIcon sx={{ fontSize: '1.2rem' }} />}
                            sx={{
                              border: '2px solid',
                              borderColor: 'error.main',
                              color: 'error.main',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                                borderColor: 'error.dark',
                                border: '2px solid'
                              },
                              py: 1.5,
                              px: 3
                            }}
                          >
                            Decline Request
                          </Button>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>

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
    </ThemeProvider>
  );
};

export default Requests;