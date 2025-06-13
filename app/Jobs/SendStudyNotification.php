<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\FirebaseNotificationService;

class SendStudyNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $token, $title, $message, $studyId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($token, $title, $message, $studyId = 0)
    {
        //
        $this->token = $token;
        $this->title = $title;
        $this->message = $message;
        $this->studyId = $studyId;
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
            $this->studyId
        );
    }
}
