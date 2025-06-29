'use client';

import { ReactNode } from 'react';
import { useAuth } from '../lib/hooks/useAuth';

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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 dark:border-white border-black mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>
  }

  // If authentication is required but user is not authenticated, show fallback or nothing
  return <>{fallback}</>;
};

