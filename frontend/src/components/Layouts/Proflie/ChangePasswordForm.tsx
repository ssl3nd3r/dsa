import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormSchema, type ChangePasswordFormData } from '@/lib/schemas/ChangePasswordForm';
import TextInput from '@/components/UI/Inputs/TextInput';
import Button from '@/components/UI/Button';
import { successToast, errorToast } from '@/components/UI/Toast';
import { changePassword } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';

export default function ChangePasswordForm() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await dispatch(changePassword(data)).unwrap();    
      successToast('Password changed successfully!');
    } catch (error) {
      errorToast(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:gap-10 gap-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between'>
        <h1 className='text-2xl font-bold'>Change Password</h1>
        <div className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? '✓ All fields are valid' : 'Please fill in all required fields'}
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Current Password' 
            name='current_password' 
            type='password' 
            autoComplete='current_password' 
            value={watchedValues.current_password} 
            onChange={(e) => setValue('current_password', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('current_password', e.target.value, { shouldValidate: true })}
            placeholder='Enter your old password' 
            required 
          />
          {errors.current_password && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.current_password.message}
            </span>
          )}
        </div>
        <div className="md:block hidden"></div>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='New Password' 
            name='new_password' 
            type='password' 
            autoComplete='new_password' 
            value={watchedValues.new_password} 
            onChange={(e) => setValue('new_password', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('new_password', e.target.value, { shouldValidate: true })}
            placeholder='Enter your new password' 
            required 
          />
          {errors.new_password && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.new_password.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Confirm Password' 
            name='confirm_password' 
            type='password' 
            autoComplete='confirm_password' 
            value={watchedValues.confirm_password} 
            onChange={(e) => setValue('confirm_password', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('confirm_password', e.target.value, { shouldValidate: true })}
            placeholder='Enter your confirm password' 
            required 
          />
          {errors.confirm_password && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.confirm_password.message}
            </span>
          )}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button 
          type='submit' 
          disabled={isSubmitting || !isValid}
          className={`${(!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <div className='flex items-center gap-2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
              Changing...
            </div>
          ) : (
            'Change Password'
          )}
        </Button>
      </div>
    </form>
  );
}
