import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Redirect to the login page with a return URL
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default RequireAuth;