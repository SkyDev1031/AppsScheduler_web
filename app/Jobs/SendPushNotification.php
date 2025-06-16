<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\FirebaseNotificationService;

class SendPushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $token, $title, $message, $dataId, $actionType, $payload;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($token, $title, $message, $dataId = 0, $actionType = 'notification', $payload = ["title" => 'title', "body" => 'Hello World'])
    {
        //
        $this->token = $token;
        $this->title = $title;
        $this->message = $message;
        $this->dataId = $dataId;
        $this->actionType = $actionType;
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
        FirebaseNotificationService::sendNotificationWithToken(
            $this->token,
            $this->title,
            $this->message,
            $this->dataId,
            $this->actionType,
            $this->payload
        );
    }
}
