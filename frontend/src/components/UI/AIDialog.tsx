import { Grow } from '@mui/material'
import React, { useRef, useState } from 'react'
import AIChatBot from './Assets/AIChatBot'
import CloseIcon from './Assets/CloseIcon'
import TextInput from './Inputs/TextInput'
import SendIcon from './Assets/SendIcon'
import api from '@/lib/api'
import AIMessage from './AIMessage'
import { AI_MESSAGES_INTRODUCTION } from '@/lib/constants'

interface AIDialogProps {
  isOpen: boolean;
  threadId: string;
  setIsOpen: (isOpen: boolean) => void;
  setThreadId: (threadId: string) => void;
}

export interface Message {
  role: 'user' | 'assistant';
  message: string;
  loading?: boolean;
  properties?: any[];
}

export default function AIDialog({ isOpen, threadId, setIsOpen, setThreadId }: AIDialogProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesContainer = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', message: AI_MESSAGES_INTRODUCTION[Math.floor(Math.random() * AI_MESSAGES_INTRODUCTION.length)], loading: false }
  ]);
  const handleSendMessage = async () => {
    setMessage('');
    setMessages((prev) => [...prev, { role: 'user', message }]);
    setMessages((prev) => [...prev, { role: 'assistant', message, loading: true }]);
    setLoading(true);
    setTimeout(() => {
      messagesContainer.current?.scrollTo({ top: messagesContainer.current.scrollHeight, behavior: 'smooth'});
    }, 100);
    
    try {
      const response = await api.post('/properties/chat', { message, thread_id: threadId });
      if (response.data.thread_id && response.data.thread_id !== threadId) {
        setThreadId(response.data.thread_id);
      }
      const newMessage: Message = { role: 'assistant', message: response.data.assistant_reply, loading: false }
      if (response.data.properties && response.data.properties.length > 0) {
        newMessage.properties = response.data.properties;
      }
      setMessages((prev) => [
        ...prev.slice(0, -1),
        newMessage
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', message: 'Sorry, I am having trouble processing your request. Please try again later.', loading: false }
      ]);
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      messagesContainer.current?.scrollTo({ top: messagesContainer.current.scrollHeight, behavior: 'smooth'});
    }, 100);
  }

  return (
    <>
  
    <Grow in={isOpen} timeout={300} unmountOnExit style={{ transformOrigin: 'bottom right' }}>
      <div className='fixed top-0 left-0 md:top-[unset] md:left-[unset] md:bottom-16 md:right-4 h-[100dvh] w-[100dvw] md:h-[550px] md:w-[400px] shadow-md md:rounded-xl z-[9999] border border-black'>
        <div className='flex flex-col h-full'>
          <div className='flex items-center border-b border-black gap-2 px-2.5 py-4 background-ai text-white dark:text-black md:rounded-t-xl justify-between'>
            <div className='items-center justify-center flex gap-2'>
              <div className='p-1.5 rounded-full bg-white text-black'>
                <AIChatBot size={20} />
              </div>
              <p className='text-sm !text-white font-semibold'>DSA AI</p>
            </div>
            <button className='cursor-pointer !text-white' onClick={() => setIsOpen(false)}>
              <CloseIcon size={20} />
            </button>
          </div>
          <div ref={messagesContainer} className='flex-1 px-2.5 py-4 overflow-y-auto messages-container bg-white'>
            <div className='flex flex-col gap-4 '>
              {messages.map((message, index) => (
                <AIMessage key={index} message={message} setIsOpen={setIsOpen}/>
              ))}
            </div>
          </div>
          <div className='flex items-center border-t border-black gap-2 px-2.5 py-4 md:rounded-b-xl background-ai'>
            <TextInput onKeyDown={(e) => {
              if (loading) return;
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }} className='flex-1' inputClassName='!text-sm !bg-white !text-black !placeholder-black/80' placeholder='Ask me anything...' label='Ask me anything...' name='ask' type='text' autoComplete='off' value={message} onChange={(e) => setMessage(e.target.value)} />
            <button disabled={!message || message.length < 2 || message === '' || loading} onClick={() => handleSendMessage()} className='p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 bg-white text-black cursor-pointer'>
              <SendIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </Grow>
    </>
  )
}
