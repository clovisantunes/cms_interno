import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireToken?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireToken = true 
}) => {
  const { isAuthenticated, isLoading, refreshToken } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        try {
          await refreshToken();
        } catch (error) {
          console.log('Não foi possível renovar o token');
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, refreshToken]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (requireToken && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    requireAuth: (component: React.ReactNode) => 
      isAuthenticated ? component : <Navigate to="/login" replace />
  };
};