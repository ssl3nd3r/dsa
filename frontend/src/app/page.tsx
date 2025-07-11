'use client';

import React from 'react';
import PropertyTypeCard from '@/components/UI/PropertyTypeCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute> 
    <div className="flex-1 pb-10">
      <div style={{backgroundImage: 'url(/dubai-skyline.jpg)'}} className="w-full bg-black/60 bg-blend-darken bg-cover bg-center py-28">
        <div className='flex flex-col items-center justify-center h-full px-4'>
          <h2 className="text-center text-3xl font-bold !text-white">
            Welcome to Dubai Smart Accommodations
          </h2>
          <p className="mt-2 text-center text-sm !text-white">
            We are a team of dedicated professionals who are passionate about providing the best possible service to our clients.
          </p>
          <h1 className='mt-14 text-center text-xl !text-white'>What are you looking for?</h1>
        </div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 max-w-[800px] mx-auto px-4 -mt-[90px] justify-center items-baseline gap-4 w-full'>
        <PropertyTypeCard label='Studio' type='Studio' />
        <PropertyTypeCard label='1 Bedroom' type='1BR' />
        <PropertyTypeCard label='2 Bedroom' type='2BR' />
        <PropertyTypeCard label='3 Bedroom' type='3BR' />
        <PropertyTypeCard label='4+ Bedroom' type='4BR+' />
        <PropertyTypeCard label='Private Room' type='Private Room' propertyOrRoomType='room' />
      </div>
    </div>
    </ProtectedRoute>
  );
}
