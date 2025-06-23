const mongoose = require('mongoose');

// Message schema for user-to-user messaging
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // Optional: reference to a property
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
  // TODO: Add attachments, message types, etc. as needed
});

// Index for efficient querying
MessageSchema.index({ sender: 1, receiver: 1, sentAt: -1 });
MessageSchema.index({ receiver: 1, isRead: 1 });

// Method to mark as read
MessageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = Date.now();
  return this.save();
};

// Method to get public data
MessageSchema.methods.toPublicJSON = function() {
  const messageObject = this.toObject();
  return messageObject;
};

module.exports = mongoose.model('Message', MessageSchema); 