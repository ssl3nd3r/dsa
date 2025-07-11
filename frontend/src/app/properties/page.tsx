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
  const { properties, error, currentPage, lastPage } = useSelector((state: RootState) => state.property);
  const [params, setParams] = useState<PropertyFilters>()
  
  const sortByOptions = [
    {value: 'price,asc', label: 'Price: Low to High'}, 
    {value: 'price,desc', label: 'Price: High to Low'},
    {value: 'created_at,asc', label: 'Newest'},
    {value: 'created_at,desc', label: 'Oldest'}
  ]

  const getProperties = useCallback(async (page: number, noSetParams: boolean = false) => {
    const filters: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value; 
    }
    if (!noSetParams) {
      setParams(mapFilters(filters)); 
    }
    dispatch(fetchProperties({
      page,
      limit: 10,
      filters: {
        ...filters,
        sort_by: params?.sort_by || 'created_at',
        sort_order: params?.sort_order || 'desc'
      }
    }))
  }, [searchParams, dispatch, params])


  useEffect(() => {
    getProperties(1);
  }, [searchParams]);

  useEffect(() => {
    if (currentPage && currentPage !== 1) {
      getProperties(currentPage, true);
    }
  }, [params]);

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
        <div className="mt-10 flex justify-end max-w-[1200px] mx-auto">
          <Select
            label=""
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
              onClick={() => getProperties(currentPage - 1, true)}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Page {currentPage} of {lastPage}
            </span>
            <Button 
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              disabled={currentPage === lastPage}
              onClick={() => getProperties(currentPage + 1, true)}
            >
              Next
            </Button>
          </div>
        </div>
      </>
      :
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">No properties found</h1>
        <p>Please try again later</p>
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
  