
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { useLobbyBloc } from '../Bloc/Lobby/useLobbyBloc';
// import { useLanguage } from '../context/LanguageContext';
// import { motion, AnimatePresence } from 'framer-motion';

// const BingoLobby = () => {
//   const { user, api, refreshUser } = useAuth();
//   const { isDark } = useTheme();
//   const { t } = useLanguage(); 
//   const navigate = useNavigate();
  
//   const [bonus, setBonus] = useState(null); 
//   const { state, isConnected, joinRoomAction } = useLobbyBloc(user?._id);
//   const { rooms } = state;

//   // 1. Loading logic: if rooms array is empty, we show skeletons
//   const isLoading = rooms.length === 0;

//   const sortedRooms = [...rooms].sort((a, b) => a.entryPrice - b.entryPrice);

//   useEffect(() => {
//     document.body.classList.add('app-ready');
//   }, []);

//   // --- SKELETON COMPONENT ---
//   const RoomSkeleton = () => (
//     <div className={`grid grid-cols-4 items-center w-full py-4 px-1 rounded-xl border animate-pulse ${
//       isDark ? 'bg-[#1e293b]/50 border-white/5' : 'bg-white border-slate-200'
//     }`}>
//       <div className="flex flex-col items-center gap-1">
//         <div className={`h-4 w-12 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
//       </div>
//       <div className="flex justify-center">
//         <div className={`h-4 w-10 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
//       </div>
//       <div className="flex justify-center">
//         <div className={`h-4 w-14 rounded ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
//       </div>
//       <div className="px-2">
//         <div className={`h-8 w-full rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
//       </div>
//     </div>
//   );

//   // --- LOGIC HELPERS ---
//   const formatTime = (seconds) => {
//     if (seconds <= 0) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleInteraction = () => {
//     if (!bonus && Math.random() < 0.05) {
//       const amount = Math.random() > 0.5 ? 20 : 10;
//       setBonus(amount);
//       if (window.Telegram?.WebApp) {
//         window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
//       }
//     }
//   };

  
//   const handleJoinTable = (room) => {
//     if (!isConnected || !user?._id) return;

//     // Check if the user is already in THIS specific room
//     const isParticipant = room.players?.some(p => 
//       (p.userId === user._id || p === user._id || p._id === user._id)
//     );

//     // 1. If I am already in this room, take me to the right screen
//     if (isParticipant) {
//       navigate(room.status === 'started' ? `/game/${room._id}` : `/select-card/${room._id}`);
//       return;
//     }

//     // 2. If the room has already started and I'm NOT in it, do nothing (Guard)
//     if (room.status === 'started') {
//       const msg = "This game has already started.";
//       if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert(msg);
//       return;
//     }

//     // 3. If I am already playing in a DIFFERENT room, block entry
//     const isAlreadyPlayingElsewhere = rooms.some(r => 
//       r._id !== room._id && r.players?.some(p => (p.userId === user._id || p === user._id || p._id === user._id))
//     );

//     if (isAlreadyPlayingElsewhere) {
//       const busyMsg = t.alreadyPlaying;
//       if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert(busyMsg);
//       else alert(busyMsg);
//       return; 
//     }

//     // 4. If everything is clear, join the room
//     // Note: We don't navigate immediately here if we want to wait for the Bloc to confirm,
//     // but usually, joinRoomAction handles the socket join.
//     joinRoomAction(room._id);
//     navigate(`/select-card/${room._id}`);
//   };

//   return (
//     <div className={`flex flex-col h-full max-w-4xl mx-auto transition-colors duration-500 ${
//       isDark ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]'
//     }`}>
      
//       <div className="flex flex-col items-center py-6">
//         <h2 className={`text-xl font-black text-center mb-6 uppercase tracking-tight ${
//           isDark ? 'text-white' : 'text-slate-800'
//         }`}>
//           {t.chooseStake}
//         </h2>

//         {/* Header Row */}
//         <div className={`grid grid-cols-4 w-full px-4 mb-2 text-[10px] font-black uppercase tracking-widest text-center ${
//           isDark ? 'text-slate-500' : 'text-slate-400'
//         }`}>
//           <div>{t.stake}</div>
//           <div>{t.active}</div>
//           <div>{t.possibleWin}</div>
//           <div>{t.join}</div>
//         </div>

//         {/* List Container */}
//         <div className="flex flex-col gap-2 w-full px-2 overflow-y-auto pb-28 scrollbar-hide min-h-[400px]">
//           <AnimatePresence mode="wait">
//             {isLoading ? (
//               // Loading Skeletons
//               <motion.div 
//                 key="loading-state"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="flex flex-col gap-2 w-full"
//               >
//                 {[1, 2, 3, 4, 5, 6].map((i) => <RoomSkeleton key={i} />)}
//               </motion.div>
//             ) : (
//               // Actual Rooms List
//               <motion.div 
//                 key="rooms-list"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex flex-col gap-2 w-full"
//               >
//                 {sortedRooms.map((room) => {
//                   const isParticipant = room.players?.some(p => (p.userId === user._id || p === user._id || p._id === user._id));
//                   const isAlreadyPlayingElsewhere = rooms.some(r => r._id !== room._id && r.players?.some(p => (p.userId === user._id || p === user._id || p._id === user._id)));
//                   const realCardCount = Object.keys(room.purchasedCards || {}).length;
//                   const displayPrize = realCardCount * room.entryPrice || room.entryPrice * 3; 
//                   const isLive = room.status === 'started';
//                   const isDisabled = (isLive && !isParticipant) || (isAlreadyPlayingElsewhere && !isParticipant);

