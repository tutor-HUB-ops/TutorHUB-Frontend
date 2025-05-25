import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Chip, TextField, InputAdornment, Stack, Skeleton, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MySwal = withReactContent(Swal);

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
                    fontWeight: 600
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderLeft: '4px solid #2e7d32',
                    width: '100%',
                    maxWidth: 400
                }
            }
        }
    }
});

interface Student {
    _id: string;
    name: string;
    email: string;
    banned: boolean;
}

const Students = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Fetch students on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch students when search term changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchStudents();
            } else {
                fetchStudents();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchStudents = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('JAA_access_token='))
                ?.split('=')[1];

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${VITE_API_BASE_URL}/admin/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }

            const data = await response.json();
            setStudents(data.students || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch students',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const searchStudents = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('JAA_access_token='))
                ?.split('=')[1];

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${VITE_API_BASE_URL}/admin/students/search?name=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to search students');
            }

            const data = await response.json();
            setStudents(data.students || []);
        } catch (error) {
            console.error('Error searching students:', error);
            setSnackbar({
                open: true,
                message: 'Failed to search students',
                severity: 'error'
            });
        }
    };

    const handleBanToggle = async (studentId: string, currentBannedStatus: boolean) => {
        try {
            const result = await MySwal.fire({
                title: `Are you sure you want to ${currentBannedStatus ? 'unban' : 'ban'} this student?`,
                text: currentBannedStatus 
                    ? "The student will regain access to their account."
                    : "The student will lose access to their account.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2e7d32',
                cancelButtonColor: '#d33',
                confirmButtonText: `Yes, ${currentBannedStatus ? 'unban' : 'ban'} them!`
            });

            if (result.isConfirmed) {
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('JAA_access_token='))
                    ?.split('=')[1];

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const action = currentBannedStatus ? 'unban' : 'ban';
                const response = await fetch(`${VITE_API_BASE_URL}/admin/users/student/${studentId}/${action}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to ${action} student`);
                }

                // Update the local state
                setStudents(students.map(student =>
                    student._id === studentId ? { ...student, banned: !currentBannedStatus } : student
                ));

                setSnackbar({
                    open: true,
                    message: `Student ${action}ned successfully`,
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error toggling ban status:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update student status',
                severity: 'error'
            });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                background: 'linear-gradient(to bottom, #f5f5f5 0%, #e8f5e9 100%)',
                width: '100%',
                minHeight: '100vh'
            }}>
                {/* Search Bar */}
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: 600, 
                    mx: 'auto',
                    mb: 2
                }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search students by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { 
                                borderRadius: 2, 
                                backgroundColor: 'background.paper',
                                '&:focus-within': {
                                    borderColor: 'primary.main'
                                }
                            }
                        }}
                    />
                </Box>

                {/* Students Grid */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 3,
                    justifyContent: 'center'
                }}>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton 
                                key={index}
                                variant="rectangular"
                                width={400}
                                height={200}
                                sx={{ 
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(46, 125, 50, 0.1)'
                                }}
                            />
                        ))
                    ) : students.length > 0 ? (
                        students.map((student) => (
                            <Card key={student._id} sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                                }
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{
                                            bgcolor: student.banned ? 'error.main' : 'primary.main',
                                            mr: 2
                                        }}>
                                            {student.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" component="div" fontWeight="bold">
                                                {student.name}
                                                {student.banned && (
                                                    <Chip
                                                        label="Banned"
                                                        color="error"
                                                        size="small"
                                                        sx={{ ml: 1, fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {student.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Button
                                            onClick={() => handleBanToggle(student._id, student.banned)}
                                            variant={student.banned ? "contained" : "outlined"}
                                            color={student.banned ? "success" : "error"}
                                            startIcon={student.banned ? <LockOpenIcon /> : <BlockIcon />}
                                            size="medium"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                px: 3
                                            }}
                                        >
                                            {student.banned ? 'Unban Student' : 'Ban Student'}
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
                            width: '100%'
                        }}>
                            <Typography variant="body1" sx={{ 
                                color: 'text.secondary', 
                                fontStyle: 'italic',
                                mb: 2
                            }}>
                                No students found matching your search.
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchStudents();
                                }}
                            >
                                Clear Search
                            </Button>
                        </Box>
                    )}
                </Box>

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

export default Students;