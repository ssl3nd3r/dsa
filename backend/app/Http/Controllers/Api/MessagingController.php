<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;   
use App\Models\Message;
use App\Models\Conversation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Events\MessageSent;
use App\Events\ConversationReadCount;
use App\Events\TotalReadCount;
use Illuminate\Support\Facades\Log;

class MessagingController extends Controller
{
    /**
     * Store a new message
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'recipient_id' => 'required|exists:users,id',
            'content' => 'required|string|max:1000',
            'is_media' => 'boolean',
            'property_id' => 'nullable|exists:properties,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $sender = Auth::user();
        $recipientId = $request->recipient_id;
        $propertyId = $request->property_id;

        // Get or create conversation between the two users
        $conversation = Conversation::getOrCreate($sender->id, $recipientId, $propertyId);
        
        // Create the message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $sender->id,
            'content' => $request->content,
            'is_media' => $request->boolean('is_media', false),
            'status' => 'sent',
        ]);
        
        // Load relationships for response
        $message->load(['sender', 'conversation']);
        $conversation->load(['property']);
        
        // Dispatch events
        event(new MessageSent($message));
        
        // Dispatch event for conversation read count
        event(new ConversationReadCount($conversation->id, $conversation->getUnreadCount($recipientId), $recipientId, $message));

        // Dispatch event for total unread count    
        $totalUnreadCount = self::totalUnreadCount($recipientId);
        User::find($recipientId)->update(['unread_count' => $totalUnreadCount]);
        event(new TotalReadCount($recipientId, $totalUnreadCount));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'message' => $message,
                'conversation' => $conversation
            ]
        ], 201);
    }

    /**
     * Get all conversations for the authenticated user
     */
    public function conversations(): JsonResponse
    {
        $user = Auth::user();

        $conversations = Conversation::forUser($user->id)
            ->with(['firstUser', 'secondUser', 'lastMessage.sender'])
            ->withCount(['messages as total_messages'])
            ->orderBy('updated_at', 'desc')
            ->get();

        // Transform conversations to include other user and unread count
        $conversations->transform(function ($conversation) use ($user) {
            $otherUser = $conversation->getOtherUser($user->id);
            $unreadCount = $conversation->getUnreadCount($user->id);
            
            return [
                'id' => $conversation->id,
                'other_user' => $otherUser,
                'last_message' => $conversation->lastMessage,
                'unread_count' => $unreadCount,
                'total_messages' => $conversation->total_messages,
                'updated_at' => $conversation->updated_at,
                'created_at' => $conversation->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'conversations' => $conversations
            ]
        ]);
    }

    /**
     * Get messages by conversation ID
     */
    public function conversation($conversationId): JsonResponse
    {
        $currentUser = Auth::user();
        
        // Validate conversation exists and user has access to it
        $conversation = Conversation::forUser($currentUser->id)->find($conversationId);
        
        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found or you do not have access to it'
            ], 404);
        }

        // Get messages for this conversation
        $messages = Message::forConversation($conversationId)
            ->with(['sender'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages as read
        $conversation->markAsRead($currentUser->id);
        event(new ConversationReadCount($conversationId, $conversation->getUnreadCount($currentUser->id), $currentUser->id));

        // Dispatch event for total unread count    
        $totalUnreadCount = self::totalUnreadCount($currentUser->id);
        User::find($currentUser->id)->update(['unread_count' => $totalUnreadCount]);
        event(new TotalReadCount($currentUser->id, $totalUnreadCount));
        
        $conversation->load(['property', 'firstUser', 'secondUser']);

        // Get the other user in the conversation
        $otherUser = $conversation->getOtherUser($currentUser->id);
        

        return response()->json([
            'success' => true,
            'data' => [
                'conversation' => $conversation,
                'other_user' => $otherUser,
                'messages' => $messages
            ]
        ]);
    }

    /**
     * Get unread message count for the authenticated user
     */
    public static function totalUnreadCount( $userId ): int
    {
        $unreadCount = Message::whereHas('conversation', function ($query) use ($userId) {
            $query->forUser($userId);
        })
        ->where('sender_id', '!=', $userId)
        ->where('status', '!=', 'read')
        ->count();

        return $unreadCount;
    }

    /**
     * Mark all messages in a conversation as read
     */
    public function markAsRead($conversationId): JsonResponse
    {
        $user = Auth::user();
        
        $conversation = Conversation::forUser($user->id)->find($conversationId);

        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found'
            ], 404);
        }

        // Mark all unread messages in this conversation as read
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->where('status', '!=', 'read')
            ->update(['status' => 'read']);

        // Dispatch event for conversation read count
        event(new ConversationReadCount($conversationId, $conversation->getUnreadCount($user->id), $user->id));

        // Dispatch event for total unread count    
        $totalUnreadCount = self::totalUnreadCount($user->id);
        User::find($user->id)->update(['unread_count' => $totalUnreadCount]);
        event(new TotalReadCount($user->id, $totalUnreadCount));

        return response()->json([
            'success' => true,
            'message' => 'All messages in conversation marked as read'
        ]);
    }

    /**
     * Mark all messages from a specific user as read
     */
    public function markAllAsRead($userId): JsonResponse
    {
        $currentUser = Auth::user();
        
        // Validate user exists
        $otherUser = User::find($userId);
        if (!$otherUser) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Get conversation between users
        $conversation = Conversation::betweenUsers($currentUser->id, $userId)->first();
        
        if (!$conversation) {
            return response()->json([
                'success' => false,
                'message' => 'No conversation found with this user'
            ], 404);
        }

        // Mark all messages as read
        $updatedCount = $conversation->markAsRead($currentUser->id);

        return response()->json([
            'success' => true,
            'message' => "Marked {$updatedCount} messages as read"
        ]);
    }

    /**
     * Delete a specific message
     */
    public function destroy($messageId): JsonResponse
    {
        $user = Auth::user();
        
        $message = Message::where('sender_id', $user->id)
            ->whereHas('conversation', function ($query) use ($user) {
                $query->forUser($user->id);
            })->find($messageId);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message not found or you do not have permission to delete it'
            ], 404);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
    }
}
