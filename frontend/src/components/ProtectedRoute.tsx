'use client';

import { ReactNode } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { RouteLink } from './UI/RouteLink';

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
      <></>
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || isAuthenticated) {
    return (
      <>
        <RouteLink href='#' className='hidden'/>            
        {children}
      </>
    )
  }

  // If authentication is required but user is not authenticated, show fallback or nothing
  return (
    <>
      <RouteLink href='#' className='hidden'/>            
      {fallback}
    </>
  );
};

