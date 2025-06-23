const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    token,
    headers = {},
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Request failed');
  }

  return data;
}

// User API functions
export const userApi = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest('/user/login', { method: 'POST', body: credentials }),

  register: (userData: any) =>
    apiRequest('/user/register', { method: 'POST', body: userData }),

  getProfile: (token: string) =>
    apiRequest('/user/profile', { token }),

  updateProfile: (userData: any, token: string) =>
    apiRequest('/user/profile', { method: 'PUT', body: userData, token }),

  updatePreferences: (preferences: any) =>
    apiRequest('/user/preferences', { method: 'POST', body: preferences }),

  changePassword: (passwords: { currentPassword: string; newPassword: string }, token: string) =>
    apiRequest('/user/password', { method: 'PUT', body: passwords, token }),

  deleteAccount: (token: string) =>
    apiRequest('/user/account', { method: 'DELETE', token }),

  getUser: (userId: string) =>
    apiRequest(`/user/${userId}`),
};

// Property API functions
export const propertyApi = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const queryString = params.toString();
    return apiRequest(`/property${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest(`/property/${id}`),

  create: (propertyData: any, token: string) =>
    apiRequest('/property', { method: 'POST', body: propertyData, token }),

  update: (id: string, propertyData: any, token: string) =>
    apiRequest(`/property/${id}`, { method: 'PUT', body: propertyData, token }),

  delete: (id: string, token: string) =>
    apiRequest(`/property/${id}`, { method: 'DELETE', token }),

  getMyProperties: (token: string) =>
    apiRequest('/property/user/my-properties', { token }),

  getMatches: (userId: string) =>
    apiRequest(`/property/match/${userId}`),

  searchByArea: (area: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    const queryString = params.toString();
    return apiRequest(`/property/search/area/${area}${queryString ? `?${queryString}` : ''}`);
  },
};

// Utility functions
export const apiUtils = {
  getAuthHeaders: (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }),

  handleError: (error: any) => {
    if (error instanceof ApiError) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
};

// Message API functions
export const messageApi = {
  // Send a message
  sendMessage: async (token: string, data: {
    recipientId: string;
    content: string;
    messageType?: string;
    relatedPropertyId?: string;
  }) => {
    const response = await apiRequest('/message', { method: 'POST', body: data, token });
    return response;
  },

  // Get all conversations
  getConversations: async (token: string) => {
    const response = await apiRequest('/message/conversations', { token });
    return response;
  },

  // Get messages between users
  getConversation: async (token: string, userId: string, page = 1, limit = 20) => {
    const response = await apiRequest(`/message/conversation/${userId}?page=${page}&limit=${limit}`, { token });
    return response;
  },

  // Mark messages as read
  markAsRead: async (token: string, userId: string) => {
    const response = await apiRequest(`/message/read/${userId}`, { method: 'PUT', token });
    return response;
  },

  // Get unread count
  getUnreadCount: async (token: string) => {
    const response = await apiRequest('/message/unread-count', { token });
    return response;
  },

  // Delete a message
  deleteMessage: async (token: string, messageId: string) => {
    const response = await apiRequest(`/message/${messageId}`, { method: 'DELETE', token });
    return response;
  }
};

// Service Provider API functions
export const serviceProviderApi = {
  // Get all service providers with filters
  getServiceProviders: async (params: {
    category?: string;
    area?: string;
    minRating?: number;
    maxPrice?: number;
    emergency?: boolean;
    verified?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const response = await apiRequest(`/service-provider?${queryParams.toString()}`);
    return response;
  },

  // Get service provider by ID
  getServiceProvider: async (id: string) => {
    const response = await apiRequest(`/service-provider/${id}`);
    return response;
  },

  // Create service provider profile
  createServiceProvider: async (token: string, data: any) => {
    const response = await apiRequest('/service-provider', { method: 'POST', body: data, token });
    return response;
  },

  // Update service provider profile
  updateServiceProvider: async (token: string, id: string, data: any) => {
    const response = await apiRequest(`/service-provider/${id}`, { method: 'PUT', body: data, token });
    return response;
  },

  // Delete service provider profile
  deleteServiceProvider: async (token: string, id: string) => {
    const response = await apiRequest(`/service-provider/${id}`, { method: 'DELETE', token });
    return response;
  },

  // Get my service provider profile
  getMyProfile: async (token: string) => {
    const response = await apiRequest('/service-provider/profile/me', { token });
    return response;
  },

  // Add review to service provider
  addReview: async (token: string, providerId: string, data: any) => {
    const response = await apiRequest(`/service-provider/${providerId}/reviews`, { method: 'POST', body: data, token });
    return response;
  },

  // Get reviews for a service provider
  getReviews: async (providerId: string, page = 1, limit = 10) => {
    const response = await apiRequest(`/service-provider/${providerId}/reviews?page=${page}&limit=${limit}`);
    return response;
  },

  // Search service providers
  searchServiceProviders: async (params: { q?: string; category?: string; area?: string }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const response = await apiRequest(`/service-provider/search?${queryParams.toString()}`);
    return response;
  }
};

export { ApiError }; 