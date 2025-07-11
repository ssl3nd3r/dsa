'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { loginUser, clearError, removeOtpState } from '@/lib/slices/authSlice';
import { useGuestAuth } from '@/lib/hooks/useAuth';
import { RouteLink } from '@/components/UI/RouteLink';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/UI/Inputs/TextInput';
import {errorToast} from '@/components/UI/Toast';
import Button from '@/components/UI/Button';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpRequired } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  // Redirect if already authenticated
  useGuestAuth('/');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  useEffect(() => {
    dispatch(clearError());
    dispatch(removeOtpState());
  }, [dispatch]);

  useEffect(() => {
    if (otpRequired) {
      router.push(`/verify-login?email=${formData.email}`);
    }
  }, [otpRequired, router, formData.email]);

  useEffect(() => {
    if (error) {
      errorToast(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-black dark:text-white">
            Or{' '}
            <RouteLink href="/register" className="font-medium text-black dark:text-white hover:text-blue-700">
              create a new account
            </RouteLink>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <TextInput
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
            />
            <TextInput
              label="Password"
              name="password" 
              type="password"
              autoComplete="current-password"
              required
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>
          <div> 
            <Button
              type="submit"
              disabled={loading}
              className="w-full group"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 dark:border-white border-black group-hover:border-white group-hover:dark:border-black mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <RouteLink href="/forgot-password" className="font-medium text-black dark:text-white hover:text-blue-700">
                Forgot your password?
              </RouteLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 