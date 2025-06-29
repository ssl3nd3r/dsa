const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();
const mongoose = require('mongoose');

// Import routes
const userRouter = require('./routes/user');
const propertyRouter = require('./routes/property');
const messageRouter = require('./routes/message');
const serviceProviderRouter = require('./routes/serviceProvider');
const serviceReviewRouter = require('./routes/serviceReview');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/property', propertyRouter);
app.use('/api/message', messageRouter);
app.use('/api/service-provider', serviceProviderRouter);
app.use('/api/service-review', serviceReviewRouter);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle property view
  socket.on('property-view', (data) => {
    socket.broadcast.to(`property-${data.propertyId}`).emit('property-viewed', {
      propertyId: data.propertyId,
      viewerId: data.viewerId
    });
  });

  // Handle new message
  socket.on('new-message', (data) => {
    io.to(`user-${data.recipientId}`).emit('message-received', {
      senderId: data.senderId,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle property interest
  socket.on('property-interest', (data) => {
    io.to(`user-${data.ownerId}`).emit('property-interest-received', {
      propertyId: data.propertyId,
      interestedUserId: data.interestedUserId,
      message: data.message
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dubai-accommodations', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, io }; 