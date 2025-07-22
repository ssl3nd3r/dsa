import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { addConversation, Conversation } from '@/lib/slices/messagingSlice';
import ConversationSelector from './ConversationSelector';
import pusher from '@/lib/pusher';
import { useAuth } from '@/lib/hooks/useAuth';

interface ConversationsListProps {
  handleConversationSelect: (conversation: Conversation) => void;
  isMobile?: boolean;
}

export default function ConversationsList({ handleConversationSelect, isMobile = false }: ConversationsListProps) {
  const { 
    conversations, 
    loading,
    currentConversation
  } = useSelector((state: RootState) => state.messaging);
  const dispatch = useDispatch();
  const {user} = useAuth();

  const [activeConversationId, setActiveConversationId] = useState<number | null>(
    currentConversation.id
  );

  useEffect(() => {
    const channel = pusher.subscribe('conversation-created.' + user?.id);
    
    channel.bind('new-conversation-created', ({conversation}: {conversation: Conversation}) => {
      console.log(conversation);
      dispatch(addConversation(conversation));
    });

    return () => {
      pusher.unsubscribe('conversation-created.' + user?.id);
    };
  }, []);

  // Keep local state in sync with Redux state
  useEffect(() => {
    setActiveConversationId(currentConversation.id);
  }, [currentConversation.id]);

  // Sort conversations by last_message created_at (latest first)
  const sortedConversations = React.useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.last_message?.created_at || a.created_at).getTime();
      const dateB = new Date(b.last_message?.created_at || b.created_at).getTime();
      return dateB - dateA; // Descending order (latest first)
    });
  }, [conversations]);

  // Wrapper function to handle conversation selection and manage active states
  const handleConversationSelectWrapper = (conversation: Conversation) => {
    // Set all other conversations to inactive by updating the active conversation ID
    setActiveConversationId(conversation.id);
    
    // Call the original handler with a no-op setIsActive since we manage state externally
    handleConversationSelect(conversation);
  };

  return (
    <>
      {isMobile && <div className='text-sm px-3.5'>Chats</div>}
      <div className={`overflow-y-auto absolute ${isMobile ? 'top-8 h-[calc(100%-32px)]' : 'top-0 h-full'} w-full left-0 `}>
        {loading.conversations ? (
          <div className='text-center text-sm text-gray-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>Loading conversations...</div>
        ) : sortedConversations.length === 0 ? (
          <div className='text-center text-sm text-gray-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>No conversations yet</div>
        ) : (
          sortedConversations.map((conversation) => (
            <ConversationSelector 
              key={conversation.id} 
              conversation={conversation}
              handleConversationSelect={handleConversationSelectWrapper} 
              isMobile={isMobile}
              isActive={activeConversationId === conversation.id}
            />
          ))
        )}
      </div>
    </>
  )
}
