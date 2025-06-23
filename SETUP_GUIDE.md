# 🛠️ Development Environment Setup Guide

## Prerequisites Installation

### 1. Install Node.js (Required for Backend & Web)

**Option A: Download from Official Website**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation: `node --version` and `npm --version`

**Option B: Using Chocolatey (Windows)**
```powershell
# Install Chocolatey first if you don't have it
# Then run:
choco install nodejs
```

**Option C: Using Winget (Windows 10/11)**
```powershell
winget install OpenJS.NodeJS
```

### 2. Install MongoDB (Required for Backend)

**Option A: MongoDB Community Server**
1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server
3. Run the installer
4. Install MongoDB Compass (GUI) if prompted

**Option B: Using Chocolatey**
```powershell
choco install mongodb
```

**Option C: Using Docker (Recommended for Development)**
```powershell
# Install Docker Desktop first
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Install Android Studio (Required for Android Development)

1. Go to [https://developer.android.com/studio](https://developer.android.com/studio)
2. Download Android Studio
3. Run the installer
4. Follow the setup wizard (this will also install the Android SDK)

### 4. Update Java (Recommended)

Your current Java version (1.6.0) is quite old. For Android development, you need Java 11 or higher.

**Option A: Download from Oracle**
1. Go to [https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)
2. Download Java 11 or higher
3. Install and update your PATH

**Option B: Using Chocolatey**
```powershell
choco install openjdk11
```

## 🚀 Quick Setup Commands

After installing the prerequisites, run these commands:

### 1. Backend Setup
```powershell
cd backend
npm install
copy env.example .env
# Edit .env with your configuration
npm run dev
```

### 2. Web Application Setup
```powershell
cd web
npm install
npm run dev
```

### 3. Android Setup
1. Open Android Studio
2. Open the `android` folder as a project
3. Sync Gradle files
4. Run on emulator or device

## 🔧 Environment Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dubai-accommodations
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Web Environment Variables (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Setup

### 1. Test Backend
```powershell
cd backend
npm run dev
# Should see: "🚀 Server running on port 5000"
# Visit: http://localhost:5000/health
```

### 2. Test Web Application
```powershell
cd web
npm run dev
# Should see: "Ready - started server on 0.0.0.0:3000"
# Visit: http://localhost:3000
```

### 3. Test MongoDB
```powershell
# If using MongoDB locally
mongosh
# Should connect to MongoDB shell
```

## 🐛 Troubleshooting

### Node.js Issues
- **"npm not recognized"**: Restart your terminal after installing Node.js
- **Permission errors**: Run PowerShell as Administrator

### MongoDB Issues
- **Connection refused**: Make sure MongoDB service is running
- **Port conflicts**: Change MongoDB port in configuration

### Android Issues
- **Gradle sync failed**: Check internet connection and try again
- **SDK not found**: Install Android SDK through Android Studio

## 📱 Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Web App**: `cd web && npm run dev`
3. **Start Android**: Open in Android Studio and run
4. **Test Features**: Use the web app at http://localhost:3000

## 🔗 Useful URLs

- **Backend API**: http://localhost:5000
- **Web Application**: http://localhost:3000
- **API Documentation**: http://localhost:5000/health
- **MongoDB Compass**: mongodb://localhost:27017

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Check the console output for error messages
4. Ensure all services are running on the correct ports 