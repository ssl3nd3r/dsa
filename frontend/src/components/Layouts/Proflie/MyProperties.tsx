import React, { useEffect, useState } from 'react'
import { fetchUserMyProperties } from '@/lib/slices/propertySlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';  
import { useSelector } from 'react-redux';
import TextInput from '@/components/UI/Inputs/TextInput';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Fade } from '@mui/material'; 
import PropertyCard from '@/components/UI/PropertyCard';
import Button from '@/components/UI/Button';
import Select from '@/components/UI/Inputs/Select';


export default function MyProperties() {  
  const dispatch = useDispatch<AppDispatch>();
  const { myProperties, myPropertiesCurrentPage, myPropertiesLastPage, loading } = useSelector((state: RootState) => state.property);
  const [search, setSearch] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | 'both'>('both');
  
  const {debouncedValue: debouncedSearch, isDebouncing} = useDebounce(search);

  useEffect(() => {
    dispatch(fetchUserMyProperties({ page: myPropertiesCurrentPage, limit: 10, title: debouncedSearch, is_available: isAvailable }));
  }, [myPropertiesCurrentPage, debouncedSearch, isAvailable, dispatch]);

  return (
    <div>
        <div className='flex gap-3 items-center justify-between'>
          <h1 className='text-2xl font-bold'>My Properties</h1>
          <div className='flex items-center gap-3 relative'>
            <Fade in={isDebouncing || loading} timeout={200} unmountOnExit>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 dark:border-white border-black"></div>
            </Fade>
            <TextInput
              label=""
              name="search-my-properties"
              type="text" 
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            
          </div>
        </div>
        <div>
          <div className='max-w-56 mt-6'>
            <Select
              notClearable
              label="Filter by status"
              options={[
                { label: 'All', value: 'both' }, 
                { label: 'Active', value: true }, 
                { label: 'Pending Approval', value: false }
              ]}
              value={[
                { label: 'All', value: 'both' }, 
                { label: 'Active', value: true }, 
                { label: 'Pending Approval', value: false }
              ].find(option => option.value === isAvailable)}
              onChange={(e) => setIsAvailable(e.value)}
            />
          </div>
          {myProperties && myProperties.length > 0 ? (
            <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10 mt-5 relative'>
              {myProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} showDescription={false} showAvailability />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button 
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                disabled={myPropertiesCurrentPage === 1}
                onClick={() => dispatch(fetchUserMyProperties({ page: myPropertiesCurrentPage - 1, limit: 10, title: debouncedSearch }))}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {myPropertiesCurrentPage} of {myPropertiesLastPage}
              </span>
              <Button 
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                disabled={myPropertiesCurrentPage === myPropertiesLastPage}
                onClick={() => dispatch(fetchUserMyProperties({ page: myPropertiesCurrentPage + 1, limit: 10, title: debouncedSearch }))}
              >
                Next
              </Button>
            </div>
          </div>
          </>
          ) : <p className='md:mt-10 mt-5 text-center text-lg font-bold'>No properties found</p>}
        </div>
    </div>
  )
}
