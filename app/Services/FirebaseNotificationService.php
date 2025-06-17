<?php

namespace App\Services;

use Google\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class FirebaseNotificationService
{
    public static function sendNotificationWithToken($fcmToken, $title, $message, $dataId = 0, $actionType = 'notification', $payload = ["title" => 'title', "body" => 'Hello World']) 
    {
        try {
            $client = new Client();
            $client->setAuthConfig(storage_path('app/firebase/firebase-credentials.json'));
            $client->addScope('https://www.googleapis.com/auth/firebase.messaging');
            $client->fetchAccessTokenWithAssertion();
            $accessToken = $client->getAccessToken()['access_token'];

            $projectId = 'appsscheduler-614e7'; // Replace with your project ID
            $url = "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send";

            $payloadJSON = json_encode($payload);
            // print_r($payloadJSON);

            $body = [
                'message' => [
                    'token' => $fcmToken,
                    'data' => [
                        'actionType' => $actionType,
                        'title' => $title,
                        'body' => $message,
                        'dataId' => (string) $dataId,
                        'payload' => $payloadJSON
                    ],
                    // 'notification' => [
                    //     'title' => $title,
                    //     'body' => $message,
                    // ],
                    'android' => [
                        'priority' => 'high',
                        'ttl' => '86400s', // 1 day
                        // 'notification' => [
                        //     'channel_id' => 'default',
                        //     'sound' => 'default',
                        //     'click_action' => 'OPEN_ACTIVITY', // Optional for custom behavior
                        // ],
                    ],
                ],
            ];

            $response = Http::withToken($accessToken)->post($url, $body);
            // $printableResponse = $response->json();
            // print_r($printableResponse, $fcmToken);
            if ($response->successful()) {
                Log::info("FCM data notification sent: {$message}");
            } else {
                Log::error("FCM error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("Exception sending FCM message: " . $e->getMessage());
        }
    }
}
