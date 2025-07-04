'use client';

import { ReactNode } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import Loading from '../app/loading';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true,
  fallback = null 
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth({ 
    redirectTo, 
    requireAuth 
  });

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Loading />
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>
  }

  // If authentication is required but user is not authenticated, show fallback or nothing
  return <>{fallback}</>;
};

