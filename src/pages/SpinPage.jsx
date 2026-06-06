// import React, { useReducer, useState, useMemo, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../context/AuthContext';
// import { useLanguage } from '../context/LanguageContext';
// import { useTheme } from '../context/ThemeContext';

// // Import modularized logic
// import { equbReducer, initialState } from '../Bloc/Equb/equbReducer';
// import { useEqubSocket } from '../Bloc/Equb/useEqubSocket';

// // --- SUB-COMPONENT: LIVE COUNTDOWN ---
// const CountdownTimer = ({ expiryTime, status }) => {
//   const [timeLeft, setTimeLeft] = useState("");
//   const { t } = useLanguage();

//   useEffect(() => {
//     // If backend already moved status past 'open', stop the clock
//     if (status !== 'open' && status !== undefined) {
//       setTimeLeft(status === 'drawing' ? "DRAWING..." : "COMPLETED");
//       return;
//     }

//     const tick = () => {
//       const diff = new Date(expiryTime) - new Date();
//       if (diff <= 0) {
//         setTimeLeft("DRAWING...");
//         return;
//       }
//       const m = Math.floor((diff / 1000 / 60) % 60);
//       const s = Math.floor((diff / 1000) % 60);
//       setTimeLeft(`${m}m ${s}s`);
//     };

//     const timer = setInterval(tick, 1000);
//     tick();
//     return () => clearInterval(timer);
//   }, [expiryTime, status, t]);

//   return <span className="font-mono font-bold text-orange-500">{timeLeft}</span>;
// };

// // --- HELPER COMPONENT: SLOT CARD ---
// const SlotCard = ({ number, isTaken, isSelected, isMine, onClick }) => {
//   let colorClass = 'dark:bg-slate-800 bg-white dark:border-white/5 border-slate-200 dark:text-slate-400 text-slate-500 hover:border-orange-500';
//   if (isSelected) colorClass = 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30';
//   else if (isMine) colorClass = 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20';
//   else if (isTaken) colorClass = 'dark:bg-slate-900 bg-slate-200 opacity-40 cursor-not-allowed';

//   return (
//     <motion.button
//       whileTap={!isTaken ? { scale: 0.9 } : {}}
//       onClick={onClick}
//       disabled={isTaken}
//       className={`aspect-square flex items-center justify-center text-xs font-black border rounded-lg transition-all duration-200 ${colorClass}`}
//     >
//       {number}
//     </motion.button>
//   );
// };

// // --- COMPONENT: ROOM VIEW ---
// const RoomGrid = ({ data, socket, dispatch }) => {
//   const { user } = useAuth();
//   const { t } = useLanguage();
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // AUTO-EXIT LOGIC: When room is completed, wait 10s then go back to lobby
//   useEffect(() => {
//     if (data?.status === 'completed') {
//       const timer = setTimeout(() => {
//         dispatch({ type: 'EXIT_ROOM' });
//       }, 10000);
//       return () => clearTimeout(timer);
//     }
//   }, [data?.status, dispatch]);

//   if (!data) return (
//     <div className="flex flex-col items-center justify-center p-20">
//       <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
//       <p className="font-black text-xs uppercase tracking-widest opacity-50">Loading Room...</p>
//     </div>
//   );

//   const participants = data.participants || [];
//   const isFull = participants.length >= data.maxSlots;
//   const isDrawing = data.status === 'drawing' || data.status === 'completed';

//   const mySlots = useMemo(() => participants.filter(p => p.userId === user?._id).map(p => p.slotNumber), [participants, user?._id]);
//   const takenSlots = useMemo(() => participants.map(p => p.slotNumber), [participants]);

//   const handlePurchase = () => {
//     if (!selectedSlot || loading || isFull || isDrawing) return;
//     setLoading(true);
//     socket.emit('buySlot', { equbId: data.id, slotNumber: selectedSlot });
//     socket.once('buySuccess', () => { setLoading(false); setSelectedSlot(null); });
//     socket.once('error', (msg) => { alert(msg); setLoading(false); });
//   };

//   return (
//     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-32 relative">

//       {/* 🏆 WINNER OVERLAY */}
//       <AnimatePresence>
//         {data.status === 'completed' && data.winners && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-orange-500/30"
//           >
//             <h2 className="text-2xl font-black text-orange-500 mb-4 italic">WINNERS!</h2>
//             <div className="space-y-3 w-full max-h-[300px] overflow-y-auto pr-2">
//               {data.winners.map((w, i) => (
//                 <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center">
//                   <span className="font-bold text-slate-400">{w.label}</span>
//                   <span className="font-black text-white">{w.username}</span>
//                   <span className="text-emerald-500 font-bold">{w.prize} ETB</span>
//                 </div>
//               ))}
//             </div>
//             <p className="mt-6 text-[10px] font-bold text-slate-500 animate-pulse uppercase tracking-widest">
//               Starting next round soon...
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <button
//         onClick={() => dispatch({ type: 'EXIT_ROOM' })}
//         className="mb-4 text-[10px] font-black uppercase text-slate-500 flex items-center gap-2"
//       >
//         <span className="text-orange-500 text-lg">←</span> {t.backToLobby}
//       </button>

