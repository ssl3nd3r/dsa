const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const Property = require('../models/Property');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Send a message
router.post('/', authenticateToken, async (req, res) => {
  // TODO: Validate input
  try {
    const { recipientId, content, messageType = 'text', relatedPropertyId } = req.body;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Validate property exists if relatedPropertyId is provided
    if (relatedPropertyId) {
      const property = await Property.findById(relatedPropertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
    }

    // Create message
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
      messageType,
      relatedProperty: relatedPropertyId
    });

    await message.save();

    // Populate sender and recipient details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .populate('relatedProperty', 'title area price');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversations (people user has messaged or been messaged by)
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { recipient: userId }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$recipient',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user details for each conversation
    const populatedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUser = await User.findById(conversation._id)
          .select('name email');
        
        return {
          userId: conversation._id,
          user: otherUser,
          lastMessage: conversation.lastMessage,
          unreadCount: conversation.unreadCount
        };
      })
    );

    res.json({
      conversations: populatedConversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages between current user and another user
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;
    const { page = 1, limit = 20 } = req.query;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const skip = (page - 1) * limit;

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    })
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .populate('relatedProperty', 'title area price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Mark messages as read if they were sent to current user
    await Message.updateMany(
      {
        sender: otherUserId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    const total = await Message.countDocuments({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    });

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasMore: skip + messages.length < total
      },
      otherUser: {
        id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        recipient: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a message (only sender can delete)
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender can delete the message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 