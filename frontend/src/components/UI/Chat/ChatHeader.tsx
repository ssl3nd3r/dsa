import React from 'react'
import { RouteLink } from '../RouteLink'
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import ArrowEnter from '../Assets/ArrowEnter';


interface ChatHeaderProps {
  setShowChats: (show: boolean) => void;
}

export default function ChatHeader({ setShowChats }: ChatHeaderProps) {
  const { currentConversation, loading } = useSelector((state: RootState) => state.messaging);
  return (
    currentConversation.otherUser && !loading.messages &&
    <div className='border-b pb-2 flex flex-col gap-2'>
      <button className='md:hidden mb-1 flex items-center gap-1.5' onClick={() => setShowChats(true)}>
        <ArrowEnter className='rotate-180' /> Back
      </button>
      <div className='flex items-center gap-2'>
        <RouteLink className='h-full w-16 md:block hidden' href={`/properties/${currentConversation.property?.slug}`}>
          <img src={currentConversation.property?.images[0] ?? ''} className='h-full w-full object-cover rounded-sm' alt={currentConversation.property?.title ?? ''} />
        </RouteLink>
        <div className='flex flex-col gap-1'>
          <div className='font-medium'>{currentConversation.otherUser.name}</div>
          {currentConversation.property && (
            <RouteLink href={`/properties/${currentConversation.property.slug}`} className='text-xs dark:text-gray-300 text-gray-600'>({currentConversation.property.room_type} in {currentConversation.property.property_type}) - {currentConversation.property.title} - {currentConversation.property.price.toLocaleString()} AED {currentConversation.property.billing_cycle}</RouteLink>
          )}
        </div>
      </div>
    </div>  
  )
}