//                   return (
//                     <motion.div 
//                       layout
//                       key={room._id} 
//                       onTapStart={handleInteraction} 
//                       className={`grid grid-cols-4 items-center w-full py-3 px-1 rounded-xl border transition-all duration-300 ${
//                         isDark ? 'bg-[#1e293b] border-white/5 shadow-lg' : 'bg-white border-slate-200 shadow-sm'
//                       } ${isDisabled ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
//                     >
//                       <div className={`text-center font-black text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
//                         {room.entryPrice} <span className="text-[10px] font-bold opacity-60">ETB</span>
//                       </div>

//                       <div className="text-center font-mono font-bold">
//                         {isLive ? (
//                           <span className="text-rose-500 text-[10px] animate-pulse uppercase tracking-tighter">{t.playing}</span>
//                         ) : (
//                           <span className={`${isDark ? 'text-rose-400' : 'text-rose-600'} text-sm tabular-nums`}>
//                             {formatTime(room.countdown)}
//                           </span>
//                         )}
//                       </div>

//                       <div className="text-center">
//                         <div className={`flex items-center justify-center gap-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
//                           <span className="text-sm font-black tabular-nums">{displayPrize} +</span>
//                           <span className="text-[8px] font-bold uppercase opacity-60">ETB</span>
//                         </div>
//                       </div>

//                       <div className="px-2">
//                         <button 
//                           onClick={() => handleJoinTable(room)}
//                           className={`w-full py-2 rounded-lg font-black text-[10px] flex items-center justify-center gap-1 transition-all ${
//                             isParticipant 
//                               ? 'bg-emerald-500 text-white' 
//                               : isDisabled 
//                                 ? 'bg-slate-400 text-white cursor-not-allowed' 
//                                 : 'bg-yellow-400 text-slate-900 hover:bg-yellow-500'
//                           }`}
//                         >
//                           {isParticipant ? t.rejoin : (isAlreadyPlayingElsewhere ? t.busy : t.join)}
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>

    

//       <style dangerouslySetInnerHTML={{ __html: `
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         body { background-color: ${isDark ? '#0f172a' : '#f1f5f9'}; }
//       `}} />
//     </div>
//   );
// };

