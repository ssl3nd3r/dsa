import React, { useEffect, useState } from 'react'
import { Conversation, Message, updateLastMessage } from '@/lib/slices/messagingSlice';
import pusher from '@/lib/pusher';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatDate } from '@/lib/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface ConversationSelectorProps {
  conversation: Conversation;
  handleConversationSelect: (conversation: Conversation) => void;
  isMobile?: boolean;
  isActive?: boolean;
}

export default function ConversationSelector({ conversation, handleConversationSelect, isMobile = false, isActive: externalIsActive }: ConversationSelectorProps) {
  const [readCount, setReadCount] = useState(conversation.unread_count);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state: RootState) => state.messaging);
  const [isActive, setIsActive] = useState(currentConversation.id === conversation.id);

  useEffect(() => {
    // Use external isActive prop if provided, otherwise fall back to internal state
    if (externalIsActive !== undefined) {
      setIsActive(externalIsActive);
    } else {
      setIsActive(currentConversation.id === conversation.id);
    }
  }, [externalIsActive, currentConversation.id, conversation.id]);

  useEffect(() => {
    const channel = pusher.subscribe(`conversation-count.${conversation.id}.${user?.id}`);
    channel.bind('conversation-read-count', ({readCount, message}: { readCount: number, message: Message | null }) => {
      setReadCount(readCount);
      if (message) {
        dispatch(updateLastMessage({message, conversationId: conversation.id}));
      }
    });

    return () => {
      pusher.unsubscribe(`conversation-count.${conversation.id}.${user?.id}`);
    };
  }, [conversation.id, user?.id]);

  return (
    <button
      key={conversation.id}
      disabled={isActive && !isMobile}
      onClick={() => {
        handleConversationSelect(conversation);
      }}
      className={`p-3.5 flex gap-2 transition-colors duration-300 cursor-pointer disabled:cursor-default items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left ${
        isActive ? 'bg-gray-100/80 dark:bg-gray-600/80' : ''
      }`}
    >
      <div className='flex-1 min-w-0'>
        <div className='text-sm font-medium truncate'>
          {conversation.other_user.name}
        </div>
        <div className='text-xs dark:text-gray-300 text-gray-600 truncate'>
          {conversation.last_message?.content
            ? (() => {
                const div = document.createElement('div');
                div.innerHTML = conversation.last_message.content.replaceAll('<br>', ' ');
                return div.textContent || div.innerText || '';
              })()
            : 'No messages yet'}
        </div>
        <span className='text-xs dark:text-gray-300 text-gray-600'>{formatDate(conversation.last_message?.created_at)}</span>
      </div>
      {readCount > 0 && !isActive && (
        <span className='bg-red-500 relative p-3 rounded-full min-w-[24px] h-[24px] flex items-center justify-center'>
          <span className='text-white text-xs'>
            {readCount > 99 ? '99+' : readCount}
          </span>
        </span>
      )}
    </button>
  )
}
