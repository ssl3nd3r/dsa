import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface Property {
  id: number;
  slug: string;
  title: string;
  description: string;
  property_type: string;
  room_type: string;
  price: number;
  currency: string;
  billing_cycle: string;
  address: {
    street: string;
    city: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  coordinates: {
    lat: number;
    lng: number;  
  };
  bedrooms: number;
  bathrooms: number;
  location: string;
  size: number;
  utilities_included: boolean;
  utilities_cost: number;
  amenities: string[];
  images: string[];
  available_from?: string;
  minimum_stay?: number;
  maximum_stay?: number;
  is_available?: boolean;
  roommate_preferences?: string[];
  matching_score?: number;
  status?: string;
  // Additional properties for the property page
  type?: string;
  city?: string;
  furnished?: boolean;
  parking?: boolean;
  balcony?: boolean;
  gym?: boolean;
  pool?: boolean;
  security?: boolean;
  owner?: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    phone?: string;
    profile_image?: string;
    lifestyle?: string | string[];
    personality_traits?: string;
    work_schedule?: string;
    cultural_preferences?: string;
    budget?: number;
    preferred_areas?: string;
    move_in_date?: string;
    lease_duration?: number;
    is_verified: boolean;
    is_active: boolean;
  };
  created_at?: string;
  updated_at?: string;
  is_interested?: boolean;
}

export interface PropertyFilters {
  property_type?: string;
  min_price?: number | undefined;
  max_price?: number | undefined;
  location?: Array<{value: string, label: string}>;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  lifestyle?: string | string[];
  personality_traits?: Array<{value: string, label: string}>;
  work_schedule?: string;
  cultural_preferences?: Array<{value: string, label: string}>;
  sort_by?: string;
  sort_order?: 'desc' | 'asc';
}

export interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  loading: boolean;
  error: string | null;
  filters: PropertyFilters;
  totalCount: number;
  currentPage: number;
  lastPage: number;
  interestedProperties: Property[];
  interestedPropertiesTotalCount: number;
  interestedPropertiesCurrentPage: number;
  interestedPropertiesLastPage: number;
  myProperties: Property[];
  myPropertiesTotalCount: number;
  myPropertiesCurrentPage: number;
  myPropertiesLastPage: number;
}

const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  loading: true,
  error: null,
  filters: {},
  totalCount: 0,
  currentPage: 1,
  lastPage: 1,
  interestedProperties: [],
  interestedPropertiesTotalCount: 0,
  interestedPropertiesCurrentPage: 1,
  interestedPropertiesLastPage: 1,
  myProperties: [],
  myPropertiesTotalCount: 0,
  myPropertiesCurrentPage: 1,
  myPropertiesLastPage: 1,
};


