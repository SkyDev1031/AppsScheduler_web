<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StudyInviteStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $studyId;
    public $participantId;
    public $status;

    public function __construct($studyId, $participantId, $status)
    {
        $this->studyId = $studyId;
        $this->participantId = $participantId;
        $this->status = $status;
    }

    /**
     * The name of the channel the event should broadcast on.
     */
    public function broadcastOn(): Channel
    {
        // Optionally, make the channel dynamic if you want to broadcast only to related researcher or participant.
        return new Channel('study-invites');
    }

    /**
     * Customize the broadcast event name (optional).
     */
    public function broadcastAs(): string
    {
        return 'StudyInviteStatusUpdated';
    }

    /**
     * Optionally format the data sent with the event.
     */
    public function broadcastWith(): array
    {
        return [
            'study_id' => $this->studyId,
            'participant_id' => $this->participantId,
            'status' => $this->status,
        ];
    }
}
