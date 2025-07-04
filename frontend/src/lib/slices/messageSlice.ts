import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  propertyId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    email: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  propertyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: MessageState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'message/fetchConversations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.get('/message/conversations');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch conversations');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.get(`/message/${conversationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ recipientId, content, propertyId }: { recipientId: string; content: string; propertyId?: string }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.post('/message', {
        recipientId,
        content,
        propertyId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'message/markAsRead',
  async (conversationId: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.put(`/message/${conversationId}/read`, {});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark as read');
    }
  }
);

// Slice
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      state.messages.push(message);
      
      // Update conversation's last message
      const conversation = state.conversations.find(conv => conv._id === message.sender._id || conv._id === message.recipient._id);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.createdAt;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations;
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const message = action.payload.message;
        state.messages.push(message);
        
        // Update conversation's last message
        const conversation = state.conversations.find(conv => 
          conv.participants.some(p => p._id === message.recipient._id)
        );
        if (conversation) {
          conversation.lastMessage = message;
          conversation.updatedAt = message.createdAt;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark as Read
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId } = action.payload;
        
        // Update messages as read
        state.messages = state.messages.map(msg => ({
          ...msg,
          isRead: true,
        }));
        
        // Update conversation unread count
        const conversation = state.conversations.find(conv => conv._id === conversationId);
        if (conversation) {
          conversation.unreadCount = 0;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentConversation, addMessage, updateUnreadCount, clearMessages } = messageSlice.actions;
export default messageSlice.reducer; 