import React from 'react';

const PromoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md transition-opacity duration-300">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#FFD700] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white/30 animate-in zoom-in duration-300 scrollbar-hide">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/10 rounded-full text-black hover:bg-black/20 transition-colors"
        >
          ✕
        </button>

        <div className="p-8 flex flex-col items-center text-center text-[#1a1a1a]">
          <h2 className="text-4xl font-black mb-1 leading-none">በቀን 30ሺ</h2>
          
          <div className="flex items-center gap-4 my-6">
             <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl">🎰</div>
             <div className="flex flex-col items-start leading-none">
                <div className="flex items-center gap-1.5">
                   <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">C</div>
                   <span className="font-black text-2xl italic tracking-tighter text-blue-900">ፊሽ ቢንጎ</span>
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-800 ml-1">GAMES</span>
             </div>
             <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl">🎱</div>
          </div>

          <p className="font-black text-lg mb-8 leading-tight">የቀን 30ሺ ብር ቦነስ ይጫወቱ ይሸለሙ</p>

          <div className="grid grid-cols-2 gap-4 w-full text-left font-black mb-8 border-y border-black/10 py-6">
            <div className="space-y-1.5">
              <h3 className="text-[9px] uppercase opacity-60 mb-1 leading-none">በ100 ብር ያለው</h3>
              <p className="text-xs">1ኛ እጣ 8000 ብር</p>
              <p className="text-xs">2ኛ እጣ 4000 ብር</p>
              <p className="text-xs">3ኛ እጣ 2000 ብር</p>
              <p className="text-[10px] italic">...እስከ 10ኛ እጣ</p>
            </div>
            <div className="space-y-1.5 border-l border-black/10 pl-4">
              <h3 className="text-[9px] uppercase opacity-60 mb-1 leading-none">በ10 ብር ያለው</h3>
              <p className="text-xs">1ኛ እጣ 4000 ብር</p>
              <p className="text-xs">2ኛ እጣ 2000 ብር</p>
              <p className="text-xs">3ኛ እጣ 1000 ብር</p>
              <p className="text-[10px] italic">...እስከ 10ኛ እጣ</p>
            </div>
          </div>

          <div className="w-full text-left space-y-3 mb-8 px-2 font-bold text-[11px]">
            <div className="flex items-center gap-3"><span className="text-blue-900">•</span> 1 ጨዋታ = 1 ነጥብ</div>
            <div className="flex items-center gap-3"><span className="text-blue-900">•</span> ተጫውተው ብቻ ይሸለሙ</div>
            <div className="flex items-center gap-3"><span className="text-blue-900">•</span> ለመከታተል <span className="text-blue-700 underline underline-offset-2">Leaderboard</span> ይግቡ</div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-blue-900 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all uppercase tracking-widest"
          >
            አሁን ይጫወቱ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoModal; // THIS LINE IS KEY