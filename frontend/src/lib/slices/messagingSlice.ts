import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authSlice';
import { Property } from './propertySlice';
import api from '../api';

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_media: boolean;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  created_at: string;
  updated_at: string;
  sender?: User;
  is_optimistic?: boolean;
}

export interface Conversation {
  id: number;
  other_user: User;
  last_message: Message;
  unread_count: number;
  total_messages: number;
  updated_at: string;
  created_at: string;
  property?: Property;
}



export interface MessagingState {
  conversations: Conversation[];
  currentConversation: {
    id: number | null;
    otherUser: User | null;
    messages: Message[];
    property: Property | null;
    unreadCount?: number;
  };
  unreadCount: number;
  loading: {
    conversations: boolean;
    messages: boolean;
    sending: boolean;
    unreadCount: boolean;
  };
  error: string | null;
}

const initialState: MessagingState = {
  conversations: [],
  currentConversation: {
    id: null,
    otherUser: null,
    messages: [],
    property: null,
    unreadCount: 0,
  },
  unreadCount: 0,
  loading: {
    conversations: false,
    messages: false,
    sending: false,
    unreadCount: false,
  },
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'messaging/fetchConversations',
  async () => {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  }
);

export const fetchConversation = createAsyncThunk(
  'messaging/fetchConversation',
  async ({ conversationId, signal }: { conversationId: number; signal?: AbortSignal }) => {
    const response = await api.get(`/messages/conversation/${conversationId}`, {
      signal
    });
    return response.data.data;
  }
);

