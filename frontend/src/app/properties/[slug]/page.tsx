'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { fetchPropertyBySlug, addToInterests, removeFromInterests } from '@/lib/slices/propertySlice';
import { sendMessage } from '@/lib/slices/messagingSlice';
import GalleryIcon from '@/components/UI/Assets/GalleryIcon';
import PropertyImagesGallery from '@/components/UI/PropertyImagesGallery';
import Button from '@/components/UI/Button';
import {ProtectedRoute} from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import BookMark from '@/components/UI/Assets/BookMark';
import BookMarkFilled from '@/components/UI/Assets/BookMarkFilled';
import { RouteLink } from '@/components/UI/RouteLink';
import { useRouter } from 'next/navigation';
  
interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { currentProperty } = useSelector((state: RootState) => state.property);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  // Unwrap the params Promise
  const { slug } = React.use(params);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPropertyBySlug(slug));
    }
  }, [dispatch, slug]);

  const handleChatOwner = () => {
    if (currentProperty?.owner?.id && !isSending) {
      setIsSending(true);
      dispatch(sendMessage({
        recipientId: currentProperty.owner?.id,
        content: `Hello ${currentProperty.owner?.name}, I am interested in your property<br><a href="/properties/${currentProperty.slug}"><b>${currentProperty.title}</b></a>`,
        isMedia: false,
        propertyId: currentProperty.id,
      })).unwrap().then(({message, conversation}) => {
        console.log(message);
        router.push(`/chat?conversationId=${conversation.id}`);
      }).finally(() => {
        setIsSending(false);
      });
    }
  } 

  if (!currentProperty) {
    return (
      <ProtectedRoute>
        <div className='hidden'>
          <RouteLink href='/'/>            
        </div>
        <div className="flex-1 py-10">
          <div className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold">Property not found</h1>
            <p>The property you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </ProtectedRoute>
      ) ;
  }

  return (
    <ProtectedRoute>  
        <div className="flex-1 py-10 px-4">
          <div className="max-w-[1200px] mx-auto">
            {/* Property Images */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              {currentProperty.images && currentProperty.images.length > 0 ? (
                <div className="w-full h-96 object-cover relative" style={{
                  backgroundImage: `url(${currentProperty.images[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <button className="absolute cursor-pointer bottom-4 right-4" onClick={() => setGalleryOpen(true)}>
                    <GalleryIcon size={48} />
                  </button>
                  <PropertyImagesGallery open={galleryOpen} images={currentProperty.images} setGalleryOpen={setGalleryOpen} />
                </div>
              ) : (
                <div className="w-full h-96 dark:bg-black bg-white flex items-center justify-center">
                  <span className="dark:text-white text-black text-xl">No Image Available</span>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-8 mb-8">
                  <div className="flex md:flex-row flex-col gap-y-5 md:items-center md:justify-between justify-start mb-6">
                    <h1 className="text-3xl font-bold dark:text-white text-black">{currentProperty.title}</h1>
                    <div className='flex flex-col gap-1'>
                      <div className="text-2xl flex items-center gap-2 font-bold dark:text-white text-black">
                        <span className="text-black dark:text-white">AED</span>
                        {currentProperty.price.toLocaleString()}
                      </div>
                      <span className="text-sm text-black dark:text-white md:text-right text-left">
                        {currentProperty.billing_cycle}
                      </span>
                    </div>
                  </div>
                  
                  <p className="dark:text-white text-black mb-6">{currentProperty.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 md:gap-x-6 md:gap-y-3 mb-6">
                    <span className="dark:text-white text-black">{currentProperty.bedrooms} Bedrooms</span>
                    <span className="dark:text-white text-black">{currentProperty.bathrooms} Bathrooms</span>
                    <span className="dark:text-white text-black">{currentProperty.location}</span>
                    <span className="dark:text-white text-black">{currentProperty.size} ft<sup>2</sup></span>

                    <span className="dark:bg-blue-800 dark:text-blue-100 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {currentProperty.property_type}
                    </span>
                    <span className="dark:bg-green-800 bg-green-100 dark:text-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {currentProperty.room_type}
                    </span>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="dark:text-white text-black text-xl font-semibold mb-4">Location</h3>
                    <p className="dark:text-white text-black">
                      {currentProperty.address.street}, {currentProperty.location}, {currentProperty.address.city}
                    </p>
                  </div>
                  <div className='mt-6 w-fit text-xs px-3 py-1 bg-blue-800 text-blue-100 rounded-full'>Published {new Date(currentProperty.created_at ?? '').toLocaleDateString('en-GB')}</div>
                </div>

                {/* Amenities */}
                <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-8">
                  <h3 className="dark:text-white text-black text-xl font-semibold mb-6">Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentProperty.furnished && (
                      <div className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">Furnished</span>
                      </div>
                    )}
                    {currentProperty.parking && (
                      <div className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">Parking</span>
                      </div>
                    )}
                    {currentProperty.balcony && (
                      <div className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">Balcony</span>
                      </div>
                    )}
                    {currentProperty.gym && (
                      <div className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">Gym</span>
                      </div>
                    )}
                    {currentProperty.pool && (
                      <div className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">Pool</span>
                      </div>
                    )}
                    {currentProperty.security && (
                      <div className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">Security</span>
                      </div>
                    )}
                    {/* Display amenities from the amenities array */}
                    {currentProperty.amenities && currentProperty.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <span className="dark:text-green-500 text-green-500 mr-2">✓</span>
                        <span className="dark:text-white text-black">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-8 sticky top-24">
                  <div className='flex items-center justify-between'>
                    <h3 className="text-xl font-semibold mb-6">Contact Owner</h3>
                      {currentProperty.owner?.id !== user?.id && 
                        (!currentProperty.is_interested ? (
                          <button className='cursor-pointer' onClick={() => dispatch(addToInterests(currentProperty.slug))}>
                            <BookMark />
                          </button>
                        ) : (
                          <button className='cursor-pointer' onClick={() => dispatch(removeFromInterests(currentProperty.slug))}>
                            <BookMarkFilled />
                          </button>))
                        }
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full mr-4 flex items-center justify-center text-white font-semibold">
                        {currentProperty.owner?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{currentProperty.owner?.name}</div>
                        <div className="text-sm text-black dark:text-white">Property Owner</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 flex flex-col gap-2">
                    <Button disabled={isSending} className="w-full disabled:opacity-50" onClick={handleChatOwner}>
                      {isSending ? 'Sending...' : 'Chat Owner'}
                    </Button>
                    {currentProperty.owner?.phone && (
                      <Button className="w-full" onClick={() => window.open(`tel:${currentProperty.owner?.phone}`, '_blank')}>
                        Call Owner
                      </Button>
                    )}
                    {currentProperty.owner?.email && (
                      <Button className="w-full" onClick={() => window.open(`mailto:${currentProperty.owner?.email}`, '_blank')}>
                        Email Owner
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </ProtectedRoute>
  );
} 