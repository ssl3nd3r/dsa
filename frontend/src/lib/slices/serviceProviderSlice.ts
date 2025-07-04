import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface ServiceProvider {
  _id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  areas: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProviderState {
  serviceProviders: ServiceProvider[];
  currentServiceProvider: ServiceProvider | null;
  loading: boolean;
  error: string | null;
  filters: {
    services?: string[];
    areas?: string[];
    minRating?: number;
  };
}

const initialState: ServiceProviderState = {
  serviceProviders: [],
  currentServiceProvider: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchServiceProviders = createAsyncThunk(
  'serviceProvider/fetchServiceProviders',
  async (filters: { services?: string[]; areas?: string[]; minRating?: number } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.services) {
        filters.services.forEach(service => queryParams.append('services', service));
      }
      if (filters?.areas) {
        filters.areas.forEach(area => queryParams.append('areas', area));
      }
      if (filters?.minRating) {
        queryParams.append('minRating', filters.minRating.toString());
      }

      const response = await api.get(`/service-provider?${queryParams}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch service providers');
    }
  }
);

export const fetchServiceProviderById = createAsyncThunk(
  'serviceProvider/fetchServiceProviderById',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/service-provider/${providerId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch service provider');
    }
  }
);

// Slice
const serviceProviderSlice = createSlice({
  name: 'serviceProvider',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentServiceProvider: (state, action: PayloadAction<ServiceProvider | null>) => {
      state.currentServiceProvider = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ services?: string[]; areas?: string[]; minRating?: number }>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Service Providers
      .addCase(fetchServiceProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceProviders = action.payload.serviceProviders;
      })
      .addCase(fetchServiceProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Service Provider by ID
      .addCase(fetchServiceProviderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceProviderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentServiceProvider = action.payload.serviceProvider;
      })
      .addCase(fetchServiceProviderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentServiceProvider, setFilters, clearFilters } = serviceProviderSlice.actions;
export default serviceProviderSlice.reducer; 