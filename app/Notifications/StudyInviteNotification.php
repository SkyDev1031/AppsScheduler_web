<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Kreait\Firebase\Messaging\CloudMessage as FcmMessage;
use App\Models\StudyParticipantRequest;

class StudyInviteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public StudyParticipantRequest $invite;

    public function __construct(StudyParticipantRequest $invite) {
        $this->invite = $invite;
        // Initialize the notification with the invite data
    }

    public function via($notifiable) { return ['fcm']; }

    public function toFcm($notifiable)
    {
        // return FcmMessage::create()
        //     ->setData([
        //         'invite_id' => $this->invite->id,
        //         'study'     => $this->invite->study->title,
        //     ])
        //     ->setNotification(\Kreait\Firebase\Messaging\Notification::create(
        //         'New Study Invitation',
        //         "You have been invited to join {$this->invite->study->title}"
        //     ));
    }
}