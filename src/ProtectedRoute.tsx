import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Token yoksa doğrudan Login sayfasına yönlendirir
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Token varsa alt rotayı (Dashboard) çizer
  return <Outlet />;
};

export default ProtectedRoute;