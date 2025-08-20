"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import { RouteLink } from '@/components/UI/RouteLink';
import React, { useEffect, useState } from 'react'
import { logout } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/store';
import MainLogo from '@/components/UI/MainLogo';
import SearchModal from './SearchModal';
import SearchIcon from '../UI/Assets/SearchIcon';
import LogoutIcon from '../UI/Assets/LogoutIcon';
import ChatIcon from '../UI/Assets/ChatIcon';
import pusher from '@/lib/pusher';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user } = useAuth({ disableRedirect: true });
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(user?.unread_count || 0);

  useEffect(() => {
    setTotalUnreadCount(user?.unread_count || 0);
  }, [user?.unread_count]);

  useEffect(() => {
    const channel = pusher.subscribe(`total-read-count.${user?.id}`);
    channel.bind('total-read-count', ({totalReadCount}: { totalReadCount: number }) => {
      setTotalUnreadCount(totalReadCount);
    });
  }, [user?.id]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  }

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
            <RouteLink href='/profile' className='relative p-4 bg-dsa-blue rounded-full'>
              <span className='text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>{user?.name[0]}</span>
            </RouteLink> 
            <SearchModal open={searchOpen} setSearchOpen={setSearchOpen} />
            <RouteLink href='/chat'>
              <ChatIcon size={32} unreadCount={totalUnreadCount} />
            </RouteLink>
            <button className='cursor-pointer -ml-2' onClick={handleLogout}>
              <LogoutIcon size={36} />
            </button>  
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
