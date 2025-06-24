<?php

namespace App\Services;

class WebSocketNotifier
{
    /**
     * Send a message to a specific user via the PHP WebSocket server.
     *
     * @param string|int $userId
     * @param string $message
     * @return void
     * @throws \Exception
     */
    public function sendToUser($userId, $message): void
    {
        if (!is_string($message) && !is_array($message)) {
            throw new \InvalidArgumentException("Message must be string or array.");
        }
        $payload = json_encode([
            'toUserId' => $userId,
            'message' => is_array($message) ? $message : ['text' => $message],
        ]);

        // Connect to your WebSocket server's local TCP bridge (127.0.0.1:5678)
        $fp = @stream_socket_client("tcp://127.0.0.1:5678", $errno, $errstr, 5); // 5s timeout

        if (!$fp) {
            throw new \Exception("Could not connect to WebSocket server: $errstr ($errno)");
        }

        fwrite($fp, $payload);
        fclose($fp);
    }
}
