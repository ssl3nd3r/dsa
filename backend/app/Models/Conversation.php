<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_user_id',
        'second_user_id',
        'property_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function firstUser()
    {
        return $this->belongsTo(User::class, 'first_user_id');
    }

    public function secondUser()
    {
        return $this->belongsTo(User::class, 'second_user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'desc');
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the other user in the conversation
     */
    public function getOtherUser($currentUserId)
    {
        return $this->first_user_id == $currentUserId 
            ? $this->secondUser 
            : $this->firstUser;
    }

    /**
     * Check if a user is part of this conversation
     */
    public function hasUser($userId)
    {
        return $this->first_user_id == $userId || $this->second_user_id == $userId;
    }

    /**
     * Get unread message count for a specific user
     */
    public function getUnreadCount($userId)
    {
        return $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('status', '!=', 'read')
            ->count();
    }

    /**
     * Scope to get conversations for a specific user
     */
    public function scopeForUser(Builder $query, $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('first_user_id', $userId)
              ->orWhere('second_user_id', $userId);
        });
    }

    /**
     * Scope to get conversations between two specific users
     */
    public function scopeBetweenUsers(Builder $query, $user1Id, $user2Id)
    {
        return $query->where(function ($q) use ($user1Id, $user2Id) {
            $q->where(function ($subQ) use ($user1Id, $user2Id) {
                $subQ->where('first_user_id', $user1Id)
                     ->where('second_user_id', $user2Id);
            })->orWhere(function ($subQ) use ($user1Id, $user2Id) {
                $subQ->where('first_user_id', $user2Id)
                     ->where('second_user_id', $user1Id);
            });
        });
    }

    /**
     * Scope to get conversations for a specific property
     */
    public function scopeForProperty(Builder $query, $propertyId)
    {
        return $query->where('property_id', $propertyId);
    }

    /**
     * Get or create conversation between two users
     */
    public static function getOrCreate($user1Id, $user2Id, $propertyId = null)
    {
        $conversation = self::betweenUsers($user1Id, $user2Id);
        
        if ($propertyId) {
            $conversation = $conversation->where('property_id', $propertyId);
        }
        
        $conversation = $conversation->first();
        $wasCreated = false;
        
        if (!$conversation) {
            $conversation = self::create([
                'first_user_id' => min($user1Id, $user2Id),
                'second_user_id' => max($user1Id, $user2Id),
                'property_id' => $propertyId,
            ]);
            $wasCreated = true;
        }
        
        return [
            'conversation' => $conversation,
            'was_created' => $wasCreated
        ];
    }

    /**
     * Mark all messages as read for a specific user
     */
    public function markAsRead($userId)
    {
        return $this->messages()
            ->where('sender_id', '!=', $userId)
            ->where('status', '!=', 'read')
            ->update(['status' => 'read']);
    }
} 