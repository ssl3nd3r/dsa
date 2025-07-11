import React from 'react'
import { Message } from './AIDialog'
import { Fade } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AI_MESSAGES_SUCCESS, AI_MESSAGES_NO_RESULT } from '@/lib/constants'
import { RouteLink } from './RouteLink'
import { useAuth } from '@/lib/hooks/useAuth'
import LinkIcon from './Assets/LinkIcon'

export default function AIMessage({ message, setIsOpen }: { message: Message, setIsOpen: (isOpen: boolean) => void }) {
  const randomMessage = React.useMemo(() => {
    return message.properties && message.properties.length > 0
      ? AI_MESSAGES_SUCCESS[Math.floor(Math.random() * AI_MESSAGES_SUCCESS.length)]
      : AI_MESSAGES_NO_RESULT[Math.floor(Math.random() * AI_MESSAGES_NO_RESULT.length)];
  }, [message.properties]);
  
  const { user } = useAuth();

  return (
    <Fade in timeout={300}>
      <div className='flex flex-col gap-1 w-full '>
        <span className={`text-[10px] text-gray-700 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>{message.role === 'user' ? user?.name || 'You': 'DSA AI'}</span>
        <div className={`p-2.5 text-[12px] max-w-[80%] flex flex-col gap-1 rounded-lg !text-white ${message.role === 'user' ? 'self-end bg-[#fc466b]' : 'self-start bg-[#3f5efb]'}`}>
          {message.loading ?
          <p className='loader'></p> : 
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.message == '' ? randomMessage : message.message}
            </ReactMarkdown>
          }
          {message.properties && message.properties.length > 0 && (
            <div className='mt-4'>
              <div className='grid grid-cols-1 gap-2'>
                {message.properties.map((property) => (
                  <RouteLink key={property.slug+'-'+property.id} href={`/properties/${property.slug}`} onClick={() => {
                    setIsOpen(false);
                  }}> <LinkIcon size={12} className='inline' /> <span>{property.title}</span></RouteLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Fade>
  )
}
