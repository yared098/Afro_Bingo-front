
// import React, { useEffect, useReducer, useRef, useMemo, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { socket } from '../socket';

// const initialState = {
//   reservedCards: [], 
//   mySelectedCards: [], 
//   timeLeft: null,
//   roomData: null,
// };

// function selectionReducer(state, action) {
//   switch (action.type) {
//     case 'SYNC_ROOM': {
//       const { currentRoom, userId } = action.payload;
//       const purchasedObj = currentRoom.purchasedCards || {};
//       const reserved = Object.keys(purchasedObj).map(Number);
//       const mine = Object.entries(purchasedObj)
//         .filter(([_, ownerId]) => ownerId === userId)
//         .map(([cardId]) => Number(cardId));
//       return { ...state, roomData: currentRoom, timeLeft: currentRoom.countdown, reservedCards: reserved, mySelectedCards: mine };
//     }
//     case 'TICK': return { ...state, timeLeft: action.payload };
    
//     case 'RESERVE_CARD': {
//       const { cardId, userId, currentUserId } = action.payload;
//       const numId = Number(cardId);
//       return {
//         ...state,
//         reservedCards: [...new Set([...state.reservedCards, numId])],
//         mySelectedCards: userId === currentUserId ? [...new Set([...state.mySelectedCards, numId])] : state.mySelectedCards,
//       };
//     }

//     // NEW: Handle deselection/refunds
//     case 'UNRESERVE_CARD': {
//       const { cardId } = action.payload;
//       const numId = Number(cardId);
//       return {
//         ...state,
//         reservedCards: state.reservedCards.filter(id => id !== numId),
//         mySelectedCards: state.mySelectedCards.filter(id => id !== numId),
//       };
//     }
//     default: return state;
//   }
// }

// const CardSelection = () => {
//   const { roomId } = useParams();
//   const { user } = useAuth();
//   const { isDark } = useTheme();
//   const navigate = useNavigate();
//   const [state, dispatch] = useReducer(selectionReducer, initialState);
//   const [balanceError, setBalanceError] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false); // NEW: Prevent spam clicking
//   const countRef = useRef(0);

//   useEffect(() => { countRef.current = state.mySelectedCards.length; }, [state.mySelectedCards]);

//   useEffect(() => {
//     if (!user?._id) return;
//     socket.emit('joinRoomInitial', { roomId, userId: user._id });
//     socket.emit('requestInitialData', user._id);

//     const handleRoomsUpdated = (allRooms) => {
//       const currentRoom = allRooms.find(r => r._id === roomId);
//       if (currentRoom) {
//         dispatch({ type: 'SYNC_ROOM', payload: { currentRoom, userId: user._id } });
//         if (currentRoom.status === 'started' && countRef.current > 0) {
//           navigate(`/game/${roomId}`);
//         }
//       }
//     };

//     const handleTimerTick = ({ roomId: id, countdown }) => {
//       if (id === roomId) {
//         dispatch({ type: 'TICK', payload: countdown });
//         if (countdown <= 0 && countRef.current > 0) navigate(`/game/${roomId}`);
//       }
//     };

//     const handleNumberReserved = (data) => {
//       dispatch({ type: 'RESERVE_CARD', payload: { ...data, currentUserId: user._id } });
//       setIsProcessing(false); // Re-enable clicks
//     };

//     const handleNumberUnreserved = (data) => {
//       dispatch({ type: 'UNRESERVE_CARD', payload: data });
//       setIsProcessing(false); // Re-enable clicks
//     };

//     socket.on('roomsUpdated', handleRoomsUpdated);
//     socket.on('timerTick', handleTimerTick);
//     socket.on('numberReserved', handleNumberReserved);
//     socket.on('numberUnreserved', handleNumberUnreserved); // NEW LISTENER

//     return () => {
//       socket.off('roomsUpdated', handleRoomsUpdated);
//       socket.off('timerTick', handleTimerTick);
//       socket.off('numberReserved', handleNumberReserved);
//       socket.off('numberUnreserved', handleNumberUnreserved);
//     };
//   }, [roomId, user?._id, navigate]);

//   const toggleCard = (id) => {
//     // 1. If taken by someone else, do nothing
//     const isMine = state.mySelectedCards.includes(id);
//     const isTakenByOther = state.reservedCards.includes(id) && !isMine;
    