//       <div className="dark:bg-slate-900 bg-white border dark:border-white/5 border-slate-200 p-4 rounded-xl mb-4 text-center shadow-sm">
//         <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">
//           {isDrawing ? "Status" : isFull ? "Room Status" : "Draw In"}
//         </p>
//         <div className="text-xl font-black">
//           {isDrawing ? (
//             <span className="text-emerald-500 animate-pulse">STARTING DRAW...</span>
//           ) : isFull ? (
//             <span className="text-orange-500 animate-pulse">POOL FULL!</span>
//           ) : (
//             <CountdownTimer expiryTime={data.expiryTime} status={data.status} />
//           )}
//         </div>
//       </div>

//       <div className={`grid grid-cols-5 gap-2 dark:bg-slate-900/40 bg-white p-3 rounded-xl border dark:border-white/5 border-slate-200 shadow-sm transition-opacity ${isDrawing ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
//         {Array.from({ length: data.maxSlots }, (_, i) => i + 1).map(num => (
//           <SlotCard
//             key={num} number={num}
//             isTaken={takenSlots.includes(num)}
//             isMine={mySlots.includes(num)}
//             isSelected={selectedSlot === num}
//             onClick={() => setSelectedSlot(num)}
//           />
//         ))}
//       </div>

//       <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
//         <button
//           disabled={!selectedSlot || loading || isFull || isDrawing}
//           onClick={handlePurchase}
//           className={`w-full py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${selectedSlot && !isDrawing ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
//             }`}
//         >
//           {isDrawing ? "DRAW IN PROGRESS" : loading ? t.processing : isFull ? "ROOM FULL" : selectedSlot ? `${t.confirmSlot} ${selectedSlot}` : t.selectNumber}
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// // --- MAIN PAGE ---
// const EqubPage = () => {
//   const [state, dispatch] = useReducer(equbReducer, initialState);
//   const socket = useEqubSocket(dispatch);
//   const { user } = useAuth();
//   const { t } = useLanguage();
//   const { isDark } = useTheme();


//   const handleJoinRoom = (roomId) => {
//     dispatch({ type: 'SET_LOADING', payload: true });
    
//     // 🛡️ Safety Timeout: If server doesn't respond in 5s, stop loading
//     const timeout = setTimeout(() => {
//       dispatch({ type: 'SET_LOADING', payload: false });
//       alert("Connection timeout. Please try again.");
//     }, 5000);

//     socket.emit('joinRoom', roomId);

//     socket.once('initialStatus', (data) => {
//       clearTimeout(timeout);
//       dispatch({ type: 'ENTER_ROOM', payload: data });
//     });

//     socket.once('error', (err) => {
//       clearTimeout(timeout);
//       dispatch({ type: 'SET_LOADING', payload: false });
//       alert(err);
//     });
//   };

//   return (
//     <div className={`min-h-screen ${isDark ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'} p-4 transition-colors duration-500`}>
//       <div className="max-w-md mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-xl font-black italic tracking-tighter">FISH<span className="text-orange-500">LOTTO</span></h1>
//           <div className="bg-white dark:bg-slate-900 border dark:border-white/5 border-slate-200 rounded-xl px-4 py-1.5 shadow-sm">
//             <p className="text-[7px] font-black text-slate-500 uppercase">{t.balance}</p>
//             <span className="text-sm font-black text-emerald-500">{user?.equbBalance || 0} ETB</span>
//           </div>
//         </header>

//         <AnimatePresence mode="popLayout">
//           {state.view === 'LIST' ? (
//             <motion.div
//               key="lobby"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="space-y-3"
//             >
//               {state.loading ?(
//                 <div className="text-center py-20 flex flex-col items-center">
//                   <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
//                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
//                     Syncing with Lobby...
//                   </p>
//                   {/* Add a manual retry button just in case */}
//                   <button
//                     onClick={() => socket.emit('getInitialStatus')}
//                     className="mt-6 text-[8px] opacity-30 uppercase font-bold hover:opacity-100 transition-opacity"
//                   >
//                     Refresh Lobby
//                   </button>
//                 </div>
//               )
//                 : (
//                   state.rooms.map(room => (
//                     <motion.div
//                       key={room.id}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => handleJoinRoom(room.id)}
//                       className="bg-white dark:bg-slate-900 border dark:border-white/5 border-slate-200 p-4 rounded-xl shadow-sm cursor-pointer"
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="text-orange-500 text-[9px] font-bold uppercase tracking-widest">{room.stakeValue} ETB {t.stake}</p>
//                           <h2 className="text-md font-black">Win {Math.floor(room.maxSlots * room.stakeValue * 0.7)} ETB</h2>
//                           <div className="mt-2 text-[10px] flex items-center gap-1.5">
//                             <span className="text-slate-400 uppercase font-bold text-[8px]">Ends:</span>
//                             <CountdownTimer expiryTime={room.expiryTime} status={room.status} />
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-xs font-black">{room.participantCount}/{room.maxSlots}</p>
//                           <div className="w-16 h-1.5 dark:bg-slate-800 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
//                             <motion.div
//                               initial={{ width: 0 }}
//                               animate={{ width: `${(room.participantCount / room.maxSlots) * 100}%` }}
//                               className="h-full bg-orange-500"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))
//                 )}
//             </motion.div>
//           ) : (
//             <RoomGrid
//               key="room"
//               data={state.selectedRoom}
//               socket={socket}
//               dispatch={dispatch}
//             />
//           )}
//           {/* --- 🏆 WINNER RULES & INTERACTIVE NOTIFICATIONS --- */}
//           <div className="mt-10 p-6 border-t border-slate-200 dark:border-white/5 bg-slate-500/5 rounded-t-3xl">

