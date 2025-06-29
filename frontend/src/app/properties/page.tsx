'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties, PropertyFilters } from "@/lib/slices/propertySlice";
import { AppDispatch, RootState } from "@/lib/store";
import Loading from "../loading";
import SearchComponent from "@/components/UI/SearchComponent";
import { useRouter } from "next/navigation";
import { mapFilters } from "@/lib/helpers";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error } = useSelector((state: RootState) => state.property);
  const [params, setParams] = useState<PropertyFilters>()
  
  useEffect(() => {
    const filters: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      filters[key] = value; 
    }
    setParams(mapFilters(filters));

    dispatch(fetchProperties({
      page: 1,
      limit: 10,
      filters
    }))
  }, [searchParams]);

  useEffect(() => {
    console.log(params);
  }, [params]);

  if (loading) return <Loading />;

  return (
    <ProtectedRoute>
      <div className="flex-1 p-4 relative">
        <SearchComponent params={params}/>
        {error 
        ? 
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p>Please try again later</p>
        </div> 
        : 
        properties.length > 0 
        ? 
          properties.map((property) => (
            <div className="mb-10 p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow" key={property.id || property.slug}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h2>
                  <p className="text-gray-600 mb-3">{property.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {property.price} {property.currency}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.billing_cycle}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{property.size} sq ft</div>
                  <div className="text-sm text-gray-500">Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-500">Area</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {property.property_type}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {property.room_type}
                </span>
                {property.utilities_included && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Utilities Included
                  </span>
                )}
              </div>
              
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 5).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{property.amenities.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  Available from: {new Date(property.available_from).toLocaleDateString()}
                </div>
                <div>
                  Min stay: {property.minimum_stay} months
                </div>
              </div>
            </div>
          ))
          :
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">No properties found</h1>
            <p>Please try again later</p>
          </div>
        }
      </div>  
    </ProtectedRoute>
  );
} 