export const sendMessage = createAsyncThunk(
  'messaging/sendMessage',
  async ({ recipientId, content, isMedia = false, propertyId }: { 
    recipientId: number; 
    content: string; 
    isMedia?: boolean;
    propertyId?: number;
  }) => {
    const response = await api.post('/messages', {
      recipient_id: recipientId,
      content,
      is_media: isMedia,
      property_id: propertyId,
    });
    return response.data.data;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'messaging/fetchUnreadCount',
  async () => {
    const response = await api.get('/messages/unread-count');
    return response.data.data.unread_count;
  }
);

export const markConversationAsRead = createAsyncThunk(
  'messaging/markConversationAsRead',
  async (conversationId: number) => {
    await api.put(`/messages/conversation/${conversationId}/read`);
    return conversationId;
  }
);

export const markAllAsRead = createAsyncThunk(
  'messaging/markAllAsRead',
  async (userId: number) => {
    await api.put(`/messages/user/${userId}/read-all`);
    return userId;
  }
);

export const deleteMessage = createAsyncThunk(
  'messaging/deleteMessage',
  async (messageId: number) => {
    await api.delete(`/messages/${messageId}`);
    return messageId;
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearConversations: (state) => {
      state.conversations = [];
      state.currentConversation = {
        id: null,
        otherUser: null,
        messages: [],
        property: null,
        unreadCount: 0,
      };
    },
    addMessageToConversation: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      
      // Add to current conversation if it matches
      if (state.currentConversation.id === message.conversation_id) {
        // Check if message already exists to prevent duplicates
        const existingMessage = state.currentConversation.messages.find(
          msg => msg.id === message.id
        );
        if (!existingMessage) {
          state.currentConversation.messages.push(message);
          // Sort messages by created_at to maintain order
          state.currentConversation.messages.sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        }

        // Only increment unread count if message is from other user
        if (message.sender_id === state.currentConversation.otherUser?.id) {
          state.currentConversation.unreadCount = state.currentConversation.unreadCount ? state.currentConversation.unreadCount++ : 1;
        }
      }
      
      // Update conversation in list
      const conversationIndex = state.conversations.findIndex(
        conv => conv.id === message.conversation_id
      );
      
      if (conversationIndex !== -1) {
        const conversation = state.conversations[conversationIndex];
        conversation.last_message = message;
        conversation.updated_at = message.created_at;
        
        // Move conversation to top
        const updatedConversation = state.conversations.splice(conversationIndex, 1)[0];
        state.conversations.unshift(updatedConversation);
      }
    },
    updateLastMessage: (state, action: PayloadAction<{message: Message, conversationId: number}>) => {
      const {message, conversationId} = action.payload;
      
      // Update conversation in list
      const conversationIndex = state.conversations.findIndex(
        conv => conv.id === conversationId
      );
      
      if (conversationIndex !== -1) {
        const conversation = state.conversations[conversationIndex];
        conversation.last_message = message;
        conversation.updated_at = message.created_at;
        
        // Move conversation to top
        const updatedConversation = state.conversations.splice(conversationIndex, 1)[0];
        state.conversations.unshift(updatedConversation);
      }
    },
    updateMessageStatus: (state, action: PayloadAction<{ 
      messageId: number; 
      status: 'sent' | 'delivered' | 'read';
    }>) => {
      const { messageId, status } = action.payload;
      
      // Update in current conversation
      const messageIndex = state.currentConversation.messages.findIndex(
        msg => msg.id === messageId
      );
      if (messageIndex !== -1) {
        state.currentConversation.messages[messageIndex].status = status;
      }
      
      // Update in conversations list
      state.conversations.forEach(conversation => {
        if (conversation.last_message.id === messageId) {
          conversation.last_message.status = status;
        }
      });
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state, action: PayloadAction<number>) => {
      const count = action.payload;
      state.unreadCount = Math.max(0, state.unreadCount - count);
    },
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      });

    // Fetch conversation
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.loading.messages = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.loading.messages = false;
        const { conversation, other_user, messages } = action.payload;
        state.currentConversation = {
          id: conversation.id,
          otherUser: other_user,
          messages: messages,
          property: conversation.property,
          unreadCount: 0,
          
        };
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.loading.messages = false;
        // Don't set error for aborted requests
        console.log(action.error.name);
        
        if (action.error.name !== 'AbortError') {
          state.error = action.error.message || 'Failed to fetch conversation';
        }
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<{ message: Message, conversation: Conversation }>) => {
        state.loading.sending = false;
        const { message, conversation } = action.payload;
        
        // Add message to current conversation
        if (state.currentConversation.id === conversation.id) {
          const optimisticMessageIndex = state.currentConversation.messages.findIndex(
            msg => msg.is_optimistic
          );
          if (optimisticMessageIndex !== -1) {
            state.currentConversation.messages[optimisticMessageIndex] = message;
          } else {
            state.currentConversation.messages.push(message);
          }
          state.currentConversation.messages.sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        }
        
        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === conversation.id
        );
        
        if (conversationIndex !== -1) {
          const conv = state.conversations[conversationIndex];
          conv.last_message = message;
          conv.updated_at = message.created_at;
          conv.total_messages += 1;
          
          // Move to top
          const updatedConversation = state.conversations.splice(conversationIndex, 1)[0];
          state.conversations.unshift(updatedConversation);
        } else {
          // Add new conversation if it doesn't exist
          // We need to determine the other user from the message sender
          const currentUserId = state.currentConversation.otherUser?.id;
          const otherUser: User = message.sender_id === currentUserId 
            ? state.currentConversation.otherUser! 
            : { 
                id: message.sender_id, 
                name: 'Unknown User', 
                email: '', 
                is_verified: false,
                is_active: true,
                unread_count: 0,
                created_at: '', 
                updated_at: '',
              }; // Fallback
          
          state.conversations.unshift({
            id: conversation.id,
            other_user: otherUser,
            last_message: message,
            unread_count: 0,
            total_messages: 1,
            updated_at: message.created_at,
            created_at: conversation.created_at,
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sending = false;
        // Find and remove the optimistic message
        const optimisticMessageIndex = state.currentConversation.messages.findIndex(
          msg => msg.is_optimistic
        );
        if (optimisticMessageIndex !== -1) {
          state.currentConversation.messages[optimisticMessageIndex].status = 'failed';
          state.currentConversation.messages[optimisticMessageIndex].is_optimistic = false;
        }
        state.error = action.error.message || 'Failed to send message';
      });

    // Fetch unread count
    builder
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading.unreadCount = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading.unreadCount = false;
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.loading.unreadCount = false;
      });

    // Mark conversation as read
    builder
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        
        // Mark all messages in current conversation as read
        if (state.currentConversation.id === conversationId) {
          state.currentConversation.messages.forEach(message => {
            message.status = 'read';
          });
        }
        
        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.id === conversationId
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unread_count = 0;
        }

        // Decrement unread count when marking conversation as read
        state.currentConversation.unreadCount = state.currentConversation.unreadCount ? state.currentConversation.unreadCount-- : 0;
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        const userId = action.payload;
        
        // Update all messages in current conversation
        if (state.currentConversation.otherUser?.id === userId) {
          state.currentConversation.messages.forEach(message => {
            if (message.sender_id !== userId) {
              message.status = 'read';
            }
          });
        }
        
        // Update conversation in list
        const conversationIndex = state.conversations.findIndex(
          conv => conv.other_user.id === userId
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unread_count = 0;
        }
        
        // Update unread count
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });

    // Delete message
    builder
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        
        // Remove from current conversation
        state.currentConversation.messages = state.currentConversation.messages.filter(
          msg => msg.id !== messageId
        );
        
        // Update conversation in list if last message was deleted
        state.conversations.forEach(conversation => {
          if (conversation.last_message.id === messageId) {
            // This would need to be handled by refetching the conversation
            // or updating with the previous message
          }
        });
      });
  },
});

export const {
  clearError,
  clearConversations,
  addMessageToConversation,
  updateLastMessage,
  updateMessageStatus,
  incrementUnreadCount,
  decrementUnreadCount,
} = messagingSlice.actions;

export default messagingSlice.reducer; 