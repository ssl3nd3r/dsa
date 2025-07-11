import { LIFESTYLES, WORK_SCHEDULES } from '@/lib/constants';
import { useAuth } from '@/lib/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { informationFormSchema, type InformationFormData } from '@/lib/schemas/informationForm';
import TextInput from '@/components/UI/Inputs/TextInput';
import Select from '@/components/UI/Inputs/Select';
import Button from '@/components/UI/Button';
import { successToast, errorToast } from '@/components/UI/Toast';
import { updateUserProfile } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';

export default function InformationForm() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<InformationFormData>({
    resolver: zodResolver(informationFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      lifestyle: user?.lifestyle ? (Array.isArray(JSON.parse(user.lifestyle as string)) ? JSON.parse(user.lifestyle as string) : [user.lifestyle]) : [],
      work_schedule: user?.work_schedule ?? '',
    },
  });


  const watchedValues = watch();

  const onSubmit = async (data: InformationFormData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      successToast('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      errorToast('Failed to update profile. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:gap-10 gap-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Profile Details</h1>
        <div className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? '✓ All fields are valid' : 'Please fill in all required fields'}
        </div>
      </div>
      
      <div className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>Personal Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-1'>
            <TextInput 
              label='Name' 
              name='name' 
              type='text' 
              autoComplete='name' 
              value={watchedValues.name} 
              onChange={(e) => setValue('name', e.target.value, { shouldValidate: true })}
              onBlur={(e) => setValue('name', e.target.value, { shouldValidate: true })}
              placeholder='Enter your full name' 
              required 
            />
            {errors.name && (
              <span className='text-red-500 text-sm flex items-center gap-1'>
                <span>⚠</span>
                {errors.name.message}
              </span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <TextInput 
              label='Email' 
              name='email' 
              type='email' 
              autoComplete='email' 
              value={watchedValues.email} 
              onChange={(e) => setValue('email', e.target.value, { shouldValidate: true })}
              onBlur={(e) => setValue('email', e.target.value, { shouldValidate: true })}
              placeholder='Enter your email address' 
              required 
            />
            {errors.email && (
              <span className='text-red-500 text-sm flex items-center gap-1'>
                <span>⚠</span>
                {errors.email.message}
              </span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <TextInput 
              label='Phone' 
              name='phone' 
              type='tel' 
              autoComplete='tel' 
              value={watchedValues.phone} 
              onChange={(e) => setValue('phone', e.target.value, { shouldValidate: true })}
              onBlur={(e) => setValue('phone', e.target.value, { shouldValidate: true })}
              placeholder='Enter your phone number' 
              required 
            />
            {errors.phone && (
              <span className='text-red-500 text-sm flex items-center gap-1'>
                <span>⚠</span>
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h2 className='text-lg font-bold'>Preferences</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col gap-1'>
            <Select 
              isMulti={true}
              placeholder='Select your lifestyle preferences' 
              value={watchedValues.lifestyle?.map(item => ({ value: item, label: item })) || []}
              onChange={(options) => {
                const values = Array.isArray(options) ? options.map(option => option.value) : [];
                setValue('lifestyle', values, { shouldValidate: true });
              }}
              options={LIFESTYLES} 
              required 
            />
            {errors.lifestyle && (
              <span className='text-red-500 text-sm flex items-center gap-1'>
                <span>⚠</span>
                {errors.lifestyle.message}
              </span>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Select 
              placeholder='Select your work schedule' 
              value={watchedValues.work_schedule ? { value: watchedValues.work_schedule, label: watchedValues.work_schedule } : null}
              onChange={(option) => setValue('work_schedule', option?.value ?? '', { shouldValidate: true })}
              options={WORK_SCHEDULES} 
              required 
            />
            {errors.work_schedule && (
              <span className='text-red-500 text-sm flex items-center gap-1'>
                <span>⚠</span>
                {errors.work_schedule.message}
              </span>
            )}
          </div>
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
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
