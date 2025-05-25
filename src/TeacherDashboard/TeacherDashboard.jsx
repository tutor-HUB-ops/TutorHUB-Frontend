// eslint-disable-next-line no-unused-vars
import * as React from 'react';
import { useState, useContext } from 'react';
import { UserContext } from "../UserContext";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import Profile from './Profile';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Booked from './Booked';
import Resources from './Resources';
import Requests from './Requests'
import Logo from '../Landing/media/logo.png'
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import VerifiedIcon from '@mui/icons-material/Verified';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const defaultTheme = createTheme();
const CustomBox1 = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '1rem',
    flexWrap: 'wrap',
    textAlign: 'center',
    justifyContent: "center",
    alignItems: 'center',
    // marginBottom: theme.spacing(1),
    [theme.breakpoints.down("md")]: {

    },

}));

const TeacherDashboard = () => {
    const [open, setOpen] = useState(true);
    const [show, setShow] = useState('profile');
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const { name, verified } = useContext(UserContext);

    async function handleLogout() {
        try {
            const result = await MySwal.fire({
                title: 'Are you sure you want to logout?',
                text: "You will need to login again to access your account.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4CAF50',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                // Clear all auth-related data
                localStorage.removeItem('token');
                document.cookie = 'JAA_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                MySwal.fire({
                    title: 'Logged out successfully!',
                    text: 'Redirecting to home page...',
                    icon: 'success',
                    position: 'center',
                    showConfirmButton: false,
                    timer: 2000,
                    didOpen: () => {
                        MySwal.showLoading()
                    },
                }).then(() => {
                    navigate('/');
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
            MySwal.fire({
                title: 'Error',
                text: 'An unexpected error occurred. Please try again.',
                icon: 'error',
                position: 'center',
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar sx={{ backgroundColor: "#4CAF50" }}>
                        <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            {`Welcome, ${name}`}
                            {verified && (
                                <VerifiedIcon 
                                    sx={{ 
                                        color: '#1976d2',
                                        fontSize: '1.2rem'
                                    }} 
                                />
                            )}
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="primary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Drawer variant="permanent" open={open}>
                    <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1], mx: 2 }}>
                        <img src={Logo} alt="" style={{ minWidth: '40%' }} />
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItemButton onClick={() => setShow("profile")}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("requests")}>
                            <ListItemIcon><AssignmentIcon /></ListItemIcon>
                            <ListItemText primary="Requests" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("bookings")}>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="My Classes" />
                        </ListItemButton>
                        <ListItemButton onClick={() => setShow("resources")}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Resources" />
                        </ListItemButton>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Log out" />
                        </ListItemButton>
                    </List>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        {show === 'profile' && (
                            <Box sx={{ width: '100%' }}>
                                <Profile />
                            </Box>
                        )}
                        {show === 'requests' && (
                            <CustomBox1>
                                <Requests />
                            </CustomBox1>
                        )}
                        {show === 'bookings' && (
                            <CustomBox1>
                                <Booked />
                            </CustomBox1>
                        )}
                        {show === 'resources' && (
                            <CustomBox1>
                                <Resources />
                            </CustomBox1>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default TeacherDashboard;