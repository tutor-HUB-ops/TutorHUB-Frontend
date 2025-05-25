import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Teachers = () => {
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Fetch all teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Fetch teachers with search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchTeachers();
      } else {
        fetchTeachers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

const fetchTeachers = async () => {
  try {
    const cookieString = document.cookie; // New line for cookie retrieval
    const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));

    if (!tokenMatch) {
      setError('Authentication token not found'); // New error handling
      setSnackbar({
        open: true,
        message: 'Please log in to view your teachers',
        severity: 'error'
      });
      return;
    }

    const token = tokenMatch.split('=')[1]; // New line to extract token

    const response = await fetch(`${VITE_API_BASE_URL}/student/teachers`, {
      headers: {
        "Content-Type": "application/json", // Added content type
        "Authorization": `Bearer ${token}` // Updated to use the token from cookies
      },
      credentials: 'include' // Include cookies if needed
    });

    const data = await response.json();
    
    if (response.ok) {
      setTeachers(data.teachers);
      setError(null);
    } else {
      setError(data.msg || 'Failed to fetch teachers');
      setSnackbar({
        open: true,
        message: data.msg || 'Failed to fetch teachers',
        severity: 'error'
      });
    }
  } catch (err) {
    console.error('Error fetching teachers:', err); // Added logging
    setError('Error fetching teachers');
    setSnackbar({
      open: true,
      message: 'Error fetching teachers',
      severity: 'error'
    });
  }
};

 const searchTeachers = async () => {
  try {
    const cookieString = document.cookie; // New line for cookie retrieval
    const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));

    if (!tokenMatch) {
      setError('Authentication token not found'); // New error handling
      setSnackbar({
        open: true,
        message: 'Please log in to search for teachers',
        severity: 'error'
      });
      return;
    }

    const token = tokenMatch.split('=')[1]; // New line to extract token

    const response = await fetch(`${VITE_API_BASE_URL}/student/teachers/search?name=${searchQuery}`, {
      headers: {
        "Content-Type": "application/json", // Added content type
        "Authorization": `Bearer ${token}` // Updated to use the token from cookies
      },
      credentials: 'include' // Include cookies if needed
    });

    const data = await response.json();
    
    if (response.ok) {
      setTeachers(data.teachers);
      setError(null);
    } else {
      setError(data.msg || 'Failed to search teachers');
      setSnackbar({
        open: true,
        message: data.msg || 'Failed to search teachers',
        severity: 'error'
      });
    }
  } catch (err) {
    console.error('Error searching teachers:', err); // Added logging
    setError('Error searching teachers');
    setSnackbar({
      open: true,
      message: 'Error searching teachers',
      severity: 'error'
    });
  }
};

  const handleClickOpen = async (teacher) => {
    setSelectedTeacher(teacher);
    setOpen(true);
    setLoading(true);
    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/student/teachers/${teacher._id}/slots`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setAvailableSlots(data.availability);
        setSelectedSubject(data.subjects[0] || ''); // Set first subject as default
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to fetch available slots',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSnackbar({
        open: true,
        message: 'Error fetching available slots',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSlot(null);
    setSelectedSubject('');
    setAvailableSlots([]);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !selectedSubject) {
      setSnackbar({
        open: true,
        message: 'Please select a time slot and subject',
        severity: 'error'
      });
      return;
    }

    try {
      const cookieString = document.cookie;
      const tokenMatch = cookieString.split('; ').find(row => row.startsWith('JAA_access_token='));
      const token = tokenMatch.split('=')[1];

      const response = await fetch(`${VITE_API_BASE_URL}/student/bookings`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          teacherId: selectedTeacher._id,
          subject: selectedSubject,
          date: selectedSlot.date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime
        }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking successful!',
          severity: 'success'
        });
        handleClose();
      } else {
        setSnackbar({
          open: true,
          message: data.msg || 'Failed to book session',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error booking session:', error);
      setSnackbar({
        open: true,
        message: 'Error booking session',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const formatTime = (time) => {
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: '100vw' }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search teachers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
  {teachers.map((teacher) => (
    <Grid item xs={12} md={6} key={teacher._id}>
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        },
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <CardContent sx={{
          p: 3,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                mr: 2,
                width: 56, 
                height: 56,
                fontSize: '1.5rem'
              }}
            >
              {teacher.name.charAt(0)}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {teacher.name}
                </Typography>
                {teacher.verified && (
                  <VerifiedIcon 
                    sx={{ 
                      color: 'primary.main',
                      fontSize: '1.2rem'
                    }} 
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {teacher.qualification || 'Qualified Teacher'}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Email:</strong> {teacher.email}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Subjects:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {teacher.subjects?.map((subject, index) => (
                <Chip 
                  key={index} 
                  label={subject} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  sx={{ fontWeight: 'medium' }}
                />
              ))}
            </Stack>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
            pt: 2
          }}>
            <Chip
              label={`$${teacher.hourlyRate || 0}/hr`}
              color="success"
              variant="filled"
              sx={{
                fontWeight: 'bold',
                fontSize: '0.9rem',
                px: 1.5,
                py: 1
              }}
            />
            <Button
              onClick={() => handleClickOpen(teacher)}
              variant="contained"
              size="medium"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3
              }}
            >
              Book Session
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'white',
          fontWeight: 'bold',
        }}>
          Book a Session with {selectedTeacher?.name}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select Subject</FormLabel>
                <RadioGroup
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {selectedTeacher?.subjects?.map((subject, index) => (
                    <FormControlLabel
                      key={index}
                      value={subject}
                      control={<Radio />}
                      label={subject}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset">
                <FormLabel component="legend">Available Time Slots</FormLabel>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {availableSlots.map((slot, index) => {
                    const isSelected = selectedSlot && 
                      selectedSlot.date === slot.date && 
                      selectedSlot.startTime === slot.startTime;
                    
                    return (
                      <Paper
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'transparent',
                          backgroundColor: isSelected ? 'rgba(76, 175, 80, 0.08)' : 'transparent',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: isSelected ? 'rgba(76, 175, 80, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: isSelected ? 'primary.main' : 'text.primary'
                            }}
                          >
                            {formatDate(slot.date)}
                          </Typography>
                          <Typography 
                            variant="body1"
                            sx={{ 
                              color: isSelected ? 'primary.main' : 'text.secondary'
                            }}
                          >
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleBooking} 
            variant="contained" 
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            disabled={!selectedSlot || !selectedSubject}
          >
            Confirm Booking
          </Button>
        </DialogActions>
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
    </Box>
  );
};

export default Teachers;