"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import React, { useState } from 'react'
import { logout } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import MainLogo from '@/components/UI/MainLogo';
import SearchModal from './SearchModal';
import SearchIcon from '../UI/Assets/SearchIcon';

export default function Header() {
  const { isAuthenticated } = useAuth({ disableRedirect: true });
  const dispatch = useDispatch<AppDispatch>();
  const [searchOpen, setSearchOpen] = useState(false);
  return (
      <div className='flex justify-between items-center p-4'>
        <div className='flex items-center gap-4'>
          <Link href='/'>
            <MainLogo size={34} />
          </Link>
        </div>
        <div className='flex items-center gap-4'>
        {isAuthenticated ? (
          <>
            <button className='cursor-pointer' onClick={() => setSearchOpen(!searchOpen)}><SearchIcon /></button>
            <Link href='/profile'>
              <img src="/placeholder.png" alt="placeholder" className='w-8 h-8 rounded-full' />
            </Link>
            <SearchModal open={searchOpen} setSearchOpen={setSearchOpen} />
            <button onClick={() => dispatch(logout())} className='quick-link'>Logout</button>  
          </>
        ) : (
          <> 
            <Link href='/login' className='quick-link'>
              Login
            </Link>
            <Link href='/register' className='quick-link'>
              Register
            </Link>
          </>
        )}
        </div>
      </div>
  )
}
