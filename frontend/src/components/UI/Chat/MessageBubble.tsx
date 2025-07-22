import { Message } from '@/lib/slices/messagingSlice';
import { formatDate } from '@/lib/helpers';
import Sending from '@/components/UI/Assets/Sending';
import Failed from '@/components/UI/Assets/Failed';
import Sent from '@/components/UI/Assets/Sent';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const user = useSelector((state: RootState) => state.auth.user);  

  return (
    <div
      className={`px-2 py-3 rounded-lg w-fit max-w-[70%] min-w-[120px] ${
        message.sender_id === user?.id || message.is_optimistic
          ? 'ml-auto bg-blue-500 text-white'
          : 'bg-gray-700 text-white'
      }`}
    >
      <div dangerouslySetInnerHTML={{ __html: message.content || '' }} className='text-sm'></div>
      <div className='flex items-center justify-between gap-2'>
        <div className='text-xs opacity-90 mt-1'>
          {formatDate(message.created_at)}
        </div>
        {message.is_optimistic && (
          <Sending size={16} />
        )}
        {(message.status === 'failed' && !message.is_optimistic && message.sender_id === user?.id) && (
          <Failed size={16} />
        )}
        {(message.status !== 'failed' && !message.is_optimistic && message.sender_id === user?.id) && (
          <Sent size={13} />
        )}
        {/* {(message.status === 'read' && !message.is_optimistic && message.sender_id === user?.id) && (
          <div className='flex'>
            <Sent isRead size={16} />
            <Sent size={16} />
          </div>
        )} */}
      </div>
    </div>
  )
}
