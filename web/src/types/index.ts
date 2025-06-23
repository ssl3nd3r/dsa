// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  lifestyle: 'Quiet' | 'Active' | 'Smoker' | 'Non-smoker' | 'Pet-friendly' | 'No pets';
  personalityTraits: string[];
  workSchedule: '9-5' | 'Night shift' | 'Remote' | 'Flexible' | 'Student';
  culturalPreferences: {
    languages: string[];
    dietary?: string;
    religion?: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  preferredAreas?: string[];
  moveInDate?: Date;
  leaseDuration?: '1-3 months' | '3-6 months' | '6-12 months' | '1+ years';
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Property Types
export interface Property {
  _id: string;
  title: string;
  description: string;
  area: string;
  address: {
    street?: string;
    building?: string;
    floor?: string;
    apartment?: string;
    fullAddress: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  propertyType: 'Studio' | '1BR' | '2BR' | '3BR' | '4BR+' | 'Shared Room' | 'Private Room';
  roomType: 'Entire Place' | 'Private Room' | 'Shared Room';
  size: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  currency: 'AED' | 'USD' | 'EUR';
  billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
  utilitiesIncluded: boolean;
  utilitiesCost: number;
  amenities: string[];
  availableFrom: Date;
  minimumStay: number;
  maximumStay: number;
  isAvailable: boolean;
  images: PropertyImage[];
  owner: User;
  roommatePreferences?: {
    gender?: 'Any' | 'Male' | 'Female';
    ageRange?: {
      min: number;
      max: number;
    };
    lifestyle?: string[];
    languages?: string[];
    dietary?: string[];
    religion?: string[];
    workSchedule?: string[];
  };
  matchingScore?: number;
  status: 'Active' | 'Pending' | 'Rented' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  details?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
}

// Form Types
export interface OnboardingFormData {
  name: string;
  email: string;
  password: string;
  lifestyle: string;
  personalityTraits: string[];
  workSchedule: string;
  culturalPreferences: {
    languages: string[];
    dietary: string;
    religion: string;
  };
}

export interface PropertyFormData {
  title: string;
  description: string;
  area: string;
  address: {
    fullAddress: string;
    street?: string;
    building?: string;
    floor?: string;
    apartment?: string;
  };
  propertyType: string;
  roomType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  currency: string;
  billingCycle: string;
  utilitiesIncluded: boolean;
  utilitiesCost: number;
  amenities: string[];
  availableFrom: string;
  minimumStay: number;
  maximumStay: number;
  roommatePreferences?: {
    gender?: string;
    ageRange?: {
      min: number;
      max: number;
    };
    lifestyle?: string[];
    languages?: string[];
    dietary?: string[];
    religion?: string[];
    workSchedule?: string[];
  };
}

// Filter Types
export interface PropertyFilters {
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  roomType?: string;
  bedrooms?: number;
  amenities?: string[];
  availableFrom?: string;
  page?: number;
  limit?: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends OnboardingFormData {}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Socket Types
export interface SocketMessage {
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
}

export interface PropertyInterest {
  propertyId: string;
  interestedUserId: string;
  ownerId: string;
  message: string;
}

// Component Props
export interface LayoutProps {
  children: any;
}

export interface ButtonProps {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export interface SelectProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  className?: string;
} 