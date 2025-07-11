'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties, PropertyFilters } from "@/lib/slices/propertySlice";
import { AppDispatch, RootState } from "@/lib/store";
import SearchComponent from "@/components/UI/SearchComponent";
import { mapFilters } from "@/lib/helpers";
import PropertyCard from "@/components/UI/PropertyCard";
import Button from "@/components/UI/Button";
import Select from "@/components/UI/Inputs/Select";
import Loading from "@/components/Layouts/loading";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { properties, error, currentPage, lastPage, totalCount } = useSelector((state: RootState) => state.property);
  const [params, setParams] = useState<PropertyFilters>()
  
  const sortByOptions = [
    {value: 'price,asc', label: 'Price: Low to High'}, 
    {value: 'price,desc', label: 'Price: High to Low'},
    {value: 'created_at,asc', label: 'Newest'},
    {value: 'created_at,desc', label: 'Oldest'}
  ]

  // Separate function for fetching properties without setting params
  const fetchPropertiesData = useCallback(async (page: number, customParams?: PropertyFilters) => {
    const filters: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value; 
    }
    
    const effectiveParams = customParams || params;
    dispatch(fetchProperties({
      page,
      limit: 10,
      filters: {
        ...filters,
        sort_by: effectiveParams?.sort_by || 'created_at',
        sort_order: effectiveParams?.sort_order || 'desc'
      }
    }))
  }, [searchParams, dispatch, params])

  // Function for initial load and search param changes
  const getProperties = useCallback(async (page: number) => {
    const filters: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value; 
    }
    
    if (Object.keys(filters).length === 0) {
      return;
    }

    const mappedParams = mapFilters(filters);
    setParams(mappedParams);
    
    dispatch(fetchProperties({
      page,
      limit: 10,
      filters: {
        ...filters,
        sort_by: mappedParams?.sort_by || 'created_at',
        sort_order: mappedParams?.sort_order || 'desc'
      }
    }))
  }, [searchParams, dispatch])

  // Initial load and when search params change
  useEffect(() => {
    getProperties(1);
  }, [searchParams]);

  // When params change (sorting, etc.), refetch with current page
  useEffect(() => {
    if (params && currentPage) {
      fetchPropertiesData(currentPage, params);
    }
  }, [params?.sort_by, params?.sort_order]); // Only depend on specific params that should trigger refetch

  return (
    <div className="flex-1 p-4 relative">
      <SearchComponent params={params} maxWidth='1200px'/>
      {error 
      ? 
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p>Please try again later</p>
      </div> 
      : 
      properties.length > 0 
      ? 
      <>
        <div className="mt-10 flex justify-between md:flex-row flex-col md:items-center max-w-[1200px] mx-auto gap-y-4">
          <div className="flex items-center gap-2">
            <p><span className="font-semibold text-lg">{totalCount}</span> listings found</p>
          </div>
          <Select
            label=""
            className="md:w-[240px] w-full"
            minWidth="unset"
            maxWidth="unset"
            placeholder="Sort by"
            options={sortByOptions}
            value={params?.sort_by ? sortByOptions.find(option => option.value === `${params.sort_by},${params.sort_order}`) : undefined}
            onChange={(value) => {
              setParams({...params, sort_by: value?.value.split(',')[0] || '', sort_order: value?.value.split(',')[1] || 'desc'});
            }}
          />
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[1200px] mx-auto">
          {properties.map((property) => (
            <PropertyCard key={property.id || property.slug} property={property} />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <Button 
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              disabled={currentPage === 1}
              onClick={() => fetchPropertiesData(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Page {currentPage} of {lastPage}
            </span>
            <Button 
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              disabled={currentPage === lastPage}
              onClick={() => fetchPropertiesData(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </>
      :
      [...searchParams.entries()].length === 0
      ?
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Please set some filters to start your search</h1>
      </div>
      :
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">No properties found</h1>
        <p>Please adjust your filters and try again.</p>
      </div>
      }
    </div>  
  );
}

export default function PropertiesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<Loading />}>
        <PropertiesContent />
      </Suspense>
    </ProtectedRoute>
  );
} 
  