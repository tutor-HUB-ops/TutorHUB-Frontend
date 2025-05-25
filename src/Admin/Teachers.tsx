import * as React from 'react';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VerifiedIcon from '@mui/icons-material/Verified';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField, InputAdornment, Skeleton, Snackbar, Alert, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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

interface Teacher {
    _id: string;
    name: string;
    qualification: string;
    email: string;
    status: string;
    subjects: string[];
    banned: boolean;
    lastActive: string;
    verified: boolean;
    attachments: Array<{
        filename: string;
        originalName: string;
        path: string;
        mimeType: string;
    }>;
}

const Teachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Fetch teachers on component mount
    useEffect(() => {
        fetchTeachers();
    }, []);

    // Fetch teachers when search term changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchTeachers();
            } else {
                fetchTeachers();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchTeachers = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('JAA_access_token='))
                ?.split('=')[1];

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${VITE_API_BASE_URL}/admin/teachers`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch teachers');
            }

            const data = await response.json();
            console.log('Teachers response:', data); // Debug log
            setTeachers(data.teachers || []);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch teachers',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const searchTeachers = async () => {
        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('JAA_access_token='))
                ?.split('=')[1];

            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${VITE_API_BASE_URL}/admin/teachers/search?name=${searchTerm}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to search teachers');
            }

            const data = await response.json();
            setTeachers(data.teachers || []);
        } catch (error) {
            console.error('Error searching teachers:', error);
            setSnackbar({
                open: true,
                message: 'Failed to search teachers',
                severity: 'error'
            });
        }
    };

    const handleBanToggle = async (teacherId: string, currentBannedStatus: boolean) => {
        try {
            const result = await MySwal.fire({
                title: `Are you sure you want to ${currentBannedStatus ? 'unban' : 'ban'} this teacher?`,
                text: currentBannedStatus 
                    ? "The teacher will regain access to their account."
                    : "The teacher will lose access to their account.",
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
                const response = await fetch(`${VITE_API_BASE_URL}/admin/users/teacher/${teacherId}/${action}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to ${action} teacher`);
                }

                // Update the local state
                setTeachers(teachers.map(teacher =>
                    teacher._id === teacherId ? { 
                        ...teacher, 
                        banned: !currentBannedStatus,
                        status: !currentBannedStatus ? "Inactive" : "Active"
                    } : teacher
                ));

                setSnackbar({
                    open: true,
                    message: `Teacher ${action}ned successfully`,
                    severity: 'success'
                });
            }
        } catch (error) {
            console.error('Error toggling ban status:', error);
            setSnackbar({
                open: true,
                message: 'Failed to update teacher status',
                severity: 'error'
            });
        }
    };

    const handleViewDocuments = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTeacher(null);
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType === 'application/pdf') {
            return <PictureAsPdfIcon sx={{ color: '#f44336' }} />;
        }
        return <DescriptionIcon sx={{ color: '#2196f3' }} />;
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
                        placeholder="Search teachers by name..."
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

                {/* Teachers Grid */}
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
                                height={300}
                                sx={{ 
                                    borderRadius: 3,
                                    backgroundColor: 'rgba(46, 125, 50, 0.1)'
                                }}
                            />
                        ))
                    ) : teachers.length > 0 ? (
                        teachers.map((teacher) => (
                            <Card key={teacher._id} sx={{
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
                                            bgcolor: teacher.banned ? 'error.main' : 
                                                     teacher.status === "Active" ? 'primary.main' : 'grey.500',
                                            mr: 2,
                                            width: 56,
                                            height: 56
                                        }}>
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
                                                            color: '#1976d2',
                                                            fontSize: '1.2rem'
                                                        }} 
                                                    />
                                                )}
                                                {teacher.banned && (
                                                    <Chip
                                                        label="Banned"
                                                        color="error"
                                                        size="small"
                                                        sx={{ ml: 1, fontSize: '0.7rem' }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {teacher.qualification}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <strong>Email:</strong>
                                            </Typography>
                                            <Typography variant="body2">{teacher.email}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                <strong>Status:</strong>
                                            </Typography>
                                            <Chip 
                                                label={teacher.status} 
                                                size="small"
                                                color={teacher.status === "Active" ? "success" : "default"}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2, mt: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Subjects:</strong>
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {teacher.subjects.map((subject, index) => (
                                                <Chip
                                                    key={index}
                                                    label={subject}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{
                                                        borderColor: 'primary.light',
                                                        color: 'primary.dark'
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>

                                    <Box sx={{ mb: 2, mt: 2 }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            <strong>Documents:</strong>
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {teacher.attachments && teacher.attachments.length > 0 ? (
                                                <>
                                                    <Chip
                                                        label={`${teacher.attachments.length} document(s)`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        onClick={() => handleViewDocuments(teacher)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                bgcolor: 'action.hover'
                                                            }
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    No documents
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                        <Button
                                            onClick={() => handleBanToggle(teacher._id, teacher.banned)}
                                            variant={teacher.banned ? "contained" : "outlined"}
                                            color={teacher.banned ? "success" : "error"}
                                            startIcon={teacher.banned ? <LockOpenIcon /> : <BlockIcon />}
                                            size="medium"
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                px: 3
                                            }}
                                        >
                                            {teacher.banned ? 'Unban Teacher' : 'Ban Teacher'}
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
                                No teachers found matching your search.
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                onClick={() => {
                                    setSearchTerm('');
                                    fetchTeachers();
                                }}
                            >
                                Clear Search
                            </Button>
                        </Box>
                    )}
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
                            {selectedTeacher?.name}'s Documents
                        </Typography>
                        <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        {selectedTeacher?.attachments && selectedTeacher.attachments.length > 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {selectedTeacher.attachments.map((doc, index) => (
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

export default Teachers;