//     if (isTakenByOther || isProcessing) return;

//     const entryPrice = state.roomData?.entryPrice || 10;
//     const currentBalance = user?.coins || 0;

//     // 2. If trying to buy NEW and balance is low
//     if (!isMine && currentBalance < entryPrice) {
//       setBalanceError(true);
//       setTimeout(() => setBalanceError(false), 3000);
//       return;
//     }

//     // 3. Emit to server. NOTE: We do NOT dispatch here. 
//     // We wait for the socket response to update the UI.
//     setIsProcessing(true);
//     socket.emit('reserveNumber', { roomId, cardId: id });
//   };

//   const gridButtons = useMemo(() => {
//     return Array.from({ length: 200 }, (_, i) => i + 1).map((id) => {
//       const isMine = state.mySelectedCards.includes(id);
//       const isTaken = state.reservedCards.includes(id) && !isMine;

//       return (
//         <button
//           key={id}
//           onClick={() => toggleCard(id)}
//           disabled={isTaken}
//           className={`
//             relative aspect-square flex items-center justify-center font-black rounded-xl text-sm transition-all duration-200 border-2
//             ${isMine 
//               ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105 z-10 active:scale-95' 
//               : isTaken 
//                 ? 'bg-slate-200 text-slate-400 border-slate-300 opacity-50 cursor-not-allowed' 
//                 : isDark 
//                   ? 'bg-slate-800/40 text-slate-400 border-white/5 hover:border-emerald-500 hover:text-white active:scale-90' 
//                   : 'bg-white text-slate-600 border-slate-100 shadow-sm hover:border-emerald-400 hover:bg-emerald-50 active:scale-90'
//             }
//           `}
//         >
//           {id}
//         </button>
//       );
//     });
//   }, [state.mySelectedCards, state.reservedCards, isDark, isProcessing]);

//   // ... (Keep the rest of your JSX template same as before)
//   return (
//       <div className={`h-screen w-full flex flex-col font-sans antialiased overflow-hidden transition-colors duration-500
//         ${isDark ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
        
//         {/* Dynamic Header */}
//         <header className={`px-4 py-3 border-b z-30 shadow-lg backdrop-blur-md sticky top-0 ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
          
//           {/* Error Notification */}
//           <div className={`absolute top-0 left-0 w-full transform transition-all duration-500 ${balanceError ? 'translate-y-0' : '-translate-y-full'}`}>
//             <div className="bg-rose-600 text-white text-[10px] font-black uppercase py-2 text-center shadow-xl">
//               🚨 Insufficient Balance! Top up to continue.
//             </div>
//           </div>
  
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-500/10 rounded-full transition-colors">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
//               </button>
//               <div>
//                 <h1 className="text-xs font-black text-emerald-500 uppercase tracking-widest leading-none">Box Selection</h1>
//                 <p className="text-[10px] opacity-50 font-bold uppercase tracking-tighter">Room: {state.roomData?.name || '...'}</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <div className={`hidden sm:flex flex-col items-end px-3 py-1 rounded-lg border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
//                 <span className="text-[8px] opacity-50 font-black uppercase">Wallet</span>
//                 <span className="text-xs font-black text-emerald-500">{user?.coins || 0} ETB</span>
//               </div>
  
//               <div className={`px-4 py-2 rounded-2xl border-2 font-mono font-black text-sm flex items-center gap-2 ${state.timeLeft < 10 ? 'text-rose-500 border-rose-500 animate-pulse' : 'text-emerald-500 border-emerald-500'}`}>
//                  <span className="w-2 h-2 rounded-full bg-current animate-ping" />
//                  {state.timeLeft !== null ? `00:${state.timeLeft.toString().padStart(2, '0')}` : "00:00"}
//               </div>
//             </div>
//           </div>
  
//           {/* Legend */}
//           <div className="flex gap-4 justify-center mt-3 border-t border-dashed border-slate-500/10 pt-2">
//             {['Mine', 'Taken', 'Open'].map((label) => (
//               <div key={label} className="flex items-center gap-1.5">
//                 <div className={`w-2.5 h-2.5 rounded-full ${label === 'Mine' ? 'bg-emerald-500' : label === 'Taken' ? 'bg-slate-300' : 'border border-slate-400'}`}></div>
//                 <span className="text-[9px] font-black uppercase text-slate-500">{label}</span>
//               </div>
//             ))}
//           </div>
//         </header>
  
//         {/* Grid Content */}
//         <main className="flex-1 p-4 overflow-y-auto scrollbar-hide">
//           <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2.5 w-full max-w-6xl mx-auto pb-32">
//             {gridButtons}
//           </div>
//         </main>
  
//         {/* Floating Action Footer */}
//         <footer className="fixed bottom-0 left-0 w-full p-4 z-40">
//           <div className={`max-w-2xl mx-auto p-4 rounded-[2.5rem] flex items-center justify-between border shadow-2xl backdrop-blur-xl
//             ${isDark ? 'bg-slate-900/90 border-white/10 shadow-emerald-900/20' : 'bg-white/90 border-slate-200 shadow-slate-200'}`}>
            
//             <div className="flex gap-5 pl-4">
//               <div className="flex flex-col">
//                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Selected</span>
//                 <span className="text-xl font-black leading-none">{state.mySelectedCards.length}</span>
//               </div>
//               <div className="flex flex-col border-l border-slate-500/20 pl-5">
//                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Stake</span>
//                 <span className="text-xl font-black text-emerald-500 leading-none">
//                   {(state.mySelectedCards.length * (state.roomData?.entryPrice || 10))}
//                   <small className="text-[10px] ml-1 opacity-60">ETB</small>
//                 </span>
//               </div>
//             </div>
  
//             <button 
//               onClick={() => state.mySelectedCards.length > 0 ? navigate(`/game/${roomId}`) : null}
//               className={`group relative overflow-hidden h-14 px-8 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all
//                 ${state.mySelectedCards.length > 0 
//                   ? 'bg-emerald-600 text-white shadow-lg active:scale-95 hover:bg-emerald-500' 
//                   : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'}`}
//             >
//               <span className="relative z-10">{state.mySelectedCards.length > 0 ? 'Enter Game →' : 'Select a Box'}</span>
//               {state.mySelectedCards.length > 0 && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
//               )}
//             </button>
//           </div>
//         </footer>
  
//         <style dangerouslySetInnerHTML={{ __html: `
//           @keyframes shimmer { 100% { transform: translateX(100%); } }
//           .scrollbar-hide::-webkit-scrollbar { display: none; }
//         `}} />
//       </div>
//     );
// };

// export default CardSelection;

