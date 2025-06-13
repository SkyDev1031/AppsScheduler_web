<?php

namespace App\WebSocket;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class MyWebSocket implements MessageComponentInterface
{
    public $userConnections = [];

    public function onOpen(ConnectionInterface $conn)
    {
        // Get userId from query string
        $queryString = $conn->httpRequest->getUri()->getQuery();
        parse_str($queryString, $queryParams);
        $userId = $queryParams['userId'] ?? null;

        if ($userId) {
            $this->userConnections[$userId] = $conn;
            echo "[WS] New connection: User ID $userId (Conn ID {$conn->resourceId})\n";
        } else {
            echo "[WS] Connection without userId - closing.\n";
            $conn->close();
        }
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);

        if (isset($data['type']) && $data['type'] === 'identify') {
            $userId = $data['userId'];
            $this->userConnections[$userId] = $from;
        }

        // handle other message types...
        echo "[WS] Message from Conn ID {$from->resourceId}: $msg\n";
    }

    public function onClose(ConnectionInterface $conn)
    {
        foreach ($this->userConnections as $userId => $connection) {
            if ($connection === $conn) {
                unset($this->userConnections[$userId]);
                echo "[WS] Connection closed: User ID $userId (Conn ID {$conn->resourceId})\n";
                break;
            }
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "[WS] Error: {$e->getMessage()}\n";
        $conn->close();
    }
}
