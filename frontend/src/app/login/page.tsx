'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { loginUser, clearError, removeOtpState, completeLogin } from '@/lib/slices/authSlice';
import { useGuestAuth } from '@/lib/hooks/useAuth';
import { RouteLink } from '@/components/UI/RouteLink';
import { useRouter } from 'next/navigation';
import TextInput from '@/components/UI/Inputs/TextInput';
import OtpInput from '@/components/UI/Inputs/OtpInput';
import { errorToast, successToast } from '@/components/UI/Toast';
import Button from '@/components/UI/Button';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpRequired, otpEmail } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [verifyOtp, setVerifyOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  


  // Redirect if already authenticated
  useGuestAuth('/');
  
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (otpRequired) {
      setVerifyOtp(true);
      setFormData(prev => ({ ...prev, email: otpEmail || prev.email }));
    }
  }, [otpRequired, otpEmail]);

  useEffect(() => {
    if (error) {
      errorToast(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(loginUser(formData)).unwrap();
      // The verifyOtp state will be set by the useEffect when otpRequired becomes true
    } catch (error) {
      errorToast(error as string);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const verifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    try {
      await dispatch(completeLogin({ email: formData.email, otp_code: otpCode })).unwrap();
      successToast('Login successful!');
      router.push('/');
    } catch (error) {
      console.log('error', error);
      errorToast('Something went wrong');
    }
  };

  const handleBackToLogin = () => {
    setVerifyOtp(false);
    setOtpCode('');
    dispatch(removeOtpState());
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {verifyOtp ? (
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
              Verify your login
            </h2>
            <p className="mt-2 text-center text-sm text-black dark:text-white">
              Enter the code sent to your email
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={verifyOtpSubmit}>
            <div className="rounded-md -space-y-px">
              <OtpInput
                value={otpCode}
                onChange={e => setOtpCode(e)}
                length={6}
                disabled={loading} 
                label="OTP Code"
              />
            </div>

            <div>
              <Button
                type="submit"
                className='w-full group mt-4 disabled:opacity-50 disabled:pointer-events-none'
                disabled={loading || otpCode.length !== 6 || otpCode === ''}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 dark:border-white border-black group-hover:border-white group-hover:dark:border-black mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button type="button" onClick={handleBackToLogin} className="cursor-pointer font-medium dark:text-white text-black hover:text-dsa-blue">
                  Back to login form
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-black dark:text-white">
              Or{' '}
              <RouteLink href="/register" className="font-medium text-black dark:text-white hover:text-dsa-blue">
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
                <RouteLink href="/forgot-password" className="font-medium text-black dark:text-white hover:text-dsa-blue">
                  Forgot your password?
                </RouteLink>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 