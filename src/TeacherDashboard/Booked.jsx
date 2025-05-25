import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Divider,
  Avatar,
  Alert,
  Snackbar
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VideocamIcon from '@mui/icons-material/Videocam';
import ScheduleIcon from '@mui/icons-material/Schedule';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Booked = () => {
  const [openCancelModal, setOpenCancelModal] = React.useState(false);
  const [openCompleteModal, setOpenCompleteModal] = React.useState(false);
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));

      if (!tokenMatch) {
        setError('Authentication token not found');
        setSnackbar({
          open: true,
          message: 'Please log in to view your bookings',
          severity: 'error'
        });
        return;
      }

      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/bookings`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.bookings) {
          setBookings(data.bookings);
          setError(null);
        } else {
          setBookings([]);
          setError('No bookings data received');
        }
      } else {
        setError(data.msg || 'Failed to fetch bookings');
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch bookings',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Error fetching bookings');
      setSnackbar({
        open: true,
        message: 'Error fetching bookings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const handleCancelConfirm = async () => {
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

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/bookings/${selectedBooking.id}/cancel`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ userId: selectedBooking.teacherId })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking cancelled successfully',
          severity: 'success'
        });
        fetchBookings(); // Refresh bookings
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to cancel booking',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error cancelling booking',
        severity: 'error'
      });
    }
    setOpenCancelModal(false);
  };

  // Complete booking
  const handleCompleteConfirm = async () => {
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

      const response = await fetch(`${VITE_API_BASE_URL}/teacher/bookings/${selectedBooking.id}/complete`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ userId: selectedBooking.teacherId })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking marked as completed',
          severity: 'success'
        });
        fetchBookings(); // Refresh bookings
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to complete booking',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error completing booking',
        severity: 'error'
      });
    }
    setOpenCompleteModal(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Format time display
  const formatTime = (timeString) => {
    if (!timeString) return 'Invalid time';
    
    // If it's a full date string (includes date and time)
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // If it's just a time string (HH:mm format)
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Add this function near the top of the component
  const handleJoinClass = (meetingLink) => {
    if (!meetingLink) {
      setSnackbar({
        open: true,
        message: 'No meeting link available',
        severity: 'error'
      });
      return;
    }
    window.open(meetingLink, '_blank');
  };

  // Fetch bookings on component mount
  React.useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading bookings...</Typography>
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
    <>
      {bookings.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
        </Box>
      ) : (
        bookings.map((booking) => (
          <Card
            key={booking.id}
            sx={{
              maxWidth: 700,
              width: '90%',
              mx: 'auto',
              mt: 4,
              p: 3,
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              backgroundColor: '#ffffff',
              borderLeft: '4px solid #4CAF50'
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  bgcolor: '#4CAF50', 
                  width: 56, 
                  height: 56,
                  fontSize: '1.5rem'
                }}>
                  {booking.studentName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {booking.studentName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {booking.subject} Student
                  </Typography>
                </Box>
                <Chip
                  label={booking.status}
                  sx={{
                    ml: 'auto',
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    fontWeight: 600
                  }}
                  icon={<ScheduleIcon />}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Typography variant="body1">
                  <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>Email:</Box>
                  {booking.studentEmail}
                </Typography>
                <Typography variant="body1">
                  <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>Day:</Box>
                  {booking.day}
                </Typography>
                <Typography variant="body1">
                  <Box component="span" sx={{ fontWeight: 600, mr: 1 }}>Time:</Box>
                  {formatTime(booking.timeSlot.start)} - {formatTime(booking.timeSlot.end)}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="center">
                {booking.status === 'confirmed' && (
                  <Button
                    variant="contained"
                    startIcon={<VideocamIcon />}
                    onClick={() => handleJoinClass(booking.meetingLink)}
                    sx={{
                      px: 4,
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#388E3C' }
                    }}
                  >
                    Join Class
                  </Button>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setOpenCancelModal(true);
                    }}
                    sx={{
                      px: 4,
                      color: '#D32F2F',
                      borderColor: '#D32F2F',
                      '&:hover': { borderColor: '#B71C1C' }
                    }}
                  >
                    Cancel
                  </Button>
                )}
                {booking.status === 'confirmed' && (
                  <Button
                    variant="outlined"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setOpenCompleteModal(true);
                    }}
                    sx={{
                      px: 4,
                      color: '#2E7D32',
                      borderColor: '#2E7D32',
                      '&:hover': { borderColor: '#1B5E20' }
                    }}
                  >
                    Completed
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))
      )}

      {/* Cancel Confirmation Modal */}
      <Dialog
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px'
          }
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CancelIcon 
            color="error" 
            sx={{ 
              fontSize: '60px', 
              mb: 2,
              backgroundColor: '#FFEBEE',
              borderRadius: '50%',
              padding: '12px'
            }} 
          />
          <DialogTitle sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            px: 0,
            color: '#D32F2F'
          }}>
            Cancel This Booking?
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <DialogContentText sx={{ color: '#616161', fontSize: '1rem' }}>
              This action cannot be undone. The student will be notified of the cancellation.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            gap: 2,
            pt: 3,
            px: 0
          }}>
            <Button
              onClick={() => setOpenCancelModal(false)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                borderColor: '#BDBDBD',
                color: '#424242'
              }}
            >
              Go Back
            </Button>
            <Button
              onClick={handleCancelConfirm}
              variant="contained"
              color="error"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                backgroundColor: '#D32F2F',
                '&:hover': { backgroundColor: '#B71C1C' }
              }}
              startIcon={<CancelIcon />}
            >
              Confirm Cancellation
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Complete Confirmation Modal */}
      <Dialog
        open={openCompleteModal}
        onClose={() => setOpenCompleteModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '400px'
          }
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <CheckCircleIcon 
            color="success" 
            sx={{ 
              fontSize: '60px', 
              mb: 2,
              backgroundColor: '#E8F5E9',
              borderRadius: '50%',
              padding: '12px'
            }} 
          />
          <DialogTitle sx={{ 
            fontSize: '1.5rem',
            fontWeight: 700,
            px: 0,
            color: '#2E7D32'
          }}>
            Mark Session as Completed?
          </DialogTitle>
          <DialogContent sx={{ px: 0 }}>
            <DialogContentText sx={{ color: '#616161', fontSize: '1rem' }}>
              Please confirm the session has finished. This will help us improve our matching system.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ 
            justifyContent: 'center',
            gap: 2,
            pt: 3,
            px: 0
          }}>
            <Button
              onClick={() => setOpenCompleteModal(false)}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                borderColor: '#BDBDBD',
                color: '#424242'
              }}
            >
              Not Yet
            </Button>
            <Button
              onClick={handleCompleteConfirm}
              variant="contained"
              color="success"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1,
                backgroundColor: '#2E7D32',
                '&:hover': { backgroundColor: '#1B5E20' }
              }}
              startIcon={<CheckCircleIcon />}
            >
              Confirm Completion
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

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
    </>
  );
};

export default Booked;