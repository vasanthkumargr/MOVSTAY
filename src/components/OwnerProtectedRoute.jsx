import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

/**
 * Protects owner-only routes. Redirects non-owners to /owner/login.
 */
const OwnerProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user || user.role !== 'owner') {
        return <Navigate to="/owner/login" replace />;
    }

    return children;
};

export default OwnerProtectedRoute;
