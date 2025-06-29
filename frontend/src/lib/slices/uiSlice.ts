import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  sidebarOpen: boolean;
  notifications: Notification[];
  loadingStates: Record<string, boolean>;
  modals: {
    login: boolean;
    register: boolean;
    propertyForm: boolean;
    messageForm: boolean;
  };
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: false,
  notifications: [],
  loadingStates: {},
  modals: {
    login: false,
    register: false,
    propertyForm: false,
    messageForm: false,
  },
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      state.loadingStates[key] = loading;
    },
    clearLoadingState: (state, action: PayloadAction<string>) => {
      delete state.loadingStates[action.payload];
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoadingState,
  clearLoadingState,
  openModal,
  closeModal,
  closeAllModals,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 