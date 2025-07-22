import React, { useEffect, useState } from 'react'
import { fetchUserInterestedProperties } from '@/lib/slices/propertySlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';  
import { useSelector } from 'react-redux';
import TextInput from '@/components/UI/Inputs/TextInput';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Fade } from '@mui/material'; 
import PropertyCard from '@/components/UI/PropertyCard';
import Button from '@/components/UI/Button';



export default function InterestedProperties() {  
  const dispatch = useDispatch<AppDispatch>();
  const { interestedProperties, interestedPropertiesCurrentPage, interestedPropertiesLastPage, loading } = useSelector((state: RootState) => state.property);
  const [search, setSearch] = useState('');
  
  const {debouncedValue: debouncedSearch, isDebouncing} = useDebounce(search);

  useEffect(() => {
    dispatch(fetchUserInterestedProperties({ page: interestedPropertiesCurrentPage, limit: 10, title: debouncedSearch }));
  }, [interestedPropertiesCurrentPage, debouncedSearch, dispatch]);

  return (
    <div>
        <div className='flex gap-3 items-center justify-between'>
          <h1 className='text-2xl font-bold'>Saved Properties</h1>
          <div className='flex items-center gap-3 relative'>
            <Fade in={isDebouncing || loading} timeout={200} unmountOnExit>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 dark:border-white border-black"></div>
            </Fade>
            <TextInput
              label=""
              name="search-interested-properties"
              type="text" 
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />

          </div>
        </div>
        <div>
          {interestedProperties && interestedProperties.length > 0 ? (
            <>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10 mt-5 relative'>
              {interestedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} showDescription={false} />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button 
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                disabled={interestedPropertiesCurrentPage === 1}
                onClick={() => dispatch(fetchUserInterestedProperties({ page: interestedPropertiesCurrentPage - 1, limit: 10, title: debouncedSearch }))}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Page {interestedPropertiesCurrentPage} of {interestedPropertiesLastPage}
              </span>
              <Button 
                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                disabled={interestedPropertiesCurrentPage === interestedPropertiesLastPage}
                onClick={() => dispatch(fetchUserInterestedProperties({ page: interestedPropertiesCurrentPage + 1, limit: 10, title: debouncedSearch }))}
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
