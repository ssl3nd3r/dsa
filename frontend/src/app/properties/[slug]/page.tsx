'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPropertyBySlug } from '@/lib/slices/propertySlice';
import Loading from '@/app/loading';
import GalleryIcon from '@/components/UI/Assets/GalleryIcon';

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProperty, loading, error } = useSelector((state: RootState) => state.property);
  
  // Unwrap the params Promise
  const { slug } = React.use(params);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPropertyBySlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    console.log(currentProperty);
  }, [currentProperty]);

  if (loading) {
    return <Loading/>;
  }

  if (!currentProperty || error) {
    return (
      <div className="flex-1 py-20">
        <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold">Property not found</h1>
          <p>The property you're looking for doesn't exist.</p>
        </div>
      </div>
      ) ;
  }

  return (
    <div className="flex-1 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Property Images */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {currentProperty.images && currentProperty.images.length > 0 ? (
              <div className="w-full h-96 object-cover relative" style={{
                backgroundImage: `url(${currentProperty.images[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <button className="absolute cursor-pointer bottom-4 right-4">
                  <GalleryIcon size={36} />
                </button>
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-gray-400 text-xl">No Image Available</span>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">{currentProperty.title}</h1>
                  <div className="text-3xl font-bold text-blue-600">
                    AED {currentProperty.price.toLocaleString()}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{currentProperty.description}</p>
                
                <div className="flex items-center space-x-6 mb-6">
                  <span className="text-gray-500">{currentProperty.bedrooms} Bedrooms</span>
                  <span className="text-gray-500">{currentProperty.bathrooms} Bathrooms</span>
                  <span className="text-gray-500">{currentProperty.area} sq ft</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {currentProperty.property_type}
                  </span>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-xl font-semibold mb-4">Location</h3>
                  <p className="text-gray-600">
                    {currentProperty.address.street}, {currentProperty.area}, {currentProperty.address.city}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-6">Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {currentProperty.furnished && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Furnished</span>
                    </div>
                  )}
                  {currentProperty.parking && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Parking</span>
                    </div>
                  )}
                  {currentProperty.balcony && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Balcony</span>
                    </div>
                  )}
                  {currentProperty.gym && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Gym</span>
                    </div>
                  )}
                  {currentProperty.pool && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Pool</span>
                    </div>
                  )}
                  {currentProperty.security && (
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Security</span>
                    </div>
                  )}
                  {/* Display amenities from the amenities array */}
                  {currentProperty.amenities && currentProperty.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h3 className="text-xl font-semibold mb-6">Contact Owner</h3>
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-semibold">
                      {currentProperty.owner.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{currentProperty.owner.name}</div>
                      <div className="text-sm text-gray-500">Property Owner</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold mb-4">
                  Express Interest
                </button>
                
                <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-colors font-semibold">
                  Contact Owner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 