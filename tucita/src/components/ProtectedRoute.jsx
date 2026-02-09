
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-rose-500 mb-4" />
        <p className="text-gray-500 font-medium">Verificando sesión...</p>
      </div>
    );
  }

  // 1. Check Authentication
  if (!isAuthenticated) {
    // Determine login redirect based on implied role context if possible, otherwise generic login
    const loginPath = requiredRole === 'profesional' ? '/login-professional' : '/login-client';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // 2. Check Role (if requiredRole is provided)
  if (requiredRole) {
    const userRole = currentUser?.role;
    
    // Normalize roles for comparison if needed (e.g. professional vs profesional)
    const isRoleMatch = userRole === requiredRole || 
                       (requiredRole === 'profesional' && userRole === 'professional') ||
                       (requiredRole === 'cliente' && userRole === 'customer');

    if (!isRoleMatch) {
      // Redirect to the appropriate dashboard for their ACTUAL role
      if (userRole === 'cliente' || userRole === 'customer') {
        return <Navigate to="/customer-dashboard" replace />;
      } else if (userRole === 'profesional' || userRole === 'professional') {
        return <Navigate to="/professional-dashboard" replace />;
      } else if (userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
         return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