//             {/* Prize Distribution Grid */}
//             <div className="grid grid-cols-3 gap-3 text-center mb-6">
//               <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-500 shadow-lg shadow-orange-500/10">
//                 <p className="text-orange-500 font-black text-xs mb-1">🥇 1st</p>
//                 <p className="text-[12px] font-black">50%</p>
//                 <p className="text-[8px] opacity-50 font-bold uppercase">የመጀመሪያ</p>
//               </div>
//               <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border dark:border-white/5 shadow-sm">
//                 <p className="text-slate-400 font-black text-xs mb-1">🥈 2nd</p>
//                 <p className="text-[10px] font-black">20%</p>
//                 <p className="text-[8px] opacity-50 font-bold uppercase">ሁለተኛ</p>
//               </div>
//               <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border dark:border-white/5 shadow-sm">
//                 <p className="text-orange-800 font-black text-xs mb-1">🥉 3rd</p>
//                 <p className="text-[10px] font-black">10%</p>
//                 <p className="text-[8px] opacity-50 font-bold uppercase">ሶስተኛ</p>
//               </div>
//             </div>

//             {/* NEW: DRAW CONDITIONS SECTION */}
//             <div className="mb-6 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20">
//               <h5 className="text-[10px] font-black uppercase text-orange-600 mb-3 flex items-center gap-2">
//                 <span className="text-sm">⚙️</span> Draw Rules / የእጣ አወጣጥ ደንቦች
//               </h5>

//               <div className="space-y-4">
//                 {/* Condition 1: Sold Out */}
//                 <div className="flex gap-3">
//                   <div className="text-[10px] font-black bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</div>
//                   <div>
//                     <p className="text-[10px] font-black leading-tight uppercase">Instant Sell-Out Draw</p>
//                     <p className="text-[10px] opacity-80 leading-tight mt-1">
//                       If all slots (100/100) are sold, the draw happens <b>immediately</b>!
//                       <br />
//                       <span className="text-slate-500 italic">ሁሉም ካርዶች (100/100) ሲሸጡ እጣው ወዲያውኑ ይወጣል።</span>
//                     </p>
//                   </div>
//                 </div>

//                 {/* Condition 2: Deadline */}
//                 <div className="flex gap-3">
//                   <div className="text-[10px] font-black bg-slate-500 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</div>
//                   <div>
//                     <p className="text-[10px] font-black leading-tight uppercase">Deadline Draw</p>
//                     <p className="text-[10px] opacity-80 leading-tight mt-1">
//                       If the time runs out, the draw happens <b>automatically</b> regardless of cards sold.
//                       <br />
//                       <span className="text-slate-500 italic font-medium">ምሳሌ፡ 40/100 ካርድ ብቻ ቢሸጥም ጊዜው ካለቀ እጣው ወዲያውኑ ይወጣል።</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Interactive System Info */}
//             <div className="space-y-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-dashed border-slate-300 dark:border-white/10">

//               {/* Win Notification Info */}
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
//                   <span className="text-sm">🔔</span>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-black leading-tight uppercase text-emerald-600">
//                     Instant Win Notification
//                   </p>
//                   <p className="text-[10px] font-medium opacity-80 leading-tight">
//                     Balance updates immediately after the draw!
//                     <br />
//                     <span className="text-slate-500 italic">አሸናፊ ከሆኑ ሂሳብዎ ወዲያውኑ ይዘመናል።</span>
//                   </p>
//                 </div>
//               </div>

//               {/* Live Status */}
//               <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/5">
//                 <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping"></span>
//                 <p className="text-[9px] font-black uppercase tracking-wider opacity-60">
//                   Live Status Sync • በቀጥታ እየተከታተሉ ነው
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.2em]">
//                 Fish Lotto • 2026 Edition
//               </p>
//             </div>
//           </div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default EqubPage;