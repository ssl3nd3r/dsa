import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  phone?: string;
  profile_image?: string;
  lifestyle?: string[] | 'Quiet' | 'Active' | 'Smoker' | 'Non-smoker' | 'Pet-friendly' | 'No pets' | string;
  personality_traits?: string[];
  work_schedule?: '9-5' | 'Night shift' | 'Remote' | 'Flexible' | 'Student';
  cultural_preferences?: string[];
  budget?: { min?: number; max?: number };
  preferred_areas?: string[];
  move_in_date?: string;
  lease_duration?: '1-3 months' | '3-6 months' | '6-12 months' | '1+ years';
  is_verified: boolean;
  is_active: boolean;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpRequired: boolean;
  otpEmail: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: false,
  error: null,
  otpRequired: false,
  otpEmail: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string;
    name: string;
    password: string;
    lifestyle?: string[] | 'Quiet' | 'Active' | 'Smoker' | 'Non-smoker' | 'Pet-friendly' | 'No pets';
    personality_traits?: string[];
    work_schedule?: '9-5' | 'Night shift' | 'Remote' | 'Flexible' | 'Student' | string;
    cultural_preferences?: string[];
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const completeRegister = createAsyncThunk(
  'auth/completeRegister',
  async (registerData: {
    name: string;
    email: string;
    password: string;
    lifestyle: string[] | 'Quiet' | 'Active' | 'Smoker' | 'Non-smoker' | 'Pet-friendly' | 'No pets';
    personality_traits?: string[];
    work_schedule: '9-5' | 'Night shift' | 'Remote' | 'Flexible' | 'Student' | string;
    cultural_preferences?: string[];
    otp_code: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/register/complete', registerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Registration completion failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const completeLogin = createAsyncThunk(
  'auth/completeLogin',
  async (loginData: { email: string; otp_code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/login/complete', loginData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Login completion failed');
    }
  }
);

// OTP related thunks
export const sendRegisterOtp = createAsyncThunk(
  'auth/sendRegisterOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/otp/register/send', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send registration OTP');
    }
  }
);

export const verifyRegisterOtp = createAsyncThunk(
  'auth/verifyRegisterOtp',
  async (otpData: { email: string; otp_code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/otp/register/verify', otpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'OTP verification failed');
    }
  }
);

export const resendRegisterOtp = createAsyncThunk(
  'auth/resendRegisterOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/otp/register/resend', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to resend registration OTP');
    }
  }
);

export const sendLoginOtp = createAsyncThunk(
  'auth/sendLoginOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/otp/login/send', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send login OTP');
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyLoginOtp',
  async (otpData: { email: string; otp_code: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/otp/login/verify', otpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'OTP verification failed');
    }
  }
);

export const resendLoginOtp = createAsyncThunk(
  'auth/resendLoginOtp',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/otp/login/resend', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to resend login OTP');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.get('/user/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: {
    name?: string;
    phone?: string;
    profile_image?: string;
    lifestyle?: string[] | 'Quiet' | 'Active' | 'Smoker' | 'Non-smoker' | 'Pet-friendly' | 'No pets';
    personality_traits?: string[];
    work_schedule?: string;
    cultural_preferences?: string[];
    budget?: { min?: number; max?: number };
    preferred_areas?: string[];
    move_in_date?: string;
    lease_duration?: '1-3 months' | '3-6 months' | '6-12 months' | '1+ years';
  }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.token) {
        throw new Error('No token available');
      }

      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update profile');
    }
  }
);

export const changePassword = createAsyncThunk(

  'auth/changePassword',
  async (passwordData: { current_password: string; new_password: string, confirm_password: string }, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/password', passwordData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to change password');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpRequired = false;
      state.otpEmail = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    removeOtpState: (state) => {
      state.otpRequired = false;
      state.otpEmail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload);
      }
    },
    clearOtpState: (state) => {
      state.otpRequired = false;
      state.otpEmail = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requires_otp) {
          state.otpRequired = true;
          state.otpEmail = action.payload.email;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', action.payload.token);
          }
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Complete Register
      .addCase(completeRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.otpRequired = false;
        state.otpEmail = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(completeRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requires_otp) {
          state.otpRequired = true;
          state.otpEmail = action.payload.email;
        } else {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', action.payload.token);
          }
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Complete Login
      .addCase(completeLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.otpRequired = false;
        state.otpEmail = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(completeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Register OTP
      .addCase(sendRegisterOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRegisterOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpRequired = true;
        state.otpEmail = action.payload.email;
      })
      .addCase(sendRegisterOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Register OTP
      .addCase(verifyRegisterOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegisterOtp.fulfilled, (state) => {
        state.loading = false;
        // OTP verified successfully, ready for registration completion
      })
      .addCase(verifyRegisterOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Resend Register OTP
      .addCase(resendRegisterOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendRegisterOtp.fulfilled, (state) => {
        state.loading = false;
        // OTP resent successfully
      })
      .addCase(resendRegisterOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Send Login OTP
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpRequired = true;
        state.otpEmail = action.payload.email;
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify Login OTP
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state) => {
        state.loading = false;
        // OTP verified successfully, ready for login completion
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Resend Login OTP
      .addCase(resendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendLoginOtp.fulfilled, (state) => {
        state.loading = false;
        // OTP resent successfully
      })
      .addCase(resendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    },
});

export const { logout, clearError, setToken, clearOtpState, removeOtpState, setLoading } = authSlice.actions;
export default authSlice.reducer; 