import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/authStore';
import { messageApi } from '@/utils/api';

interface Message {
  _id: string;
  content: string;
  sender: { _id: string; name: string; email: string };
  recipient: { _id: string; name: string; email: string };
  isRead: boolean;
  createdAt: string;
  messageType: string;
  relatedProperty?: { _id: string; title: string; area: string; price: number };
}

interface Conversation {
  userId: string;
  user: { _id: string; name: string; email: string };
  lastMessage: Message;
  unreadCount: number;
}

export default function Messages() {
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/onboarding');
      return;
    }

    fetchConversations();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle recipient parameter from URL
  useEffect(() => {
    const recipientId = router.query.recipient as string;
    if (recipientId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.userId === recipientId);
      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        // Create a new conversation if it doesn't exist
        // This would typically require fetching user details from the API
        console.log('Starting new conversation with:', recipientId);
      }
    }
  }, [router.query.recipient, conversations]);

  const fetchConversations = async () => {
    try {
      if (token) {
        const data = await messageApi.getConversations(token);
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      if (token) {
        const data = await messageApi.getConversation(token, userId);
        setMessages(data.messages || []);
        await messageApi.markAsRead(token, userId);
        // Update unread count in conversations
        setConversations(prev => 
          prev.map(conv => 
            conv.userId === userId 
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !token) return;

    try {
      setSending(true);
      const data = await messageApi.sendMessage(token, {
        recipientId: selectedConversation.userId,
        content: newMessage.trim()
      });

      // Add new message to the list
      setMessages(prev => [...prev, data.data]);
      setNewMessage('');

      // Update conversation list with new last message
      setConversations(prev => 
        prev.map(conv => 
          conv.userId === selectedConversation.userId
            ? { ...conv, lastMessage: data.data }
            : conv
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-96">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Conversations</h2>
              </div>
              <div className="overflow-y-auto h-full">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.userId}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.userId === conversation.userId
                          ? 'bg-blue-50 border-blue-200'
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {conversation.user.name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">
                      {selectedConversation.user.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.user.email}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${
                          message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender._id === user?._id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender._id === user?._id
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                          {message.relatedProperty && (
                            <div className="mt-2 p-2 bg-white bg-opacity-20 rounded">
                              <p className="text-xs font-semibold">
                                Re: {message.relatedProperty.title}
                              </p>
                              <p className="text-xs">
                                {message.relatedProperty.area} - AED {message.relatedProperty.price}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={sending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 