import { useReducer, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { selectionReducer, initialSelectionState } from './selectionBloc';

import { socket } from '../../socket'; // <- use shared socket

export const useSelectionBloc = (roomId, userId, onGameStart) => {
    const [state, dispatch] = useReducer(selectionReducer, initialSelectionState);
    const hasNavigated = useRef(false); // Prevents the "Throttling Navigation" error

    useEffect(() => {
        if (!userId || !roomId) return;

        socket.emit('joinRoomInitial', { roomId, userId });
        socket.emit('requestInitialData', userId);

        const handleRoomsUpdated = (allRooms) => {
            const currentRoom = allRooms.find(r => r._id === roomId);
            if (!currentRoom) return;

            const purchasedObj = currentRoom.purchasedCards || {};
            const reservedIds = Object.keys(purchasedObj).map(id => Number(id));
            const mine = Object.entries(purchasedObj)
                .filter(([_, ownerId]) => ownerId === userId)
                .map(([cardId]) => Number(cardId));

            dispatch({ 
                type: 'SYNC_ROOM_DATA', 
                payload: { room: currentRoom, reservedIds, mine } 
            });

            // FIX: Only trigger navigation once
            if (currentRoom.status === 'started' && !hasNavigated.current) {
                hasNavigated.current = true;
                onGameStart();
            }
        };

        const handleTimerTick = ({ roomId: incomingId, countdown }) => {
            if (incomingId === roomId) {
                dispatch({ type: 'TIMER_TICK', payload: countdown });
                if (countdown <= 0 && !hasNavigated.current) {
                    hasNavigated.current = true;
                    onGameStart();
                }
            }
        };

        const handleNumberReserved = ({ cardId, userId: reserverId }) => {
            dispatch({ 
                type: 'RESERVE_SUCCESS', 
                payload: { cardId: Number(cardId), isMine: reserverId === userId } 
            });
        };

        socket.on('roomsUpdated', handleRoomsUpdated);
        socket.on('timerTick', handleTimerTick);
        socket.on('numberReserved', handleNumberReserved);
        socket.on('error', () => socket.emit('requestInitialData', userId));

        return () => {
            socket.off('roomsUpdated', handleRoomsUpdated);
            socket.off('timerTick', handleTimerTick);
            socket.off('numberReserved', handleNumberReserved);
            socket.off('error');
        };
    }, [roomId, userId, onGameStart]);

    const reserveCard = useCallback((cardId, userName) => {
        // Optimistic UI update (matching your toggleCard logic)
        if (state.reservedCards.includes(cardId)) return;

        socket.emit('reserveNumber', { 
            roomId, 
            cardId, 
            userData: { _id: userId, name: userName || "Player" } 
        });
    }, [roomId, userId, state.reservedCards]);

    return { state, reserveCard };
};