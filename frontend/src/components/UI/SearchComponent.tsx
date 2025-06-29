import React, { useState } from 'react'
import RangeSlider from './RangeSlider'
import Select from './Select'
import Button from './Button'
import { AREAS, PROPERTY_TYPES } from '@/lib/constants'
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/lib/slices/propertySlice';

interface SearchParams {
  params?: PropertyFilters
  onHandleSearch?: () => void;
}

export default function SearchComponent({params, onHandleSearch}: SearchParams) {
  const router = useRouter();
  
  const [searchParams, setSearchParams] = useState<PropertyFilters>(params ?? {
    min_price: 6000,
    max_price: 600000,
    property_type: "", 
    area: [],
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchParams.min_price && searchParams.min_price > 0) {
      params.append('min_price', searchParams.min_price.toString());
    }
    
    if (searchParams.max_price && searchParams.max_price > 0) {
      params.append('max_price', searchParams.max_price.toString());
    }
    
    if (searchParams.property_type && searchParams.property_type.trim() !== '') {
      params.append('property_type', searchParams.property_type);
    }
    
    if (searchParams.area && searchParams.area.length > 0) {
      params.append('area', searchParams.area.map(area => area.value).join(','));
    }
    
    router.push(`/properties?${params.toString()}`);

    if (onHandleSearch) onHandleSearch();
  }

  return (
    <div className='w-[85%] mx-auto dark:bg-black bg-white border dark:border-gray-700 border-gray-300 p-10 rounded-xl flex md:flex-row flex-col items-center justify-between gap-5'>
      <div className='flex md:flex-wrap md:flex-row flex-col items-center gap-5'>
        <RangeSlider width='250px' min={6000} max={600000} value={[searchParams.min_price ?? 6000, searchParams.max_price ?? 600000]} onChange={(_, value) => {setSearchParams({...searchParams, min_price: value[0], max_price: value[1]})}} name='Price AED' />
        <Select value={searchParams.property_type} options={PROPERTY_TYPES.map(type => ({value: type, label: type}))} label='Property Type' onChange={(value) => {setSearchParams({...searchParams, property_type: value.value})}} />
        <Select value={searchParams.area} options={AREAS.map(area => ({value: area, label: area}))} label='Locations' isMulti onChange={(value) => {setSearchParams({...searchParams, area: value})}} />
      </div>
      <div className='flex text-sm md:mt-0 mt-8 items-center gap-2'>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  )
}
