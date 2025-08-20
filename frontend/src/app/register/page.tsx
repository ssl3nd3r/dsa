'use client'

import { RouteLink } from '@/components/UI/RouteLink'
import TextInput from '@/components/UI/Inputs/TextInput'
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('@/components/UI/Inputs/Select'), { ssr: false });
import React, { useState } from 'react'
import Button from '@/components/UI/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationFormSchema, type RegistrationFormData } from '@/lib/schemas/registrationForm'
import { LIFESTYLES, WORK_SCHEDULES } from '@/lib/constants'
import { registerUser, completeRegister } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { successToast, errorToast } from '@/components/UI/Toast';
import OtpInput from '@/components/UI/Inputs/OtpInput';
import { useRouter } from 'next/navigation';

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      lifestyle: [],
      work_schedule: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await dispatch(registerUser(data)).unwrap().then(() => {
        setVerifyOtp(true);
      }).catch((error) => {
        errorToast(error);
      });
    } catch (error) {
      console.log('error', error);
      errorToast('Something went wrong');
    }
  };

  const verifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(completeRegister({ ...watchedValues, otp_code: otpCode }));
      successToast('Registration successful!');
      router.push('/');
    } catch (error) {
      console.log('error', error);
      errorToast('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {verifyOtp ? (
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
              Verify your registration
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
                <button type="button" onClick={() => setVerifyOtp(false)} className="cursor-pointer font-medium dark:text-white text-black hover:text-dsa-blue">
                  Back to registration form
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-[800px] w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
              Create a new account
            </h2>
            <p className="mt-2 text-center text-sm text-black dark:text-white">
              Or{' '}
              <RouteLink href="/login" className="font-medium text-black dark:text-white hover:text-dsa-blue">
                sign in to your account
              </RouteLink>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-dsa-orange">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={watchedValues.email}
                    onChange={e => setValue('email', e.target.value, { shouldValidate: true })}
                    onBlur={e => setValue('email', e.target.value, { shouldValidate: true })}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span>
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <TextInput
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={watchedValues.password}
                    onChange={e => setValue('password', e.target.value, { shouldValidate: true })}
                    onBlur={e => setValue('password', e.target.value, { shouldValidate: true })}
                    placeholder="Enter your password"
                    required
                  />
                  {errors.password && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span>
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <TextInput
                    label="Name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={watchedValues.name}
                    onChange={e => setValue('name', e.target.value, { shouldValidate: true })}
                    onBlur={e => setValue('name', e.target.value, { shouldValidate: true })}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.name && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span>
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <TextInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={watchedValues.phone}
                    onChange={e => setValue('phone', e.target.value, { shouldValidate: true })}
                    onBlur={e => setValue('phone', e.target.value, { shouldValidate: true })}
                    placeholder="Enter your phone number"
                    required
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span>
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-dsa-orange">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <Select
                    isMulti={true}
                    placeholder="Select your lifestyle preferences"
                    value={watchedValues.lifestyle?.map((item: string) => ({ value: item, label: item })) || []}
                    onChange={options => {
                      const values = Array.isArray(options) ? options.map(option => option.value) : [];
                      setValue('lifestyle', values, { shouldValidate: true });
                    }}
                    options={LIFESTYLES}
                    required
                  />
                  {errors.lifestyle && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span>
                      {errors.lifestyle.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Select
                    placeholder="Select your work schedule"
                    value={watchedValues.work_schedule ? { value: watchedValues.work_schedule, label: watchedValues.work_schedule } : null}
                    onChange={option => setValue('work_schedule', option?.value ?? '', { shouldValidate: true })}
                    options={WORK_SCHEDULES}
                    required
                  />
                  {errors.work_schedule && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <span>⚠</span>
                      {errors.work_schedule.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 dark:border-white border-black hover:border-white dark:hover:border-black"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
