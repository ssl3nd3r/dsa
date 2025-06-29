import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token?: string) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Join user to their personal room
  joinUser(userId: string) {
    if (this.socket) {
      this.socket.emit('join-user', userId);
    }
  }

  // Join property room for real-time updates
  joinProperty(propertyId: string) {
    if (this.socket) {
      this.socket.emit('join-property', propertyId);
    }
  }

  // Send property view event
  sendPropertyView(propertyId: string, viewerId: string) {
    if (this.socket) {
      this.socket.emit('property-view', { propertyId, viewerId });
    }
  }

  // Send new message
  sendNewMessage(senderId: string, recipientId: string, message: string) {
    if (this.socket) {
      this.socket.emit('new-message', { senderId, recipientId, message });
    }
  }

  // Send property interest
  sendPropertyInterest(propertyId: string, interestedUserId: string, ownerId: string, message: string) {
    if (this.socket) {
      this.socket.emit('property-interest', { propertyId, interestedUserId, ownerId, message });
    }
  }

  // Listen for property viewed events
  onPropertyViewed(callback: (data: { propertyId: string; viewerId: string }) => void) {
    if (this.socket) {
      this.socket.on('property-viewed', callback);
    }
  }

  // Listen for message received events
  onMessageReceived(callback: (data: { senderId: string; message: string; timestamp: string }) => void) {
    if (this.socket) {
      this.socket.on('message-received', callback);
    }
  }

  // Listen for property interest received events
  onPropertyInterestReceived(callback: (data: { propertyId: string; interestedUserId: string; message: string }) => void) {
    if (this.socket) {
      this.socket.on('property-interest-received', callback);
    }
  }

  // Remove event listeners
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 