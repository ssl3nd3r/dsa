'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { 
  clearConversations,
  fetchConversations, 
  fetchConversation, 
  Conversation, 
} from '@/lib/slices/messagingSlice';
import { AppDispatch } from '@/lib/store';
import ConversationsList from '@/components/UI/Chat/ConversationsList';
import ChatHeader from '@/components/UI/Chat/ChatHeader';
import MessagesContainer from '@/components/UI/Chat/MessagesContainer';
  
export default function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showChats, setShowChats] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get conversationId from URL without useSearchParams
  const getConversationId = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('conversationId');
    }
    return null;
  };

  // Fetch conversations on component mount
  useEffect(() => {
    dispatch(fetchConversations()).unwrap().then(({conversations}) => {
      const conversationId = getConversationId();
      if (typeof window !== 'undefined' && window.history && window.location) {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
      }
      if (conversationId) {
        const conversation = conversations.find((conversation: Conversation) => conversation.id === parseInt(conversationId));
        if (conversation) {
          handleConversationSelect(conversation, true);
        }
      }
    });

    return () => {
      dispatch(clearConversations());
      // Abort any pending requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dispatch]);


  // Handle conversation selection
  const handleConversationSelect = (conversation: Conversation, fromPropertyPage?: boolean) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current && !fromPropertyPage) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    const otherUserId = conversation.other_user.id;
    setSelectedUserId(otherUserId);
    
    // Pass the AbortController signal to the fetchConversation action
    dispatch(fetchConversation({ 
      conversationId: conversation.id,
      signal: abortControllerRef.current.signal 
    }));
    
    setShowChats(false);
  };

  return (
    <ProtectedRoute>  
      <div className='flex-1 p-4 h-full flex flex-col'>
        <div className='max-w-[1200px] mx-auto w-full flex flex-1'>
          {/* Conversations List */}
          <div className='md:flex hidden flex-col relative md:w-[30%] w-full'>
            <ConversationsList handleConversationSelect={handleConversationSelect} />
          </div>
          
          <div className='md:w-px md:h-[unset] md:block hidden bg-black dark:bg-white self-stretch'></div>
          {/* Chat Area */}
          <div className='flex flex-col relative md:w-[70%] w-full'>
            <div className='absolute top-0 left-0 md:pl-5 w-full h-full flex flex-col gap-4 md:pb-0 pb-4'>
              {/* Chat Header */}
              <ChatHeader setShowChats={setShowChats}/>
              {/* Messages Container */}
              <MessagesContainer selectedUserId={selectedUserId} />
            </div>
            <div className={`md:hidden absolute top-0 w-dvw h-full flex flex-col gap-4 md:pb-0 pb-4 bg-[var(--background)] ${showChats ? '-left-4' : '-left-[200%]'} transition-all duration-300`}>
              <ConversationsList isMobile handleConversationSelect={handleConversationSelect} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
