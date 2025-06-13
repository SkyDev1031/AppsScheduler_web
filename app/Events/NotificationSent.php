<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotificationSent implements ShouldBroadcast
{
    public $notification;
    public $userId;

    public function __construct($notification, $userId)
    {
        $this->notification = $notification;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel("user.{$this->userId}");
    }

    public function broadcastWith()
    {
        return $this->notification;
    }
}
