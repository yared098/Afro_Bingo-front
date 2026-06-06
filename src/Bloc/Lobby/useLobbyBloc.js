// src/Bloc/Lobby/useLobbyBloc.js
import { useReducer, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { lobbyReducer, initialLobbyState } from './lobbyBloc';

import { socket } from '../../socket'; // <- use shared socket


export const useLobbyBloc = (userId) => {
    const [state, dispatch] = useReducer(lobbyReducer, initialLobbyState);

    useEffect(() => {
        if (!userId) return;

        // Function to refresh room data
        const refreshData = () => {
            // console.log("🔄 Requesting fresh room data...");
            socket.emit('requestInitialData', userId);
        };

        const onConnect = () => {
            // console.log("✅ Socket Connected");
            dispatch({ type: 'SET_CONNECTED', payload: true });
            refreshData(); // 👈 Auto-fetch rooms as soon as it reconnects!
        };

        const onDisconnect = () => {
            // console.log("❌ Socket Disconnected");
            dispatch({ type: 'SET_CONNECTED', payload: false });
        };

        const onRoomsUpdate = (data) => {
            dispatch({ type: 'UPDATE_ROOMS', payload: data });
        };

        const onTick = (data) => {
            dispatch({ type: 'TIMER_TICK', payload: data });
        };
        // --- ADD THIS HANDLER ---
        const onRoomReset = () => {
            socket.emit('requestInitialData', userId);
        };
        // --- NEW: handle roomDeleted event ---
        const onRoomDeleted = ({ roomId }) => {
            dispatch({ type: 'REMOVE_ROOM', payload: roomId });
        };

        // Attach listeners
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('roomsUpdated', onRoomsUpdate);
        socket.on('timerTick', onTick);
        socket.on('roomReset', onRoomReset); // <- ADD THIS
        socket.on('roomDeleted', onRoomDeleted); // <- added


        // If already connected when mounting
        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('roomsUpdated', onRoomsUpdate);
            socket.off('timerTick', onTick);
            socket.off('roomReset', onRoomReset); // <- ADD THIS
            socket.off('roomDeleted', onRoomDeleted); // <- cleanup

        };
    }, [userId]);

    const joinRoomAction = useCallback((roomId) => {
        if (!socket.connected) return;
        socket.emit('joinRoomInitial', { roomId, userId });
    }, [userId]);

    return { 
        state, 
        joinRoomAction, 
        isConnected: state.isConnected 
    };
};