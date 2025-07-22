import { AppDispatch, RootState } from '@/lib/store';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageToConversation, markConversationAsRead, Message, sendMessage } from '@/lib/slices/messagingSlice';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import pusher from '@/lib/pusher';
import MessageInput from './MessageInput';

interface MessagesContainerProps {
  selectedUserId: number | null;
}

export default function MessagesContainer({ selectedUserId }: MessagesContainerProps) {
  const { currentConversation, loading } = useSelector((state: RootState) => state.messaging);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [messageInput, setMessageInput] = useState('');

  // Subscribe to Pusher channel for real-time messages
  useEffect(() => {
    if (!currentConversation.id) return;

    const channel = pusher.subscribe(`conversation.${currentConversation.id}`);
    
    channel.bind('message-created', ({message}: {message: Message}) => {
      if (message && message.sender_id !== user?.id) {
        dispatch(addMessageToConversation(message));
        if (currentConversation.id) dispatch(markConversationAsRead(currentConversation.id));
        setTimeout(() => {
          scrollToBottom();
        }, 50);
      }
    });

    return () => {
      pusher.unsubscribe(`conversation.${currentConversation.id}`);
    };
  }, [currentConversation.id, user?.id, dispatch]);

  useEffect(() => {
    if (currentConversation.messages.length > 0 && !loading.messages) {
      scrollToBottom();
    }
  }, [currentConversation.messages, loading.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUserId) return;

    const newMessage: Message = {
      id: Date.now(),
      conversation_id: currentConversation.id || 0,
      sender_id: user?.id || 0,
      content: messageInput.trim(),
      is_media: false,
      status: 'sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_optimistic: true,
    }

    dispatch(addMessageToConversation(newMessage));
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    setMessageInput('');

    try {
      await dispatch(sendMessage({
        recipientId: selectedUserId,
        content: messageInput.trim(),
        isMedia: false,
        propertyId: currentConversation.property?.id
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
    } 
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }

  return (
    <>
      <div ref={messagesContainerRef} className='flex flex-col gap-3 overflow-y-auto flex-1 pr-2'>
        {loading.messages ? (
          <div className='text-center text-gray-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>Loading messages...</div>
        ) : currentConversation.messages.length === 0 ? (
          <div className='text-center text-gray-500 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>{currentConversation.id ? 'No messages yet' : 'Select a conversation to start chatting'}</div>
        ) : (
            currentConversation.messages
            .map((message: Message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>
      {selectedUserId && (
        <MessageInput
          messageInput={messageInput} 
          setMessageInput={setMessageInput} 
          handleSendMessage={handleSendMessage} 
          handleKeyPress={handleKeyPress} 
        />
      )}
   </>
  )
}
