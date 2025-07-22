<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationReadCount implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $conversationId;
    public $readCount;
    public $message;
    public $userId;
    /**
     * Create a new event instance.
     */
    public function __construct($conversationId, $readCount, $userId, $message = null)
    {
        $this->conversationId = $conversationId;
        $this->userId = $userId;
        $this->readCount = $readCount;
        if ($message) {
            $this->message = $message;
        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('conversation-count.' . $this->conversationId . '.' . $this->userId),
        ];
    }

    public function broadcastAs()
    {
    return 'conversation-read-count';
    }
}