// Async thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async (params: { page?: number; limit?: number; filters?: PropertyFilters }, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 10, filters = {} } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      // Add filters as strings
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await api.get(`/properties?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch properties');
    }
  }
);

export const fetchPropertyBySlug = createAsyncThunk(
  'property/fetchPropertyBySlug',
  async (propertySlug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/properties/${propertySlug}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch property');
    }
  }
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (propertyData: Partial<Property>, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      console.log(propertyData);

      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            if (key === 'images' || key === 'files') {
              value.forEach(v => formData.append(key + '[]', v));
            }
            else {
              formData.append(key, JSON.stringify(value));
            }
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      dispatch(fetchUserMyProperties({ page: 1, limit: 10, title: '', is_available: true }));

      const response = await api.post(`/properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create property');
    }
  }
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ propertySlug, propertyData }: { propertySlug: string; propertyData: Partial<Property> & { images?: File[] } }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      Object.entries(propertyData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            if (key === 'images' || key === 'files') {
              value.forEach(v => formData.append(key + '[]', v));
            }
            else {
              formData.append(key, JSON.stringify(value));
            }
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await api.put(`/properties/${propertySlug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update property');
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (propertySlug: string, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      await api.delete(`/properties/${propertySlug}`);
      return propertySlug;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete property');
    }
  }
);

export const addToInterests = createAsyncThunk(
  'property/addToInterests',
  async (propertySlug: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.post(`/properties/${propertySlug}/interest`);
      
      // Refetch user profile to get updated interested properties
      await dispatch(fetchPropertyBySlug(propertySlug));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to interests');
    }
  }
);

export const removeFromInterests = createAsyncThunk(
  'property/removeFromInterests',
  async (propertySlug: string, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.delete(`/properties/${propertySlug}/interest`);
      
      // Refetch user profile to get updated interested properties
      await dispatch(fetchPropertyBySlug(propertySlug));
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from interests');
    }
  }
);

export const fetchUserInterestedProperties = createAsyncThunk(
  'property/fetchUserInterestedProperties',
  async (params: { page?: number; limit?: number, title?: string }, { getState, rejectWithValue }) => {
    const { page = 1, limit = 10, title = '' } = params;

    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }
      const response = await api.post(`/properties/interested`, { page, limit, title });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user interested properties');
    }
  }
);

export const fetchUserMyProperties = createAsyncThunk(
  'property/fetchUserMyProperties',
  async (params: { page?: number; limit?: number, title?: string, is_available?: boolean | 'both' }, { getState, rejectWithValue }) => {
    const { page = 1, limit = 10, title = '', is_available = true } = params;

    try {
      const { auth } = getState() as { auth: { token: string | null } };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.post(`/properties/my`, { page, limit, title, is_available });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user my properties');
    }
  }
);
  
  // Slice
const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<PropertyFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    setCurrentProperty: (state, action: PayloadAction<Property | null>) => {
      state.currentProperty = action.payload;
    },
    clearProperties: (state) => {
      state.properties = [];
      state.currentPage = 1;
      state.lastPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Properties
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        const { properties, pagination } = action.payload;
        
        state.properties = properties;
        state.totalCount = pagination.total_count;
        state.currentPage = pagination.current_page;
        state.lastPage = pagination.last_page;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Property by Slug
      .addCase(fetchPropertyBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload.property;
      })
      .addCase(fetchPropertyBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.unshift(action.payload.property);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProperty = action.payload.property;
        state.properties = state.properties.map(prop => 
          prop.slug === updatedProperty.slug ? updatedProperty : prop
        );
        if (state.currentProperty?.slug === updatedProperty.slug) {
          state.currentProperty = updatedProperty;
        }
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        const deletedSlug = action.payload;
        state.properties = state.properties.filter(prop => prop.slug !== deletedSlug);
        if (state.currentProperty?.slug === deletedSlug) {
          state.currentProperty = null;
        }
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add to Interests
      .addCase(addToInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToInterests.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove from Interests
      .addCase(removeFromInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromInterests.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Interested Properties
      .addCase(fetchUserInterestedProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInterestedProperties.fulfilled, (state, action) => {
        state.loading = false;  
        const { properties, pagination } = action.payload;
        state.interestedProperties = properties;
        state.interestedPropertiesTotalCount = pagination.total;
        state.interestedPropertiesCurrentPage = pagination.current_page;
        state.interestedPropertiesLastPage = pagination.last_page;
      })
      .addCase(fetchUserInterestedProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User My Properties
      .addCase(fetchUserMyProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMyProperties.fulfilled, (state, action) => {
        state.loading = false;
        const { properties, pagination } = action.payload;
        state.myProperties = properties;
        state.myPropertiesTotalCount = pagination.total;
        state.myPropertiesCurrentPage = pagination.current_page;
        state.myPropertiesLastPage = pagination.last_page;
      })
      .addCase(fetchUserMyProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { clearError, setFilters, clearFilters, setCurrentProperty, clearProperties } = propertySlice.actions;
export default propertySlice.reducer; 