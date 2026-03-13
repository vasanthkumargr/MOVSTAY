import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Divider, Grid, AppBar, Toolbar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedRole === 'student' && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const endpoint = selectedRole === 'student' ? '/auth/register-student' : '/auth/register';
            const response = await api.post(endpoint, formData);
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await api.post('/auth/google', {
                credential: credentialResponse.credential,
            });
            login(response.data.user, response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-up failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google sign-up was cancelled or failed. Please try again.');
    };

    const [selectedRole, setSelectedRole] = useState('');

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            {/* Minimalist Navbar */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
                <Toolbar>
                    <Box
                        component="img"
                        src="/MOV Stay Logo.png"
                        alt="MOV Stay Logo"
                        sx={{ height: 44, objectFit: 'contain', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />
                </Toolbar>
            </AppBar>

            {/* Main Content Area */}
            <Grid container sx={{ flexGrow: 1, m: 0, p: 0 }}>
                {/* Left Side: Video, Motto */}
                <Grid 
                    item 
                    xs={12} 
                    md={6} 
                    lg={6}
                    sx={{ 
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4
                    }}
                >
                    <Box sx={{ textAlign: 'center', maxWidth: 600, width: '100%' }}>
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="text.primary">
                            Welcome to MOV Stay
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                            Your perfect stay, just a click away.
                        </Typography>

                        {/* Elegant Video Container */}
                        <Box
                            sx={{
                                width: '100%',
                                borderRadius: 4,
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                position: 'relative',
                                aspectRatio: '16/9'
                            }}
                        >
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            >
                                <source src="/Landing Page Video.mp4" type="video/mp4" />
                            </video>
                        </Box>
                    </Box>
                </Grid>

                {/* Right Side: Form */}
                <Grid 
                    item 
                    xs={12} 
                    md={6} 
                    lg={6}
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        p: { xs: 2, sm: 4, md: 6 },
                        py: { xs: 4, md: 6 }
                    }}
                >
                    <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: selectedRole === 'student' ? 500 : 450, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 2 }}>
                            <Box
                                component="img"
                                src="/MOV Stay Logo.png"
                                alt="MOV Stay Logo"
                                sx={{ height: 60, objectFit: 'contain' }}
                            />
                        </Box>
                        <Typography variant="h5" gutterBottom textAlign="center" fontWeight="bold" mb={3}>
                            {selectedRole === 'owner' ? 'Owner Registration' : selectedRole === 'student' ? 'Student Registration' : 'Create an Account'}
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {!selectedRole ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography textAlign="center" mb={1} color="textSecondary">Select your account type to get started</Typography>
                                <Button variant="contained" color="primary" onClick={() => setSelectedRole('student')} sx={{ py: 1.5, fontSize: '1rem' }}>
                                    Register as Student
                                </Button>
                                <Button variant="outlined" color="primary" onClick={() => setSelectedRole('owner')} sx={{ py: 1.5, fontSize: '1rem', borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                                    Register as Owner
                                </Button>
                                <Divider sx={{ my: 3 }}>OR</Divider>
                                <Typography textAlign="center" mt={2} color="textSecondary">
                                    Already have an account?{' '}
                                    <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                                        <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                                            Login
                                        </Link>
                                    </Box>
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <form onSubmit={handleSubmit}>
                                    {/* Common Fields */}
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        margin="normal"
                                        required
                                    />
                                    {selectedRole === 'student' && (
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleChange}
                                            margin="normal"
                                            required
                                        />
                                    )}
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        margin="normal"
                                        required
                                    />
                                    {selectedRole === 'student' && (
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword || ''}
                                            onChange={handleChange}
                                            margin="normal"
                                            required
                                        />
                                    )}

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
                                    >
                                        Register
                                    </Button>
                                </form>

                                {selectedRole === 'owner' && (
                                    <>
                                        <Divider sx={{ my: 3 }}>OR</Divider>

                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={handleGoogleError}
                                                text="signup_with"
                                                shape="rectangular"
                                                width="100%"
                                            />
                                        </Box>
                                    </>
                                )}
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                                    <Button variant="text" onClick={() => setSelectedRole('')} sx={{ textTransform: 'none' }}>
                                        &larr; Back
                                    </Button>
                                    <Typography textAlign="center" color="textSecondary">
                                        Already have an account?{' '}
                                        <Box component="span" sx={{ fontWeight: 'bold', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                                            <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                Login
                                            </Link>
                                        </Box>
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default RegisterPage;
