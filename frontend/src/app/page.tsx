'use client';

import React from 'react';
// import PropertyTypeCard from '@/components/UI/PropertyTypeCard';
// import SearchComponentMobile from '@/components/UI/SearchComponentMobile';
// import SearchComponent from '@/components/UI/SearchComponent';
import SearchComponentHome from '@/components/UI/SearchComponentHome';
// import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HomePage() {
  return (
    // <ProtectedRoute> 
    <div className="flex-1 pb-10">
      <div style={{backgroundImage: 'url(/dubai-skyline.jpg)'}} className="w-full bg-black/60 bg-blend-darken bg-cover bg-center pb-28 pt-14 md:py-28">
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
      <div className="-mt-[70px] px-4">
        <SearchComponentHome maxWidth='1200px'/>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
