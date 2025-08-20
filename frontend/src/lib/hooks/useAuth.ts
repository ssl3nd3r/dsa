import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '../store';
import { fetchUserProfile } from '../slices/authSlice';

interface UseAuthOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  disableRedirect?: boolean;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const { redirectTo = '/login', requireAuth = true, disableRedirect = false } = options;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // If we have a token but no user, try to fetch the user profile
    if (token && !user && !loading) {
      dispatch(fetchUserProfile());
    }
  }, [token, user, loading, dispatch]);

  useEffect(() => {
    // If authentication is required and user is not authenticated, redirect
    if (requireAuth && !loading && !isAuthenticated && !disableRedirect && !token) {
      console.log('sss');
      router.push(redirectTo);
    }
    else {
      console.log('fff');
      setIsLoading(false);
    }
  }, [requireAuth, loading, isAuthenticated, redirectTo, router, disableRedirect, token]);

  return {
    user,
    token,
    isAuthenticated,
    loading: isLoading,
  };
};

// Hook for pages that should redirect to dashboard if already authenticated
export const useGuestAuth = (redirectTo : string = '/dashboard') => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (!loading && isAuthenticated) {
      setIsLoading(false);
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, redirectTo, router]);

  return { isAuthenticated, loading: isLoading };
}; 