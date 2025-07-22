import React, { useEffect, useState } from 'react'
import RangeSlider from './Inputs/RangeSlider'
import Select from './Inputs/Select'
import Button from './Button'
import { AMENITIES, AREAS, BILLING_CYCLES, PROPERTY_TYPES, ROOM_TYPES } from '@/lib/constants'
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/lib/slices/propertySlice';

interface SearchParams {
  params?: PropertyFilters
  onHandleSearch?: () => void;
  maxWidth?: string;
}

export default function SearchComponent({params, onHandleSearch, maxWidth}: SearchParams) {
  const router = useRouter();  

  const [searchParams, setSearchParams] = useState<PropertyFilters>({
    min_price: 1000,
    max_price: 600000,
    billing_cycle: BILLING_CYCLES[0],
    property_type: "", 
    location: [],
    room_type: "",
    address: "",
  });

  useEffect (() => {
    if (params) {
      setSearchParams(params);
    }  
  }, [params]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchParams.min_price && searchParams.min_price > 0) {
      params.append('min_price', searchParams.min_price.toString());
    }
    
    if (searchParams.max_price && searchParams.max_price > 0) {
      params.append('max_price', searchParams.max_price.toString());
    }
    
    if (searchParams.property_type) {
      let propertyType: string;
      if (typeof searchParams.property_type === 'object' && searchParams.property_type && 'value' in searchParams.property_type) {
        propertyType = (searchParams.property_type as {value: string}).value;
      } else {
        propertyType = searchParams.property_type as string;
      }
      params.append('property_type', propertyType.trim());
    }

    if (searchParams.billing_cycle) {
      let billingCycle: string;
      if (typeof searchParams.billing_cycle === 'object' && searchParams.billing_cycle && 'value' in searchParams.billing_cycle) {
        billingCycle = (searchParams.billing_cycle as {value: string}).value;
      } else {
        billingCycle = searchParams.billing_cycle as string;
      }
      params.append('billing_cycle', billingCycle.trim());
    }

    if (searchParams.room_type) {
      let roomType: string;
      if (typeof searchParams.room_type === 'object' && searchParams.room_type && 'value' in searchParams.room_type) {
        roomType = (searchParams.room_type as {value: string}).value;
      } else {
        roomType = searchParams.room_type as string;
      }
      params.append('room_type', roomType.trim());
    }
    
    if (searchParams.location && searchParams.location.length > 0) {
      params.append('location', searchParams.location.map(location => location.value).join(','));
    }

    if (searchParams.amenities && searchParams.amenities.length > 0) {
      params.append('amenities', searchParams.amenities.map(amenity => amenity.value).join(','));
    }
    
    router.push(`/properties?${params.toString()}`);

    if (onHandleSearch) onHandleSearch();
  }
  
  const handlePriceChange = (_: unknown, value: number[]) => {
    if (
      value[0] !== searchParams.min_price ||
      value[1] !== searchParams.max_price
    ) {
      setSearchParams({
        ...searchParams,
        min_price: value[0],
        max_price: value[1]
      });
    }
  }

  return (
    <div style={{maxWidth: maxWidth ? maxWidth : 'unset'}} className={`${!maxWidth ? 'sm:w-[85%]' : 'w-full'} mx-auto dark:bg-black bg-white border dark:border-gray-700 border-gray-300 p-4 rounded-xl flex flex-col justify-between gap-8`}>
      <div className='flex sm:flex-wrap sm:flex-row flex-col items-center gap-5 gap-y-1'>
        <RangeSlider className='w-full md:w-[240px]' min={0} max={99999999999} value={[searchParams.min_price ?? 1000, searchParams.max_price ?? 600000]} onChange={handlePriceChange} name='Price AED' />
        <Select className='w-full md:w-fit' value={searchParams.property_type} options={PROPERTY_TYPES} label='Property Type' onChange={(value) => {setSearchParams({...searchParams, property_type: value?.value || ""})}} />
        <Select className='w-full md:w-fit' value={searchParams.room_type} options={ROOM_TYPES} label='Room Type' onChange={(value) => {setSearchParams({...searchParams, room_type: value?.value || ""})}} />
        <Select className='w-full md:w-fit' value={searchParams.location} options={AREAS} label='Locations' isMulti onChange={(value) => {setSearchParams({...searchParams, location: value})}} />
        <Select
          className='w-full md:w-fit'
          value={searchParams.billing_cycle ?? BILLING_CYCLES[0]}
          options={BILLING_CYCLES}
          label='Billing Cycle'
          notClearable
          onChange={(value) =>  setSearchParams({ ...searchParams, billing_cycle: value?.value || BILLING_CYCLES[0].value }) }
        />
        <Select className='w-full md:w-fit' value={searchParams.amenities} options={AMENITIES} label='Amenities' isMulti onChange={(value) => {setSearchParams({...searchParams, amenities: value})}} />
      </div>
      <Button className='self-end' onClick={handleSearch}>Search</Button>
    </div>
  )
}
