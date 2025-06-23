# Dubai Smart Accommodations Platform

An AI-powered platform for shared accommodations in Dubai, consisting of both an Android mobile application and a web platform.

## 🚀 Project Status

### ✅ **Completed Components:**

1. **Backend Server** (Node.js/Express)
   - ✅ User authentication with JWT
   - ✅ User registration and profile management
   - ✅ Property CRUD operations
   - ✅ AI-powered property matching algorithm
   - ✅ Real-time Socket.IO integration
   - ✅ MongoDB integration with Mongoose
   - ✅ Comprehensive API endpoints
   - ✅ Input validation and error handling

2. **Web Application** (Next.js/React)
   - ✅ TypeScript configuration
   - ✅ Tailwind CSS styling
   - ✅ User onboarding form
   - ✅ Dashboard with user profile and matches
   - ✅ Property listing with filters
   - ✅ Zustand state management
   - ✅ API integration utilities

3. **Android Application** (Kotlin/Jetpack Compose)
   - ✅ Modern Material 3 design
   - ✅ Navigation between screens
   - ✅ Onboarding form with validation
   - ✅ MVVM architecture setup
   - ✅ Data models and API integration

4. **Configuration Files**
   - ✅ Proper `.gitignore` for all platforms
   - ✅ Package.json with all dependencies
   - ✅ Build configurations
   - ✅ Environment variable templates

## 🏗️ Project Structure

```
dubai-smart-accommodations/
├── backend/                 # Backend server (Node.js/Express)
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication & validation
│   │   └── index.js        # Server entry point
│   ├── package.json
│   └── env.example         # Environment variables template
├── web/                    # Web application (Next.js)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Next.js pages
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # API utilities
│   ├── package.json
│   └── tsconfig.json
├── android/                # Android mobile app
│   ├── app/src/main/java/com/dubaiaccommodations/
│   │   ├── data/model/     # Data models
│   │   ├── ui/screens/     # Compose screens
│   │   ├── ui/components/  # Reusable components
│   │   └── viewmodel/      # MVVM view models
│   └── build.gradle
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Socket.IO** for real-time features
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage

### Web Platform
- **Next.js** 13+ with App Router
- **React** 18+ with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for data fetching
- **Axios** for HTTP requests
- **Socket.IO Client** for real-time features

### Android App
- **Kotlin** with Jetpack Compose
- **Material 3** design system
- **MVVM** architecture
- **Navigation Compose** for routing
- **Retrofit** for API calls
- **Room** for local storage
- **Hilt** for dependency injection

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6+
- Android Studio (for Android development)
- Java 11+ (for Android)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dubai-accommodations
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The backend will be running at `http://localhost:5000`

### Web Application Setup

1. **Navigate to web directory:**
   ```bash
   cd web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The web app will be running at `http://localhost:3000`

### Android Application Setup

1. **Open Android Studio**

2. **Open the android folder as a project**

3. **Sync Gradle files**

4. **Run the app on an emulator or device**

## 📱 Features

### Core Features
- **User Registration & Authentication**
  - Secure JWT-based authentication
  - Password hashing with bcrypt
  - User profile management

- **AI-Powered Property Matching**
  - Lifestyle compatibility scoring
  - Work schedule matching
  - Language and cultural preferences
  - Budget and area preferences
  - Personality trait matching

- **Property Management**
  - Create, read, update, delete properties
  - Image upload and management
  - Advanced filtering and search
  - Real-time availability updates

- **Real-time Features**
  - Live chat between users
  - Property view notifications
  - Interest notifications
  - Real-time updates

### Advanced Features
- **Multi-language Support** (English & Arabic ready)
- **Responsive Design** for all screen sizes
- **Offline Support** for Android app
- **Push Notifications** (Android)
- **Image Optimization** and CDN integration
- **Search and Filtering** with multiple criteria
- **Pagination** for large datasets

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Properties
- `GET /api/property` - Get all properties with filters
- `GET /api/property/:id` - Get property by ID
- `POST /api/property` - Create new property
- `PUT /api/property/:id` - Update property
- `DELETE /api/property/:id` - Delete property
- `GET /api/property/match/:userId` - Get AI matches for user

### Real-time Events
- `socket.on('property-view')` - Property viewed
- `socket.on('new-message')` - New message received
- `socket.on('property-interest')` - Property interest received

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Web Testing
```bash
cd web
npm run test
```

## 📦 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS

### Web Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or AWS

### Android Deployment
1. Generate signed APK in Android Studio
2. Upload to Google Play Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and confidential.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Roadmap

### Phase 2 (Next)
- [ ] Email verification system
- [ ] Advanced AI matching algorithms
- [ ] Virtual property tours
- [ ] Payment integration
- [ ] Review and rating system

### Phase 3 (Future)
- [ ] Multi-language support (Arabic)
- [ ] Advanced analytics dashboard
- [ ] Mobile app for iOS
- [ ] Integration with property management systems
- [ ] Advanced search with geolocation

---

**Built with ❤️ for Dubai's accommodation community** 