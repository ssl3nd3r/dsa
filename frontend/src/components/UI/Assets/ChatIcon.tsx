import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { setBackUnreadCount } from '@/lib/slices/messagingSlice';

interface ChatIconProps {
  size?: number;
  unreadCount?: number;
}

export default function ChatIcon({ size = 20, unreadCount = 0 }: ChatIconProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentConversation } = useSelector((state: RootState) => state.messaging);
  const totalUnreadCount = useMemo(() => {
    return unreadCount - (currentConversation.unreadCount ?? 0);
  }, [currentConversation, unreadCount]);

  useEffect(() => {
    dispatch(setBackUnreadCount(totalUnreadCount));
  }, [totalUnreadCount]);

  return (
    <div className='relative'>
      {totalUnreadCount > 0 && (
        <div className='bg-red-500 absolute -right-2 min-w-[14px] text-center -top-2 px-1 py-0.5 rounded-sm text-[9px] text-white'>
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </div>
      )}
      <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81 80" width={size} height={size}>
        <g>
          <path fill="currentColor" d="m68.6 0.4h-44.5c-6.3 0-11.4 5.1-11.4 11.4v1.2h-1.2c-6.3 0-11.4 5.1-11.4 11.4v27.4c0 6.3 5.1 11.4 11.4 11.4h2.7l-2.4 14.4c-0.1 0.7 0.2 1.4 0.8 1.7 0.2 0.1 0.5 0.2 0.8 0.2 0.4 0 0.8-0.1 1.1-0.4l17.6-15.9h23.9c6.3 0 11.4-5.1 11.4-11.4v-1.2h1.2c6.3 0 11.4-5.1 11.4-11.4v-27.4c0-6.3-5.1-11.4-11.4-11.4zm-4.5 51.5c0 4.5-3.7 8.2-8.2 8.2h-24.3c-0.3 0-0.5 0-0.7 0.1 0 0-0.1 0-0.1 0.1-0.1 0.1-0.3 0.1-0.4 0.2l-14.7 13.1 1.9-11.7v-0.1-0.2c0-0.1 0-0.2-0.1-0.3v-0.2c0-0.1-0.1-0.2-0.2-0.4 0-0.1-0.1-0.1-0.1-0.2l-0.2-0.2c-0.1-0.1-0.2-0.1-0.3-0.2-0.1 0-0.1-0.1-0.2-0.1-0.1 0-0.2-0.1-0.2-0.1h-0.2-0.1-4.7c-4.5 0-8.2-3.7-8.2-8.2v-27.2c0-4.5 3.7-8.2 8.2-8.2h44.5c4.5 0 8.2 3.7 8.2 8.2v27.4zm12.6-12.7c0 4.5-3.7 8.2-8.2 8.2h-1.2v-22.9c0-6.3-5.1-11.4-11.4-11.4h-40v-1.2c0-4.5 3.7-8.2 8.2-8.2h44.5c4.5 0 8.2 3.7 8.2 8.2v27.3z"/>
          <path fill="currentColor" d="m16.5 32.7c-3 0-5.5 2.4-5.5 5.5 0 3 2.4 5.5 5.5 5.5 3 0 5.5-2.4 5.5-5.5-0.1-3-2.5-5.5-5.5-5.5zm0 7.7c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2 1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2z"/>
          <path fill="currentColor" d="m33.7 32.7c-3 0-5.5 2.4-5.5 5.5 0 3 2.4 5.5 5.5 5.5 3 0 5.5-2.4 5.5-5.5-0.1-3-2.5-5.5-5.5-5.5zm0 7.7c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2 1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2z"/>
          <path fill="currentColor" d="m50.9 32.7c-3 0-5.5 2.4-5.5 5.5 0 3 2.4 5.5 5.5 5.5 3 0 5.5-2.4 5.5-5.5-0.1-3-2.5-5.5-5.5-5.5zm0 7.7c-1.2 0-2.2-1-2.2-2.2 0-1.2 1-2.2 2.2-2.2 1.2 0 2.2 1 2.2 2.2 0 1.2-1 2.2-2.2 2.2z"/>
        </g>
      </svg>

    </div>
  )
}
