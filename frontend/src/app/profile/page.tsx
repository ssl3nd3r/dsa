'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import React, { useState, useEffect } from 'react'
import { Fade } from '@mui/material';
import InformationForm from '@/components/Layouts/Proflie/InformationForm';
import ChangePasswordForm from '@/components/Layouts/Proflie/ChangePasswordForm';
import InterestedProperties from '@/components/Layouts/Proflie/InterestedProperties';
import ListAPropertyForm from '@/components/Layouts/Proflie/ListAPropertyForm';
import MyProperties from '@/components/Layouts/Proflie/MyProperties';

export default function Profile() {
  const [section, setSection] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (new URLSearchParams(window.location.search)).has('add-property') ? 'list-a-property' : 'info';
    }
    return 'info';
  });
  
  useEffect(() => {
    if (section === 'list-a-property') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [section]);

  return (
    <ProtectedRoute>  
      <div className='flex-1 p-4 h-full flex flex-col'>
        <div className='max-w-[1200px] mx-auto w-full flex md:flex-row flex-col gap-6 md:gap-10 divide-black dark:divide-white flex-1'>
          <div className='flex flex-col gap-8 md:gap-10'>
            <div className='flex md:flex-col md:flex-nowrap flex-wrap gap-4'>
              <button onClick={() => setSection('info')} className={`text-black dark:text-white quick-link w-fit ${section === 'info' ? 'active' : ''}`}>Info</button>
              <button onClick={() => setSection('change-password')} className={`text-black dark:text-white quick-link w-fit ${section === 'change-password' ? 'active' : ''}`}>Change Password</button>
            </div>
            <div className='flex md:flex-col md:flex-nowrap flex-wrap gap-4'>
              <button onClick={() => setSection('list-a-property')} className={`text-black dark:text-white quick-link w-fit ${section === 'list-a-property' ? 'active' : ''}`}>List a Property</button>
              <button onClick={() => setSection('interested-properties')} className={`text-black dark:text-white quick-link w-fit ${section === 'interested-properties' ? 'active' : ''}`}>Saved Properties</button>
              <button onClick={() => setSection('my-properties')} className={`text-black dark:text-white quick-link w-fit ${section === 'my-properties' ? 'active' : ''}`}>My Properties</button>
            </div>
          </div>
          <div className='md:w-px md:h-[unset] h-px bg-black dark:bg-white self-stretch '></div>
          <div className='flex flex-col relative flex-1'>
            <Fade in={section === 'info'} timeout={250} className='overflow-y-auto absolute top-0 left-0 w-full h-full pr-3'>
              <div>
                <InformationForm />
              </div>
            </Fade>
            <Fade in={section === 'change-password'} timeout={250} className='overflow-y-auto absolute top-0 left-0 w-full h-full pr-3'>
              <div>
                <ChangePasswordForm />
              </div>
            </Fade>
            <Fade in={section === 'list-a-property'} timeout={250} className='overflow-y-auto absolute top-0 left-0 w-full h-full pr-3'>
              <div>
                <ListAPropertyForm   />
              </div>
            </Fade>
            <Fade in={section === 'interested-properties'} timeout={250} className='overflow-y-auto absolute top-0 left-0 w-full h-full pr-3'>
              <div>
                <InterestedProperties />
              </div>
            </Fade>
            <Fade in={section === 'my-properties'} timeout={250} className='overflow-y-auto absolute top-0 left-0 w-full h-full pr-3'>
              <div>
                <MyProperties />
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
