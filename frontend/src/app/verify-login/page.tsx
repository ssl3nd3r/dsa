'use client';

import { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch, RootState } from '@/lib/store';
import { clearError, removeOtpState, completeLogin } from '@/lib/slices/authSlice';
import { useGuestAuth } from '@/lib/hooks/useAuth';
import TextInput from '@/components/UI/Inputs/TextInput';
import OtpInput from '@/components/UI/Inputs/OtpInput';
import { errorToast } from '@/components/UI/Toast';
import Button from '@/components/UI/Button';

function VerifyLoginContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpEmail } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  // Redirect if already authenticate
  useGuestAuth('/');
  
  const [formData, setFormData] = useState({
    email: otpEmail ?? searchParams.get('email') ?? '',
    otp_code: '',
  });

  useEffect(() => {
    if (error) {
      errorToast(error);
    }
  }, [error]);

  const handleBackToLogin = () => {
    dispatch(removeOtpState());
    router.push('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(completeLogin(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (otpValue: string) => {
    setFormData({
      ...formData,
      otp_code: otpValue,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
            Verify your login
          </h2>
          <p className="mt-2 text-center text-sm text-black dark:text-white">
            Enter the code sent to your email
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <TextInput
              label="Email address"
              placeholder="Email address"
              name="email"
              type="email"
              autoComplete="email"
              disabled
              required
              hidden
              value={formData.email}
              onChange={handleChange}
            />
            <OtpInput
              value={formData.otp_code}
              onChange={handleOtpChange}
              length={6}
              disabled={loading}
              label="OTP Code"
            />
          </div>

          <div>
            <Button
              type="submit"
              className='w-full group mt-4'
              disabled={loading}
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
              <button type="button" onClick={handleBackToLogin} className="cursor-pointer font-medium dark:text-white text-black hover:text-blue-700">
                Back to login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VerifyLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    }>
      <VerifyLoginContent />
    </Suspense>
  );
} 