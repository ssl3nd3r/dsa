<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
  
    public function __construct(Message $message)
    {
        $this->message = $message;
    }
  
    public function broadcastOn()
    {
        return [
            new Channel('conversation.' . $this->message->conversation_id)
        ];
    }
  
    public function broadcastAs()
    {
        return 'message-created';
    }
}