// export default BingoLobby;  

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLobbyBloc } from '../Bloc/Lobby/useLobbyBloc';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const BingoLobby = () => {
  const { user, api, refreshUser } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage(); 
  const navigate = useNavigate();
  
  const [bonus, setBonus] = useState(null); 
  const { state, isConnected, joinRoomAction } = useLobbyBloc(user?._id);
  const { rooms } = state;

  // 1. Loading logic: if rooms array is empty, we show skeletons
  const isLoading = rooms.length === 0;

  const sortedRooms = [...rooms].sort((a, b) => a.entryPrice - b.entryPrice);

  useEffect(() => {
    document.body.classList.add('app-ready');
  }, []);

  // --- PREMIUM REDESIGNED SKELETON COMPONENT ---
  const RoomSkeleton = () => (
    <div className={`grid grid-cols-4 items-center w-full py-4 px-2 rounded-2xl border animate-pulse ${
      isDark ? 'bg-[#0d0e1a] border-slate-900' : 'bg-white border-slate-100'
    }`}>
      <div className="flex justify-center">
        <div className={`h-5 w-14 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      </div>
      <div className="flex justify-center">
        <div className={`h-5 w-12 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      </div>
      <div className="flex justify-center">
        <div className={`h-5 w-16 rounded-lg ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      </div>
      <div className="px-1">
        <div className={`h-9 w-full rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
      </div>
    </div>
  );

  // --- LOGIC HELPERS ---
  const formatTime = (seconds) => {
    if (seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInteraction = () => {
    if (!bonus && Math.random() < 0.05) {
      const amount = Math.random() > 0.5 ? 20 : 10;
      setBonus(amount);
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    }
  };

  const handleJoinTable = (room) => {
    if (!isConnected || !user?._id) return;

    // Check if the user is already in THIS specific room
    const isParticipant = room.players?.some(p => 
      (p.userId === user._id || p === user._id || p._id === user._id)
    );

    // 1. If I am already in this room, take me to the right screen
    if (isParticipant) {
      navigate(room.status === 'started' ? `/game/${room._id}` : `/select-card/${room._id}`);
      return;
    }

    // 2. If the room has already started and I'm NOT in it, do nothing (Guard)
    if (room.status === 'started') {
      const msg = "This game has already started.";
      if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert(msg);
      return;
    }

    // 3. If I am already playing in a DIFFERENT room, block entry
    const isAlreadyPlayingElsewhere = rooms.some(r => 
      r._id !== room._id && r.players?.some(p => (p.userId === user._id || p === user._id || p._id === user._id))
    );

    if (isAlreadyPlayingElsewhere) {
      const busyMsg = t.alreadyPlaying;
      if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert(busyMsg);
      else alert(busyMsg);
      return; 
    }

    // 4. If everything is clear, join the room
    joinRoomAction(room._id);
    navigate(`/select-card/${room._id}`);
  };

  return (
    <div className={`flex flex-col h-full w-full max-w-xl mx-auto transition-colors duration-500 font-sans antialiased pb-24 ${
      isDark ? 'bg-[#05050a] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      
      <div className="flex flex-col items-center pt-5 px-3">
        {/* Dynamic Title */}
        <h2 className={`text-base font-black text-center mb-6 uppercase tracking-[0.15em] leading-none ${
          isDark ? 'text-white' : 'text-slate-800'
        }`}>
          {t.chooseStake}
        </h2>

        {/* High Contrast Header Row */}
        <div className={`grid grid-cols-4 w-full px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-center ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          <div>{t.stake}</div>
          <div>{t.active}</div>
          <div>{t.possibleWin}</div>
          <div className="text-right pr-4">{t.join}</div>
        </div>

        {/* Modernized Rooms Container */}
        <div className="flex flex-col gap-2.5 w-full overflow-y-auto scrollbar-hide min-h-[450px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2.5 w-full"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => <RoomSkeleton key={i} />)}
              </motion.div>
            ) : (
              <motion.div 
                key="rooms-list"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2.5 w-full"
              >
                {sortedRooms.map((room) => {
                  const isParticipant = room.players?.some(p => (p.userId === user._id || p === user._id || p._id === user._id));
                  const isAlreadyPlayingElsewhere = rooms.some(r => r._id !== room._id && r.players?.some(p => (p.userId === user._id || p === user._id || p._id === user._id)));
                  const realCardCount = Object.keys(room.purchasedCards || {}).length;
                  const displayPrize = realCardCount * room.entryPrice || room.entryPrice * 3; 
                  const isLive = room.status === 'started';
                  const isDisabled = (isLive && !isParticipant) || (isAlreadyPlayingElsewhere && !isParticipant);

                  return (
                    <motion.div 
                      layout
                      key={room._id} 
                      onTapStart={handleInteraction} 
                      className={`grid grid-cols-4 items-center w-full py-3.5 px-2 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                        isDark 
                          ? 'bg-[#0b0c14] border-slate-900/80 shadow-lg shadow-black/20' 
                          : 'bg-white border-slate-200/60 shadow-sm shadow-slate-100'
                      } ${isDisabled ? 'opacity-35 grayscale-[0.4] pointer-events-none' : 'opacity-100'}`}
                    >
                      {/* Active Stake Value */}
                      <div className="text-center font-black text-sm tracking-tight">
                        <span className={isDark ? 'text-slate-100' : 'text-slate-800'}>{room.entryPrice}</span>
                        <span className="text-[9px] font-black opacity-50 ml-1 tracking-wide text-amber-500">ETB</span>
                      </div>

                      {/* Match Countdown Clock Status */}
                      <div className="text-center font-mono font-black text-xs">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-rose-500 bg-rose-500/10 text-[9px] font-black uppercase tracking-wider animate-pulse border border-rose-500/20">
                            <span className="w-1 h-1 rounded-full bg-rose-500" />
                            {t.playing}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-sm tracking-tight tabular-nums font-bold ${
                            room.countdown < 15
                              ? 'text-rose-500 bg-rose-500/5 animate-pulse'
                              : isDark ? 'text-amber-500' : 'text-amber-600'
                          }`}>
                            {formatTime(room.countdown)}
                          </span>
                        )}
                      </div>

                      {/* Calculated Estimated Prize Pot */}
                      <div className="text-center">
                        <div className="inline-flex items-baseline justify-center gap-0.5">
                          <span className="text-sm font-black tabular-nums tracking-tight text-emerald-500">{displayPrize}</span>
                          <span className="text-[8px] font-black uppercase text-emerald-500/70 tracking-wider">ETB</span>
                        </div>
                      </div>

                      {/* Formatted Functional CTA Entry Option */}
                      <div className="px-1">
                        <button 
                          onClick={() => handleJoinTable(room)}
                          className={`w-full h-9 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1 shadow-sm border transition-all active:scale-95 ${
                            isParticipant 
                              ? 'bg-emerald-500 text-white border-emerald-400/20 shadow-emerald-500/10' 
                              : isDisabled 
                                ? 'bg-slate-200 text-slate-400 border-transparent dark:bg-slate-900 dark:text-slate-700 cursor-not-allowed' 
                                : 'bg-amber-500 text-slate-950 border-amber-400/20 hover:bg-amber-400 shadow-amber-500/5'
                          }`}
                        >
                          {isParticipant ? t.rejoin : (isAlreadyPlayingElsewhere ? t.busy : t.join)}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        body { background-color: ${isDark ? '#05050a' : '#f8fafc'}; }
      `}} />
    </div>
  );
};

export default BingoLobby;