

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const config = {
  transports: ['websocket', 'polling'], // 👈 Move websocket to the front
  // transports: ['polling', 'websocket'], // 👈 Add polling here
  // transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  timeout: 20000,
  autoConnect: false,
};

// 1. The Main Socket (for Bingo/General)
export const socket = io(SOCKET_URL, config);

// 2. The Equb Specific Namespace Socket
export const equbSocket = io(`${SOCKET_URL}/equb`, config);

// Helper to update tokens for BOTH sockets
export const connectSocket = (token) => {
  if (token) {
    // Set auth for main socket
    socket.auth = { token };
    socket.connect();

    // Set auth for equb socket
    equbSocket.auth = { token };
    equbSocket.connect();
    
    console.log("🔌 Connecting all sockets with token...");
  }
};

// Helper to disconnect both
export const disconnectSocket = () => {
  socket.disconnect();
  equbSocket.disconnect();
};