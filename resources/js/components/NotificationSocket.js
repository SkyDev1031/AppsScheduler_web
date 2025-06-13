import { useEffect, useRef } from 'react';

const NotificationsSocket = ({ userId, onMessage }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection on mount
    const isLocal = window.location.hostname === 'localhost';

    const socketID = isLocal
      ? `ws://localhost:8080?userId=${userId}`
      : `wss://www.appsscheduler.com/ws?userId=${userId}`;
    const socket = new WebSocket(socketID);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket connected=> ', socketID);
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log('📩 Message received:', msg);
      // TODO: handle UI update or toast notification
      // Trigger parent callback
      if (typeof onMessage === 'function') {
        onMessage(msg);
      }
    };

    socket.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('⚠️ WebSocket closed');
    };

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, [userId]);

  return null; // or use context/state to pass messages to the UI
};

export default NotificationsSocket;
