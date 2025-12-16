// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

    // Check if user is logged in and has admin/editor role
    if (!token || (!user.role || (user.role !== 'admin' && user.role !== 'editor'))) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedRoute;