import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProfessionalProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userType } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Verificando acceso profesional...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/professional-login" state={{ from: location }} replace />;
  }

  if (userType !== 'professional') {
    // Authenticated but not a professional
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProfessionalProtectedRoute;