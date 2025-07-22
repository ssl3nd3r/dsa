<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'is_media',
        'status',
    ];

    protected $casts = [
        'is_media' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the recipient of the message (other user in conversation)
     */
    public function getRecipientAttribute()
    {
        return $this->conversation->getOtherUser($this->sender_id);
    }

    /**
     * Scope to get messages for a specific conversation
     */
    public function scopeForConversation(Builder $query, $conversationId)
    {
        return $query->where('conversation_id', $conversationId);
    }

    /**
     * Scope to get messages between two users
     */
    public function scopeBetweenUsers(Builder $query, $user1Id, $user2Id)
    {
        return $query->whereHas('conversation', function ($q) use ($user1Id, $user2Id) {
            $q->betweenUsers($user1Id, $user2Id);
        });
    }

    /**
     * Scope to get unread messages for a user
     */
    public function scopeUnreadForUser(Builder $query, $userId)
    {
        return $query->where('sender_id', '!=', $userId)
                    ->where('status', '!=', 'read');
    }

    /**
     * Scope to get messages sent by a user
     */
    public function scopeSentBy(Builder $query, $userId)
    {
        return $query->where('sender_id', $userId);
    }

    /**
     * Scope to get messages received by a user
     */
    public function scopeReceivedBy(Builder $query, $userId)
    {
        return $query->whereHas('conversation', function ($q) use ($userId) {
            $q->forUser($userId);
        })->where('sender_id', '!=', $userId);
    }

    /**
     * Mark message as delivered
     */
    public function markAsDelivered()
    {
        $this->update(['status' => 'delivered']);
    }

    /**
     * Mark message as read
     */
    public function markAsRead()
    {
        $this->update(['status' => 'read']);
    }

    /**
     * Check if message is read
     */
    public function isRead()
    {
        return $this->status === 'read';
    }

    /**
     * Check if message is delivered
     */
    public function isDelivered()
    {
        return in_array($this->status, ['delivered', 'read']);
    }

    /**
     * Check if message is sent
     */
    public function isSent()
    {
        return in_array($this->status, ['sent', 'delivered', 'read']);
    }

    /**
     * Get message status as human readable text
     */
    public function getStatusTextAttribute()
    {
        return ucfirst($this->status);
    }

    /**
     * Boot method to set default status
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($message) {
            if (!isset($message->status)) {
                $message->status = 'sent';
            }
        });
    }
}
