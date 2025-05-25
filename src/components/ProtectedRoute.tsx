import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const context = useContext(UserContext);
    const role = context?.role;

    // Check for token
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('JAA_access_token='))
        ?.split('=')[1];

    // If no token or no role, redirect to root
    if (!token || !role) {
        return <Navigate to="/" replace />;
    }

    // If role doesn't match, redirect to appropriate dashboard
    if (role !== allowedRole) {
        switch (role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'teacher':
                return <Navigate to="/teacherdashboard" replace />;
            case 'student':
                return <Navigate to="/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute; 