// import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// // --- Animated Particle for the "Surprise" Effect ---
// const Particle = ({ delay, color }) => (
//   <motion.div
//     initial={{ scale: 0, opacity: 0, y: 0 }}
//     animate={{ 
//       scale: [0, 1.2, 0], 
//       opacity: [0, 1, 0],
//       y: -100,
//       x: (Math.random() - 0.5) * 200 
//     }}
//     transition={{ duration: 2, repeat: Infinity, delay }}
//     className={`absolute w-2 h-2 rounded-full ${color} blur-[1px]`}
//   />
// );

// export const LoadingSpinner = ({ isDark }) => (
//   <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 
//     ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
//     <motion.div 
//       animate={{ rotate: 360 }}
//       transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//       className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mb-4" 
//     />
//     <p className={`font-black uppercase tracking-widest text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
//       Syncing Ocean Data...
//     </p>
//   </div>
// );

// export const ErrorToast = ({ message }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: -50, scale: 0.9 }}
//     animate={{ opacity: 1, y: 0, scale: 1 }}
//     exit={{ opacity: 0, scale: 0.9 }}
//     className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] font-black text-xs uppercase tracking-widest flex items-center gap-3 border border-white/20"
//   >
//     <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>⚠️</motion.span> {message}
//   </motion.div>
// );


// export const WinnerModal = ({ data, onBack, userId }) => {
//   // console.log("WINNER_DAT",data);
//   const currentUserId = String(userId || "").trim();
//   const winnerId = String(data?.winnerId || "").trim();
//   const isWinner = currentUserId && currentUserId === winnerId;

//   const isNoWinner =
//     !data?.winnerId ||
//     data?.winnerName === "No Winner" ||
//     data?.winnerName === "No One";

//   const pattern = data?.pattern || {};
//   const cardId = pattern?.cardId || "N/A";
//   const patternName = pattern?.patternName || null;
//   const patternCells = pattern?.patternCells || [];
//   const patternNumbers = pattern?.patternNumbers || [];

//   // --- Animations ---
//   const containerVariants = {
//     hidden: { scale: 0.7, opacity: 0 },
//     visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300 } },
//   };
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1 },
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
//     >
//       {isWinner && (
//         <div className="absolute inset-0 pointer-events-none">
//           {[...Array(15)].map((_, i) => (
//             <Particle key={i} delay={i * 0.1} color={i % 2 === 0 ? "bg-orange-500" : "bg-yellow-400"} />
//           ))}
//         </div>
//       )}

//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className={`relative bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center border
//           ${isWinner ? "border-orange-500/40 shadow-[0_0_40px_rgba(255,165,0,0.3)]" : "border-white/10"}`}
//       >
//         <motion.div variants={itemVariants} className="text-6xl mb-2">
//           {isWinner ? "🏆" : isNoWinner ? "⏲️" : "💔"}
//         </motion.div>

//         <motion.h2
//           variants={itemVariants}
//           className={`text-2xl font-black mb-2 uppercase ${isWinner ? "text-yellow-400" : "text-slate-400"}`}
//         >
//           {isWinner ? "JACKPOT!" : isNoWinner ? "NO WINNER" : "YOU LOST"}
//         </motion.h2>

//         {!isNoWinner && (
//           <motion.p variants={itemVariants} className="text-orange-400 font-black mb-1">
//             {data?.winnerName}
//           </motion.p>
//         )}

//         {!isNoWinner && (
//           <motion.p variants={itemVariants} className="text-slate-400 text-xs mb-3">
//             Card: {cardId}
//           </motion.p>
//         )}

//         {patternName && !isNoWinner && (
//           <motion.div variants={itemVariants} className="mb-3">
//             <span className="px-4 py-1 text-xs font-black uppercase tracking-widest bg-white/10 border border-orange-500/20 rounded-full text-orange-400">
//               {patternName}
//             </span>
//           </motion.div>
//         )}

//         {/* Winning numbers with proper cell ID */}
//         {patternNumbers.length > 0 && (
//           <motion.div variants={itemVariants} className="grid grid-cols-5 gap-2 mb-4 justify-center">
//             {patternNumbers.map((num, i) => {
//               const cell = patternCells[i] || "?";
//               return (
//                 <motion.div
//                   key={i}
//                   className={`w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer
//                     ${num !== null ? "bg-yellow-400 text-black shadow-lg" : "bg-orange-500 text-black"}`}
//                   title={cell}
//                 >
//                   {num === 0 ? "★" : num}
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}

//         <motion.div variants={itemVariants} className="py-4 mb-4 border rounded-2xl bg-white/5 border-orange-500/20">
//           <span className="block text-xs uppercase font-black mb-1 text-slate-400 tracking-widest">Prize</span>
//           <p className={`text-3xl font-black ${isWinner ? "text-yellow-400" : "text-slate-400"}`}>
//             {data?.prize || 0} <span className="text-sm opacity-50">ETB</span>
//           </p>
//         </motion.div>

