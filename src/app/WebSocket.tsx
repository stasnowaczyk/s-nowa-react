import { useEffect, useRef } from 'react';

const WEBSOCKET_URL = 'ws://localhost:8000/ws/now-playing';

function WebSocketComponent() {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = new WebSocket(WEBSOCKET_URL);

            socketRef.current.onopen = () => {
                console.log('WebSocket Connected');
            };

            socketRef.current.onmessage = (event: MessageEvent) => {
                // Handle non-JSON messages like "ping" or "pong"
                if (event.data === 'ping' || event.data === 'pong') {
                    socketRef.current?.send('pong'); // Respond to keep connection alive
                    return;
                }

                try {
                    console.log('Message from server:', JSON.parse(event.data));
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            socketRef.current.onclose = () => {
                console.log('WebSocket Disconnected');
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
        }

        return () => {
            socketRef.current?.close();
        };
    }, []);

    return <div>WebSocket Test</div>;
}

export default WebSocketComponent;
