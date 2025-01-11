import { useEffect, useRef, useCallback } from 'react';

interface WebSocketMessage {
    type: string;
    data?: string;
    message?: string;
    input_data?: string;
}

interface WebSocketConfig {
    endpoint: string;
    onOpen?: () => void;
    onError?: (error: Event) => void;
    onClose?: () => void;
}

export const useWebSocket = ({ endpoint, onOpen, onError, onClose }: WebSocketConfig) => {
    const wsRef = useRef<WebSocket | null>(null);
    const messageCallbacksRef = useRef<((data: WebSocketMessage) => void)[]>([]);

    const connect = useCallback(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            wsRef.current = new WebSocket(endpoint);

            wsRef.current.onopen = () => {
                console.log('Connected to WebSocket');
                onOpen?.();
            };

            wsRef.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                messageCallbacksRef.current.forEach(callback => callback(data));
            };

            wsRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                onError?.(error);
            };

            wsRef.current.onclose = () => {
                console.log('WebSocket connection closed');
                onClose?.();
            };
        }
    }, [endpoint, onOpen, onError, onClose]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    }, []);

    const addMessageListener = useCallback((callback: (data: WebSocketMessage) => void) => {
        messageCallbacksRef.current.push(callback);
        return () => {
            messageCallbacksRef.current = messageCallbacksRef.current.filter(cb => cb !== callback);
        };
    }, []);

    const sendMessage = useCallback((message: object) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.error('WebSocket is not connected');
        }
    }, []);

    const runCode = useCallback((code: string, language: string, input: string = '') => {
        sendMessage({
            command: 'run',
            code,
            language,
            input
        });
    }, [sendMessage]);

    const stopCode = useCallback(() => {
        sendMessage({
            command: 'stop'
        });
    }, [sendMessage]);

    const sendInput = useCallback((input: string) => {
        sendMessage({
            command: 'input',
            input
        });
    }, [sendMessage]);

    useEffect(() => {
        disconnect();
        connect();

        return () => {
            disconnect();
        };
    }, [endpoint, connect, disconnect]);

    return {
        connect,
        disconnect,
        addMessageListener,
        runCode,
        stopCode,
        sendInput,
        isConnected: wsRef.current?.readyState === WebSocket.OPEN
    };
};