//         <motion.button
//           variants={itemVariants}
//           onClick={onBack}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className={`w-full py-3 rounded-2xl font-black uppercase tracking-widest
//             ${isWinner ? "bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg" : "bg-slate-800 hover:bg-slate-700"}`}
//         >
//           Back
//         </motion.button>
//       </motion.div>
//     </motion.div>
//   );
// };


import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Animated Particle for the "Surprise" Effect ---
const Particle = ({ delay, color }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, y: 0 }}
    animate={{ 
      scale: [0, 1.2, 0], 
      opacity: [0, 1, 0],
      y: -100,
      x: (Math.random() - 0.5) * 200 
    }}
    transition={{ duration: 2, repeat: Infinity, delay }}
    className={`absolute w-2 h-2 rounded-full ${color} blur-[1px]`}
  />
);

export const LoadingSpinner = ({ isDark }) => (
  <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 
    ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mb-4" 
    />
    <p className={`font-black uppercase tracking-widest text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
      Syncing Viva Protocols...
    </p>
  </div>
);

export const ErrorToast = ({ message }) => (
  <motion.div 
    initial={{ opacity: 0, y: -50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] font-black text-xs uppercase tracking-widest flex items-center gap-3 border border-white/20"
  >
    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }}>⚠️</motion.span> {message}
  </motion.div>
);


export const WinnerModal = ({ data, onBack, userId }) => {
  // console.log("WINNER_DAT",data);
  const currentUserId = String(userId || "").trim();
  const winnerId = String(data?.winnerId || "").trim();
  const isWinner = currentUserId && currentUserId === winnerId;

  const isNoWinner =
    !data?.winnerId ||
    data?.winnerName === "No Winner" ||
    data?.winnerName === "No One";

  const pattern = data?.pattern || {};
  const cardId = pattern?.cardId || "N/A";
  const patternName = pattern?.patternName || null;
  const patternCells = pattern?.patternCells || [];
  const patternNumbers = pattern?.patternNumbers || [];

  // --- Animations ---
  const containerVariants = {
    hidden: { scale: 0.7, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      {isWinner && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Particle key={i} delay={i * 0.1} color={i % 2 === 0 ? "bg-amber-500" : "bg-yellow-400"} />
          ))}
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative bg-slate-900 rounded-3xl p-6 max-w-sm w-full text-center border
          ${isWinner ? "border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.3)]" : "border-white/10"}`}
      >
        <motion.div variants={itemVariants} className="text-6xl mb-2">
          {isWinner ? "🏆" : isNoWinner ? "⏲️" : "💔"}
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className={`text-2xl font-black mb-2 uppercase tracking-tight ${isWinner ? "text-yellow-400" : "text-slate-400"}`}
        >
          {isWinner ? "JACKPOT!" : isNoWinner ? "NO WINNER" : "YOU LOST"}
        </motion.h2>

        {!isNoWinner && (
          <motion.p variants={itemVariants} className="text-amber-400 font-black mb-1 uppercase text-sm tracking-wide">
            {data?.winnerName}
          </motion.p>
        )}

        {!isNoWinner && (
          <motion.p variants={itemVariants} className="text-slate-400 text-xs mb-3">
            Card: {cardId}
          </motion.p>
        )}

        {patternName && !isNoWinner && (
          <motion.div variants={itemVariants} className="mb-3">
            <span className="px-4 py-1 text-xs font-black uppercase tracking-widest bg-white/10 border border-amber-500/20 rounded-full text-amber-400">
              {patternName}
            </span>
          </motion.div>
        )}

        {/* Winning numbers with proper cell ID */}
        {patternNumbers.length > 0 && (
          <motion.div variants={itemVariants} className="grid grid-cols-5 gap-2 mb-4 justify-center">
            {patternNumbers.map((num, i) => {
              const cell = patternCells[i] || "?";
              return (
                <motion.div
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer
                    ${num !== null ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/10" : "bg-amber-500 text-slate-950"}`}
                  title={cell}
                >
                  {num === 0 ? "★" : num}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="py-4 mb-4 border rounded-2xl bg-white/5 border-amber-500/20">
          <span className="block text-xs uppercase font-black mb-1 text-slate-400 tracking-widest">Prize</span>
          <p className={`text-3xl font-black tabular-nums ${isWinner ? "text-yellow-400" : "text-slate-400"}`}>
            {data?.prize || 0} <span className="text-sm opacity-50 font-sans">ETB</span>
          </p>
        </motion.div>

        <motion.button
          variants={itemVariants}
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-xs
            ${isWinner ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/10" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
        >
          Back
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
