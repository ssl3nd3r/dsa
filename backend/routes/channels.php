<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

// Channel for conversation messages
Broadcast::channel('conversation.{conversationId}', function ($conversationId) {
    Log::info('Conversation ID: ' . $conversationId);
    $conversation = Conversation::find($conversationId);
    return $conversation->hasUser(Auth::user()->id);
});
