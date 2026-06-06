
import { useReducer, useEffect, useCallback } from 'react';
import { bingoReducer, initialBingoState } from './bingoBloc';
import { socket } from '../../socket.js';

export const useBingoBloc = (roomId, userId, onNumberDrawn) => {
  const [state, dispatch] = useReducer(bingoReducer, initialBingoState);

  useEffect(() => {
    if (!userId || !roomId) return;

    // --- CONNECTION HANDLERS ---
    const onConnect = () => dispatch({ type: 'SET_CONNECTED', payload: true });
    const onDisconnect = () => dispatch({ type: 'SET_CONNECTED', payload: false });

    // --- GAME EVENT HANDLERS ---

    const handleInitCard = (data) => {
      // Filter by roomId to prevent data cross-talk
      if (data.roomId && data.roomId !== roomId) return;
      
      // Support both single cardData (fallback) and the new cards array
      const cardPayload = data.cards || data.cardData;
      dispatch({ type: 'INIT_CARD', payload: cardPayload });
      
      if (data.balance !== undefined) {
        dispatch({ type: 'UPDATE_BALANCE', payload: data.balance });
      }
    };

    const handleGameStatus = (data) => {
      if (data.roomId && data.roomId !== roomId) return;
      
      // If status update includes cards, refresh them
      if (data.cards || data.cardData) {
        dispatch({ type: 'INIT_CARD', payload: data.cards || data.cardData });
      }

      dispatch({ type: 'UPDATE_GAME_STATUS', payload: data });
      
      if (data.balance !== undefined) {
        dispatch({ type: 'UPDATE_BALANCE', payload: data.balance });
      }
    };

    const handleNumberDrawn = (data) => {
      if (data.roomId && data.roomId !== roomId) return;

      const num = typeof data === 'object' ? data.number : data;
      const history = typeof data === 'object' ? data.history : [];
      
      if (onNumberDrawn) onNumberDrawn(num);
      dispatch({ type: 'NUMBER_DRAWN', payload: { number: num, history } });
    };

    const handleAnnouncement = (data) => {
      if (data.roomId && data.roomId !== roomId) return;

      // console.log(`🏆 Room ${roomId} winner:`, data.winnerName);
      
      if (data.winnerId === userId && data.newBalance !== undefined) {
        dispatch({ type: 'UPDATE_BALANCE', payload: data.newBalance });
      }

      dispatch({
        type: 'ANNOUNCE_WINNER',
        payload: {
          winnerId: data.winnerId,
          winnerName: data.winnerName,
          prize: data.prize || data.prizeBirr || 0,
          pattern: data.pattern || data.winningPattern,
          cardId: data.cardId // Useful to show which specific card won
        }
      });
    };
    // --- ADD THIS HANDLER ---
const handleRoomReset = (data) => {
  if (data.roomId && data.roomId !== roomId) return;
  // Trigger an error message so the UI can redirect the user
  dispatch({ type: 'SET_ERROR', payload: 'Room reset: No players joined.' });
  // After 2 seconds, we can force a redirect or state change
  setTimeout(() => { window.location.href = '/'; }, 2000);
};

    const handleBingoError = (msg) => {
      if (typeof msg === 'object' && msg.roomId && msg.roomId !== roomId) return;
      
      const errorMessage = typeof msg === 'object' ? msg.message : msg;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      setTimeout(() => dispatch({ type: 'SET_ERROR', payload: '' }), 3000);
    };

    const handleBalanceUpdate = (data) => {
      const newBalance = typeof data === 'object' ? data.balance : data;
      dispatch({ type: 'UPDATE_BALANCE', payload: newBalance });
    };

    // --- SUBSCRIPTIONS ---
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('initCard', handleInitCard);
    socket.on('gameStatus', handleGameStatus);
    socket.on('numberDrawn', handleNumberDrawn);
    socket.on('bingoAnnouncement', handleAnnouncement);
    socket.on('bingoError', handleBingoError);
    socket.on('balanceUpdate', handleBalanceUpdate);
    socket.on('roomReset', handleRoomReset); // <- ADD THIS

    // Join room
    socket.emit('joinRoom', { roomId, userId });

    // --- CLEANUP ---
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('initCard', handleInitCard);
      socket.off('gameStatus', handleGameStatus);
      socket.off('numberDrawn', handleNumberDrawn);
      socket.off('bingoAnnouncement', handleAnnouncement);
      socket.off('bingoError', handleBingoError);
      socket.off('balanceUpdate', handleBalanceUpdate);
    };
  }, [roomId, userId, onNumberDrawn]);

  // --- ACTIONS ---

  const claimBingo = useCallback(() => {
    // Get the currently active card from state
    const currentCard = state.cards[state.activeCardIndex];
    
    if (!currentCard) {
      return dispatch({ type: 'SET_ERROR', payload: 'No card selected' });
    }

    socket.emit('claimBingo', { 
        roomId, 
        userId, 
        cardId: currentCard.cardId // Crucial: Tell backend which card is claiming Bingo
    });
  }, [roomId, userId, state.cards, state.activeCardIndex]);

  const setActiveCard = useCallback((index) => {
    dispatch({ type: 'SET_ACTIVE_CARD', payload: index });
  }, []);

  const setTab = (tab) => dispatch({ type: 'SWITCH_TAB', payload: tab });

  return { 
    state, 
    claimBingo, 
    setActiveCard, 
    setTab 
  };
};