# DSA (Dubai Smart Accommodation) Frontend

A modern Next.js frontend application with Redux Toolkit for managing DSA (Dubai Smart Accommodation), built with TypeScript and Tailwind CSS.

## Features

- **Authentication System**: User registration, login, and profile management
- **Property Management**: Browse, search, and manage property listings
- **Real-time Messaging**: Live chat between users using Socket.IO
- **Service Providers**: Find and connect with service providers
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit for predictable state management
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + React Redux
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **UI Components**: Ready for shadcn/ui integration

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── lib/                    # Core utilities and configurations
│   ├── store.ts           # Redux store configuration
│   ├── hooks.ts           # Typed Redux hooks
│   ├── providers.tsx      # Redux provider component
│   ├── socket.ts          # Socket.IO service
│   └── slices/            # Redux slices
│       ├── authSlice.ts   # Authentication state
│       ├── propertySlice.ts # Property management
│       ├── messageSlice.ts # Messaging system
│       ├── serviceProviderSlice.ts # Service providers
│       └── uiSlice.ts     # UI state management
└── components/            # Reusable components (to be added)
```

## Redux Store Structure

The application uses Redux Toolkit with the following slices:

### Auth Slice
- User authentication state
- Login/register functionality
- Profile management
- Token management

### Property Slice
- Property listings
- Search and filtering
- Property details
- CRUD operations

### Message Slice
- Real-time messaging
- Conversation management
- Message history

### Service Provider Slice
- Service provider listings
- Provider details
- Service filtering

### UI Slice
- Loading states
- Notifications
- Modal management
- Sidebar state

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The frontend is designed to work with the DSA (Dubai Smart Accommodation) backend API:

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT-based with Bearer tokens
- **Real-time**: Socket.IO for live messaging and notifications

### Available Endpoints

- `/api/user` - User authentication and profile
- `/api/property` - Property management
- `/api/message` - Messaging system
- `/api/service-provider` - Service providers
- `/api/service-review` - Reviews and ratings

## Socket.IO Integration

Real-time features include:
- Live messaging between users
- Property view notifications
- Interest notifications
- Real-time updates

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Next Steps

1. **Add shadcn/ui components** for a polished UI
2. **Implement authentication pages** (login/register)
3. **Create property listing components**
4. **Add messaging interface**
5. **Implement search and filtering**
6. **Add service provider pages**
7. **Create admin dashboard**

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Follow Redux Toolkit patterns
4. Test your changes thoroughly
5. Update documentation as needed

## License

This project is part of the DSA (Dubai Smart Accommodation) application.
