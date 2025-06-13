<?php

namespace App\Services;

use Google\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class FirebaseNotificationService
{
    public static function sendNotificationWithToken($fcmToken, $title, $message, $studyId)
    {
        try {
            $client = new Client();
            $client->setAuthConfig(storage_path('app/firebase/firebase-credentials.json'));
            $client->addScope('https://www.googleapis.com/auth/firebase.messaging');
            $client->fetchAccessTokenWithAssertion();
            $accessToken = $client->getAccessToken()['access_token'];
    
            $projectId = 'appsscheduler-614e7'; // Replace with your project ID
            $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";
    
            $body = [
                'message' => [
                    'token' => $fcmToken,
                    'notification' => [
                        'title' => $title . "#-split-#" . $studyId,
                        'body' => $message,
                    ],
                    // 'data' => [
                    //     'studyId' => $studyId,
                    //     'title' => $title,  // Include again in data
                    //     'body' => $message, // Include again in data
                    // ],
                    'android' => [
                        'priority' => 'high', // Ensures delivery
                        'notification' => [
                            'channel_id' => 'default', // Required for Android 8.0+
                            'sound' => 'default',
                            'click_action' => 'FLUTTER_NOTIFICATION_CLICK', // For Flutter (if used)
                        ],
                    ],                ],
            ];
    
            $response = Http::withToken($accessToken)->post($url, $body);
    
            if ($response->successful()) {
                Log::info("Notification sent successfully: {$message}");
            } else {
                Log::error("FCM v1 error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Exception sending FCM v1 message: " . $e->getMessage());
        }
    }}