import React, { useEffect, useReducer, useRef, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { socket } from '../socket';

const initialState = {
  reservedCards: [], 
  mySelectedCards: [], 
  timeLeft: null,
  roomData: null,
};

function selectionReducer(state, action) {
  switch (action.type) {
    case 'SYNC_ROOM': {
      const { currentRoom, userId } = action.payload;
      const purchasedObj = currentRoom.purchasedCards || {};
      const reserved = Object.keys(purchasedObj).map(Number);
      const mine = Object.entries(purchasedObj)
        .filter(([_, ownerId]) => ownerId === userId)
        .map(([cardId]) => Number(cardId));
      return { ...state, roomData: currentRoom, timeLeft: currentRoom.countdown, reservedCards: reserved, mySelectedCards: mine };
    }
    case 'TICK': return { ...state, timeLeft: action.payload };
    
    case 'RESERVE_CARD': {
      const { cardId, userId, currentUserId } = action.payload;
      const numId = Number(cardId);
      return {
        ...state,
        reservedCards: [...new Set([...state.reservedCards, numId])],
        mySelectedCards: userId === currentUserId ? [...new Set([...state.mySelectedCards, numId])] : state.mySelectedCards,
      };
    }

    case 'UNRESERVE_CARD': {
      const { cardId } = action.payload;
      const numId = Number(cardId);
      return {
        ...state,
        reservedCards: state.reservedCards.filter(id => id !== numId),
        mySelectedCards: state.mySelectedCards.filter(id => id !== numId),
      };
    }
    default: return state;
  }
}

const CardSelection = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(selectionReducer, initialState);
  const [balanceError, setBalanceError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 
  const countRef = useRef(0);

  useEffect(() => { countRef.current = state.mySelectedCards.length; }, [state.mySelectedCards]);

  useEffect(() => {
    if (!user?._id) return;
    socket.emit('joinRoomInitial', { roomId, userId: user._id });
    socket.emit('requestInitialData', user._id);

    const handleRoomsUpdated = (allRooms) => {
      const currentRoom = allRooms.find(r => r._id === roomId);
      if (currentRoom) {
        dispatch({ type: 'SYNC_ROOM', payload: { currentRoom, userId: user._id } });
        if (currentRoom.status === 'started' && countRef.current > 0) {
          navigate(`/game/${roomId}`);
        }
      }
    };

    const handleTimerTick = ({ roomId: id, countdown }) => {
      if (id === roomId) {
        dispatch({ type: 'TICK', payload: countdown });
        if (countdown <= 0 && countRef.current > 0) navigate(`/game/${roomId}`);
      }
    };

    const handleNumberReserved = (data) => {
      dispatch({ type: 'RESERVE_CARD', payload: { ...data, currentUserId: user._id } });
      setIsProcessing(false); 
    };

    const handleNumberUnreserved = (data) => {
      dispatch({ type: 'UNRESERVE_CARD', payload: data });
      setIsProcessing(false); 
    };

    socket.on('roomsUpdated', handleRoomsUpdated);
    socket.on('timerTick', handleTimerTick);
    socket.on('numberReserved', handleNumberReserved);
    socket.on('numberUnreserved', handleNumberUnreserved); 

    return () => {
      socket.off('roomsUpdated', handleRoomsUpdated);
      socket.off('timerTick', handleTimerTick);
      socket.off('numberReserved', handleNumberReserved);
      socket.off('numberUnreserved', handleNumberUnreserved);
    };
  }, [roomId, user?._id, navigate]);

  const toggleCard = (id) => {
    const isMine = state.mySelectedCards.includes(id);
    const isTakenByOther = state.reservedCards.includes(id) && !isMine;
    
    if (isTakenByOther || isProcessing) return;

    const entryPrice = state.roomData?.entryPrice || 10;
    const currentBalance = user?.coins || 0;

    if (!isMine && currentBalance < entryPrice) {
      setBalanceError(true);
      setTimeout(() => setBalanceError(false), 3000);
      return;
    }

    setIsProcessing(true);
    socket.emit('reserveNumber', { roomId, cardId: id });
  };

  const gridButtons = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => i + 1).map((id) => {
      const isMine = state.mySelectedCards.includes(id);
      const isTaken = state.reservedCards.includes(id) && !isMine;

      return (
        <button
          key={id}
          onClick={() => toggleCard(id)}
          disabled={isTaken}
          className={`
            relative aspect-square flex flex-col items-center justify-center font-black rounded-xl text-sm tracking-tight transition-all duration-150 select-none border
            ${isMine 
              ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.45)] scale-105 z-10 active:scale-95 transform' 
              : isTaken 
                ? 'bg-slate-100/70 text-slate-400 dark:bg-slate-800/20 dark:text-slate-600 border-slate-200/50 dark:border-slate-800/80 opacity-40 cursor-not-allowed line-through' 
                : isDark 
                  ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-emerald-500 hover:text-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.15)] active:scale-95' 
                  : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-600 active:scale-95'
            }
          `}
        >
          <span>{id}</span>
          {isMine && (
            <span className="absolute bottom-1 text-[7px] tracking-widest text-emerald-100 font-extrabold uppercase scaling-pulsate">
              MINE
            </span>
          )}
        </button>
      );
    });
  }, [state.mySelectedCards, state.reservedCards, isDark, isProcessing]);

  return (
    <div className={`h-screen w-full flex flex-col font-sans antialiased overflow-hidden transition-colors duration-500
      ${isDark ? 'bg-[#090d16] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      
      {/* Dynamic Header */}
      <header className={`px-4 py-3 border-b z-30 shadow-sm backdrop-blur-md sticky top-0 ${isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white/80 border-slate-200'}`}>
        
        {/* Error Notification Banner */}
        <div className={`absolute top-0 left-0 w-full transform transition-all duration-500 ease-out z-50 ${balanceError ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white text-[11px] font-black uppercase py-2.5 text-center shadow-2xl tracking-wider flex items-center justify-center gap-2">
            <span>🚨 Insufficient Balance! Top up your wallet to book this box.</span>
          </div>
        </div>

        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => navigate('/')} 
              className={`p-2 rounded-xl transition-all border ${isDark ? 'border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-500'}`}
            >
              <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xs font-black text-emerald-500 uppercase tracking-widest leading-none mb-0.5">Box Selection</h1>
              <p className="text-[11px] opacity-60 font-bold uppercase tracking-tight">
                Room: <span className={isDark ? "text-slate-200" : "text-slate-800"}>{state.roomData?.name || '---'}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Wallet Tracker */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] opacity-40 font-black uppercase tracking-wider">Wallet</span>
                <span className="text-xs font-black text-emerald-500 mt-0.5">{user?.coins || 0} <span className="text-[9px] font-normal opacity-70">ETB</span></span>
              </div>
            </div>

            {/* System Clock Timer */}
            <div className={`px-3.5 py-1.5 rounded-xl border-2 font-mono font-black text-xs flex items-center gap-2 transition-colors duration-300 ${state.timeLeft !== null && state.timeLeft < 10 ? 'text-rose-500 border-rose-500/30 bg-rose-500/10 animate-pulse' : 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'}`}>
               <span className={`w-1.5 h-1.5 rounded-full bg-current ${state.timeLeft !== null && state.timeLeft < 10 ? 'animate-ping' : ''}`} />
               {state.timeLeft !== null ? `00:${state.timeLeft.toString().padStart(2, '0')}` : "00:00"}
            </div>
          </div>
        </div>

        {/* Dynamic Map Legends */}
        <div className="flex gap-5 justify-center mt-3 border-t border-dashed dark:border-slate-800 border-slate-200 pt-2.5">
          {[
            { label: 'Mine', color: 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' },
            { label: 'Taken', color: 'bg-slate-300 dark:bg-slate-700/60' },
            { label: 'Open', color: 'border border-slate-400 dark:border-slate-600' }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-md ${item.color}`} />
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Grid Canvas Wrapper */}
      <main className="flex-1 p-4 overflow-y-auto global-grid-scroll bg-gradient-to-b from-transparent to-slate-500/[0.02]">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 w-full max-w-6xl mx-auto pb-36">
          {gridButtons}
        </div>
      </main>

      {/* Floating Control Dashboard */}
      <footer className="fixed bottom-0 left-0 w-full p-4 z-40 bg-gradient-to-t from-slate-950/40 via-slate-950/10 to-transparent pointer-events-none">
        <div className={`max-w-xl mx-auto p-3.5 rounded-[2rem] flex items-center justify-between border shadow-2xl backdrop-blur-xl pointer-events-auto transition-all duration-300
          ${isDark ? 'bg-slate-900/90 border-slate-800/80 shadow-emerald-950/10' : 'bg-white/95 border-slate-200/80 shadow-slate-300/60'}`}>
          
          <div className="flex gap-4 pl-3">
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Selected</span>
              <span className="text-lg font-black leading-none mt-1 dark:text-slate-100">{state.mySelectedCards.length}</span>
            </div>
            <div className="flex flex-col justify-center border-l dark:border-slate-800 border-slate-200 pl-4">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Stake</span>
              <span className="text-lg font-black text-emerald-500 leading-none mt-1">
                {(state.mySelectedCards.length * (state.roomData?.entryPrice || 10))}
                <small className="text-[9px] ml-1 font-bold opacity-70">ETB</small>
              </span>
            </div>
          </div>

          <button 
            onClick={() => state.mySelectedCards.length > 0 ? navigate(`/game/${roomId}`) : null}
            disabled={state.mySelectedCards.length === 0}
            className={`group relative overflow-hidden h-12 px-6 rounded-[1.4rem] font-black text-xs uppercase tracking-widest transition-all duration-200 flex items-center gap-1
              ${state.mySelectedCards.length > 0 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 active:scale-[0.98] hover:brightness-110 cursor-pointer' 
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
          >
            <span className="relative z-10">{state.mySelectedCards.length > 0 ? 'Enter Game' : 'Select a Box'}</span>
            {state.mySelectedCards.length > 0 && <span className="relative z-10 transition-transform group-hover:translate-x-1 duration-200">→</span>}
            
            {state.mySelectedCards.length > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
            )}
          </button>
        </div>
      </footer>

      {/* Embedded CSS Enhancements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .global-grid-scroll::-webkit-scrollbar { width: 5px; }
        .global-grid-scroll::-webkit-scrollbar-track { background: transparent; }
        .global-grid-scroll::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.2); border-radius: 10px; }
        .global-grid-scroll::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.3); }
        @keyframes subtlePulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; transform: scale(1.02); } }
        .scaling-pulsate { animation: subtlePulse 2s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default CardSelection;