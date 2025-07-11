"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import { RouteLink } from '@/components/UI/RouteLink';
import React, { useState } from 'react'
import { logout } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import MainLogo from '@/components/UI/MainLogo';
import SearchModal from './SearchModal';
import SearchIcon from '../UI/Assets/SearchIcon';

export default function Header() {
  const { isAuthenticated, user } = useAuth({ disableRedirect: true });
  const dispatch = useDispatch<AppDispatch>();
  const [searchOpen, setSearchOpen] = useState(false);
  return (
      <div className='flex sticky top-0 z-50 bg-[var(--background)] justify-between items-center p-4'>
        <div className='flex items-center gap-4'>
          <RouteLink href='/'>
            <MainLogo size={34} />
          </RouteLink>
        </div>
        <div className='flex items-center gap-4'>
        {isAuthenticated ? (
          <>
            <button className='cursor-pointer' onClick={() => setSearchOpen(!searchOpen)}><SearchIcon /></button>
              <RouteLink href='/profile' className='relative p-4 border bg-black dark:bg-white rounded-full'>
                <span className='text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white dark:text-black'>{user?.name[0]}</span>
              </RouteLink> 
            <SearchModal open={searchOpen} setSearchOpen={setSearchOpen} />
            <button onClick={() => dispatch(logout())} className='quick-link'>Logout</button>  
          </>
        ) : (
          <> 
            <RouteLink href='/login' className='quick-link'>
              Login
            </RouteLink>
            <RouteLink href='/register' className='quick-link'>
              Register
            </RouteLink>
          </>
        )}
        </div>
      </div>
  )
}
