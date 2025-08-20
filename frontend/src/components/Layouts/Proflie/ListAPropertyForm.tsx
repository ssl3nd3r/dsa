import React from 'react'
import { AMENITIES, AREAS, BILLING_CYCLES, PROPERTY_TYPES, ROOM_TYPES } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import { type ListAPropertyFormData, ListAPropertyFormSchema } from '@/lib/schemas/ListAPropertyForm';
import { errorToast, successToast } from '@/components/UI/Toast';
import TextInput from '@/components/UI/Inputs/TextInput';
import Button from '@/components/UI/Button';
import { createProperty } from '@/lib/slices/propertySlice';
import Select from '@/components/UI/Inputs/Select';
import ImageUploader from '@/components/UI/Inputs/ImageUploader';
import DatePicker from '@/components/UI/Inputs/DatePicker';

export default function ListAPropertyForm() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
    reset,
  } = useForm<ListAPropertyFormData>({
    resolver: zodResolver(ListAPropertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      size: 0,
      price: 0,
      location: '',
      property_type: '',
      billing_cycle: '',
      address: {
        street: '',
        city: '',
      },
      bedrooms: 0,
      bathrooms: 0,
      currency: 'AED',
      utilities_included: false,
      utilities_cost: 0,
      amenities: [],
      images: [],
      available_from: new Date().toLocaleDateString('en-CA'),
    },
  });

  const watchedValues = watch();
  
  const onSubmit = async (data: ListAPropertyFormData) => {
    try {
      await dispatch(createProperty(data)).unwrap();    
      successToast('Property listed successfully!');
      reset();
    } catch (error) {
      errorToast(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:gap-10 gap-6'>
      <div className='flex flex-col md:flex-row md:items-center justify-between'>
        <h1 className='text-2xl font-bold text-dsa-orange'>List a property</h1>
        <div className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
          {isValid ? '✓ All fields are valid' : 'Please fill in all required fields'}
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col md:col-span-2 gap-1'>
          <TextInput 
            label='Title' 
            name='title' 
            showLabel
            type='text' 
            autoComplete='title' 
            value={watchedValues.title} 
            onChange={(e) => setValue('title', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('title', e.target.value, { shouldValidate: true })}
            placeholder='Enter your property title' 
            required 
          />
          {errors.title && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.title.message}
            </span>
          )}
        </div>
        <div className='flex flex-col md:col-span-2 gap-1'>
          <TextInput 
            label='Description' 
            name='description' 
            showLabel
            type='textarea' 
            autoComplete='description' 
            value={watchedValues.description} 
            onChange={(e) => setValue('description', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('description', e.target.value, { shouldValidate: true })}
            placeholder='Enter your property description' 
            required 
          />
          {errors.description && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.description.message}
            </span>
          )}
        </div>
        <div className='flex flex-col md:col-span-2 gap-1'>
          <ImageUploader 
            label='Images' 
            isMulti
            name="images"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={(files: File[]) => setValue('images', files, { shouldValidate: true })}
            value={watchedValues.images}
          />
          {errors.images && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.images.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Size in Sqft' 
            name='size' 
            showLabel
            type='number' 
            autoComplete='size' 
            value={watchedValues.size} 
            onChange={(e) => setValue('size', Number(e.target.value), { shouldValidate: true })}
            onBlur={(e) => setValue('size', Number(e.target.value), { shouldValidate: true })}
            placeholder='Enter your property size' 
            required 
          />
          {errors.size && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.size.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Price in AED ' 
            name='price' 
            showLabel
            type='number' 
            autoComplete='price' 
            value={watchedValues.price} 
            onChange={(e) => setValue('price', Number(e.target.value), { shouldValidate: true })}
            onBlur={(e) => setValue('price', Number(e.target.value), { shouldValidate: true })}
            placeholder='Enter your property price' 
            required 
          />
          {errors.price && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.price.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Number of Bedrooms' 
            name='bedrooms' 
            showLabel
            type='number' 
            autoComplete='bedrooms' 
            value={watchedValues.bedrooms} 
            onChange={(e) => setValue('bedrooms', Number(e.target.value), { shouldValidate: true })}
            onBlur={(e) => setValue('bedrooms', Number(e.target.value), { shouldValidate: true })}
            placeholder='Enter the number of bedrooms' 
            required 
          />
          {errors.bedrooms && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.bedrooms.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Number of Bathrooms' 
            name='bathrooms' 
            showLabel
            type='number' 
            autoComplete='bathrooms' 
            value={watchedValues.bathrooms} 
            onChange={(e) => setValue('bathrooms', Number(e.target.value), { shouldValidate: true })}
            onBlur={(e) => setValue('bathrooms', Number(e.target.value), { shouldValidate: true })}
            placeholder='Enter the number of bathrooms' 
            required 
          />
          {errors.bathrooms && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.bathrooms.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Select 
            label='Property Location' 
            options={AREAS}
            value={watchedValues.location} 
            onChange={(e: {value: string, label: string}) => setValue('location', e ? e.value : '', { shouldValidate: true })}
            placeholder='Select your property location' 
            required 
          />
          {errors.location && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.location.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Select 
            label='Property Type' 
            options={PROPERTY_TYPES}
            value={watchedValues.property_type} 
            onChange={(e: {value: string, label: string}) => setValue('property_type', e ? e.value : '', { shouldValidate: true })}
            placeholder='Select your property type' 
            required 
          />
          {errors.property_type && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.property_type.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Select 
            label='Room Type' 
            options={ROOM_TYPES}
            value={watchedValues.room_type} 
            onChange={(e: {value: string, label: string}) => setValue('room_type', e ? e.value : '', { shouldValidate: true })}
            placeholder='Select your room type' 
            required 
          />
          {errors.room_type && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.room_type.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Select 
            label='Billing Cycle' 
            options={BILLING_CYCLES}
            value={watchedValues.billing_cycle} 
            onChange={(e: {value: string, label: string}) => setValue('billing_cycle', e ? e.value : '', { shouldValidate: true })}
            placeholder='Select your billing cycle' 
            required 
          />
          {errors.billing_cycle && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.billing_cycle.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <Select
            label='Amenities'
            isMulti
            options={AMENITIES}
            value={watchedValues.amenities.map((item: string) => ({value: item, label: item}))}
            onChange={(e) => setValue('amenities', e ? e.map((item: {value: string, label: string}) => item.value) : [], { shouldValidate: true })}
            placeholder='Select your property amenities' 
            required 
          />
          {errors.amenities && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.amenities.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <DatePicker
            label='Available From'
            name='available_from'
            min={new Date().toLocaleDateString('en-CA')}
            value={watchedValues.available_from}
            onChange={(date: string) => setValue('available_from', date, { shouldValidate: true })}
          />
          {errors.available_from && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.available_from.message}
            </span>
          )}
        </div>
        
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='Street' 
            name='street' 
            showLabel
            type='text' 
            autoComplete='street' 
            value={watchedValues.address.street} 
            onChange={(e) => setValue('address.street', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('address.street', e.target.value, { shouldValidate: true })}
            placeholder='Enter your property street' 
            required 
          />
          {errors.address?.street && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.address.street.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-1'>
          <TextInput 
            label='City' 
            name='city' 
            showLabel
            type='text' 
            autoComplete='city' 
            value={watchedValues.address.city} 
            onChange={(e) => setValue('address.city', e.target.value, { shouldValidate: true })}
            onBlur={(e) => setValue('address.city', e.target.value, { shouldValidate: true })}
            placeholder='Enter your property city' 
            required 
          />
          {errors.address?.city && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.address.city.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <Select 
            label='Utilities Included'
            notClearable
            options={[
              {label: 'Yes', value: true},
              {label: 'No', value: false},
            ]}
            value={[
              {label: 'Yes', value: true},
              {label: 'No', value: false},
            ].find(option => option.value === watchedValues.utilities_included)} 
            onChange={(e: {value: boolean, label: string}) => setValue('utilities_included', e ? e.value : false, { shouldValidate: true })}
            placeholder='Select if utilities are included' 
            required 
          />
          {errors.utilities_included && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.utilities_included.message}
            </span>
          )}
        </div>
        {watchedValues.utilities_included && (
          <div className='flex flex-col gap-1'>
          <TextInput 
            label='Utilities Cost in AED' 
            name='utilities_cost' 
            showLabel
            type='number'  
            autoComplete='utilities_cost' 
            value={watchedValues.utilities_cost || 0} 
            onChange={(e) => setValue('utilities_cost', Number(e.target.value), { shouldValidate: true })}
            onBlur={(e) => setValue('utilities_cost', Number(e.target.value), { shouldValidate: true })}
            placeholder='Enter your property utilities cost' 
            required 
          />
          {errors.utilities_cost && (
            <span className='text-red-500 text-sm flex items-center gap-1'>
              <span>⚠</span>
              {errors.utilities_cost.message}
            </span>
            )}
          </div>
        )}
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
              Adding...
            </div>
          ) : (
            'Add Property'
          )}
        </Button>
      </div>
    </form>
  );
}
