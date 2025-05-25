// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import SigninImg from "./images/signin-image.jpg";
import Logo from '../Landing/media/logo.png';
import { styled } from "@mui/material";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as LinkR, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">TutorHub</Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const Login = () => {
  const { setName, setId, setEmail, setIsVarified, setRole } = useContext(UserContext);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (email, password) => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userDetails = {
      email: data.get('email'),
      password: data.get('password'),
    };

    if (!validateForm(userDetails.email, userDetails.password)) {
      return;
    }

    try {
      console.log('Attempting to login with API URL:', VITE_API_BASE_URL); // Debug log
      const response = await fetch(`${VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userDetails),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      console.log("Backend Response:", res); // Debug log

      if (response.ok && res.msg === "Login successful" && res.token && res.user) {
        // Store token in cookies
        document.cookie = `JAA_access_token=${res.token}; path=/; secure; samesite=strict`;

        // Update user context
        setName(res.user.name);
        setId(res.user._id);
        setEmail(res.user.email);
        setRole(res.user.role);
        setIsVarified(true);

        // SweetAlert for success
        await MySwal.fire({
          title: res.msg,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          position: 'center',
        });

        // Navigate based on role
        switch (res.user.role) {
          case 'student':
            navigate("/dashboard");
            break;
          case 'admin':
             navigate("/admin");
             break;
          case 'teacher':
            navigate("/teacherdashboard");
            break;
          default:
            navigate("/");
            break;
        }
      } else {
        throw new Error(res.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      MySwal.fire({
        title: "Login Failed",
        text: err.message || "Please check your credentials and try again.",
        icon: 'error',
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const CustomBox = styled(Box)(({ theme }) => ({
    width: '60%',
    margin: '1rem auto',
    display: 'flex',
    padding: '0rem 3rem',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    borderRadius: '2rem',
    [theme.breakpoints.down('md')]: {
      width: '100vw',
      margin: 0,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      margin: 0,
      padding: 0,
    }
  }));

  const CustomBox1 = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    }
  }));

  return (
    <CustomBox>
      <Box sx={{ flex: 1 }}>
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <LinkR to='/'>
                <img src={Logo} alt="Logo" style={{ width: '100px', height: 'auto' }} />
              </LinkR>
              <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                Log in
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password}
                />
                {/* <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>

                <Grid container sx={{ marginTop: '1rem', justifyContent: 'center' }}>
                  <Grid item>
                    <LinkR to='/signup'>
                      <Link variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </LinkR>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 10, mb: 2 }} />
          </Container>
        </ThemeProvider>
      </Box>

      <CustomBox1>
        <figure>
          <img src={SigninImg} alt="sign in image" />
        </figure>
      </CustomBox1>
    </CustomBox>
  );
};

export default Login;