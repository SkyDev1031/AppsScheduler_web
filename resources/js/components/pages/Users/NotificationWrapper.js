// import { useEffect } from 'react';
// import io from 'socket.io-client';
// import NotificationManagement from './NotificationManagement'

// const socket = io('http://localhost:3001'); // Replace with deployed Node server URL

// export default function NotificationWrapper({ participantId }) {
//     useEffect(() => {
//         // Register user
//         socket.emit('register', participantId);

//         socket.on('notification', (notification) => {
//             // Update UI or trigger fetch
//             alert(`New notification: ${notification.title}`);
//             // Optionally call fetchNotifications again
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, [participantId]);

//     return <NotificationManagement />;
// }
