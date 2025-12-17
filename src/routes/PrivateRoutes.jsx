import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Wait for the auth check to finish
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen  dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
