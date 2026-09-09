import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if(isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '1.2rem',
  },
};

export default ProtectedRoute;