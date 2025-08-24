import React, { useState, useMemo } from 'react'
// import RangeSlider from './Inputs/RangeSlider'
// import Select from './Inputs/Select'
import { setLoading } from '@/lib/slices/uiSlice';
import Button from './Button'
import { ROOM_TYPES } from '@/lib/constants'
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/lib/slices/propertySlice';
import TextInput from './Inputs/TextInput'
import { useDispatch } from 'react-redux';

interface SearchParams {
  maxWidth?: string;
}

export default function SearchComponentHome({maxWidth}: SearchParams) {
  const router = useRouter();  
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useState<PropertyFilters>({
    search_query: "",
    room_type: "",
  });

  // Memoize the room type elements to prevent unnecessary re-renders
  const roomTypeElements = useMemo(() => {
    return ROOM_TYPES.map((roomType) => (
      <div key={roomType.value} className='flex items-center'>
        <input 
          onChange={(e) => setSearchParams({...searchParams, room_type: e.target.value})} 
          checked={searchParams.room_type === roomType.value} 
          className='hidden peer' 
          type="radio" 
          name={'room_type'} 
          id={roomType.value} 
          value={roomType.value} 
        />
        <label htmlFor={roomType.value} className='flex items-center gap-2 cursor-pointer hover:bg-dsa-orange/40 px-4 py-1.5 rounded-full transition-colors duration-300 peer-checked:!bg-dsa-orange peer-checked:!text-white'>
          <span>{roomType.label}</span>
        </label>
      </div>
    ));
  }, [searchParams.room_type]);

  const handleSearch = () => {
    const params = new URLSearchParams();


    if (searchParams.search_query) {
      params.append('search_query', searchParams.search_query.trim());
    }

    if (searchParams.room_type) {
      params.append('room_type', searchParams.room_type as string);
    }
    
    dispatch(setLoading(true));
    router.push(`/properties?${params.toString()}`);

  }
  

  return (
    <div style={{maxWidth: maxWidth ? maxWidth : 'unset'}} className={`${!maxWidth ? 'sm:w-[85%]' : 'w-full'} mx-auto dark:bg-black bg-white border dark:border-gray-700 border-gray-300 p-4 rounded-xl flex flex-col justify-between gap-8`}>
      <div className='flex md:items-center md:flex-row flex-col gap-x-12 gap-y-2'>
        <span>Searching for:</span>
        <div className='flex gap-2 flex-wrap flex-1 md:justify-between'>
          <div className='flex items-center gap-2'>
            <input 
              onChange={(e) => setSearchParams({...searchParams, room_type: e.target.value})} 
              checked={searchParams.room_type === ''} 
              className='hidden peer' 
              type="radio" 
              name={'room_type'} 
              id={'all'} 
              value={''} 
            />
            <label htmlFor={'all'} className='flex items-center gap-2 cursor-pointer hover:bg-dsa-orange/40 px-4 py-1.5 rounded-full transition-colors duration-300 peer-checked:!bg-dsa-orange peer-checked:!text-white'>
              <span>All</span>
            </label>
           
          </div>
          {roomTypeElements}
        </div>
      </div>
      <div className='flex md:flex-row flex-col gap-2 items-center'>
        <TextInput label='Search' placeholder='Search' value={searchParams.search_query ?? ""} onChange={(e) => setSearchParams({...searchParams, search_query: e.target.value})} name='search_query' type='text' autoComplete='off' className='flex-1 w-full'/>
        <Button className='self-end' onClick={handleSearch}>Search</Button>
      </div>
    </div>
  )
}
