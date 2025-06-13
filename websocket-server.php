<?php

use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Server\IoServer;
use App\WebSocket\MyWebSocket;
use React\EventLoop\Loop;
use React\Socket\SocketServer;

require __DIR__ . '/vendor/autoload.php';

// ✅ NEW: Get event loop
$loop = Loop::get();

// ✅ Create WebSocket server
$webSocket = new SocketServer('0.0.0.0:8080', [], $loop);
echo "[INFO] WebSocket server started on ws://localhost:8080\n";

// ✅ Your app handler
$app = new MyWebSocket(); // implements MessageComponentInterface

$server = new IoServer(
    new HttpServer(new WsServer($app)),
    $webSocket,
    $loop
);

// ✅ TCP bridge for Laravel -> WebSocket messages
$tcp = stream_socket_server("tcp://127.0.0.1:5555", $errno, $errstr);
if (!$tcp) {
    echo "[ERROR] Failed to start TCP bridge: $errstr ($errno)\n";
    exit(1);
}
stream_set_blocking($tcp, false);
echo "[INFO] TCP bridge listening on 127.0.0.1:5555 for Laravel input\n";

// 🔁 Listen for Laravel messages
$loop->addReadStream($tcp, function ($tcp) use ($app) {
    $conn = @stream_socket_accept($tcp, 0);
    if ($conn) {
        $data = fread($conn, 1024);
        $message = json_decode($data, true);

        echo "[TCP] Received Laravel message: " . $data . "\n";

        if (!empty($message['toUserId']) && isset($app->userConnections[$message['toUserId']])) {
            $targetConn = $app->userConnections[$message['toUserId']];
            $targetConn->send(json_encode([
                'from' => 'server',
                'message' => $message['message'],
            ]));
            echo "[TCP] Message sent to user {$message['toUserId']}\n";
        } else {
            echo "[TCP] User ID {$message['toUserId']} not connected or invalid\n";
        }

        fclose($conn);
    }
});

// ✅ Run everything
echo "[INFO] WebSocket + TCP bridge server running...\n";
$loop->run();
