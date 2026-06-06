
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useBingoBloc } from '../Bloc/Bingo/useBingoBloc';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner, ErrorToast, WinnerModal } from '../components/BingoGameElements';

const BingoGame = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [language, setLanguage] = useState(() => localStorage.getItem('bingo_lang') || 'sounds');

    const [isMuted, setIsMuted] = useState(() => localStorage.getItem('bingo_muted') === 'true');
    const audioMap = useRef({});

    useEffect(() => {
        for (let num = 1; num <= 75; num++) {
            const letter = num <= 15 ? 'b' : num <= 30 ? 'i' : num <= 45 ? 'n' : num <= 60 ? 'g' : 'o';
            const key = `${letter}${num}`;
            const audio = new Audio(`/assets/sounds/${key}.ogg`);
            audio.load();
            audioMap.current[key] = audio;
        }
    }, []);
    // Update the Audio Preload Effect
    useEffect(() => {
        // Clear old audio if language changes
        audioMap.current = {};

        for (let num = 1; num <= 75; num++) {
            const letter = num <= 15 ? 'b' : num <= 30 ? 'i' : num <= 45 ? 'n' : num <= 60 ? 'g' : 'o';
            let fileName = "";
            let extension = "mp3";

            // Handle your specific naming conventions from your ls output
            switch (language) {
                case 'amaharic':
                    fileName = `${letter.toUpperCase()}${num}`; // B1, I16...
                    break;
                case 'oromo':
                    fileName = `or${letter}${num}`; // orb1, ori16...
                    break;
                case 'tigregna':
                    fileName = `t${letter}${num}`; // tb1, ti16...
                    break;
                case 'fimale':
                    fileName = `s${letter}${num}`; // sb1, si16...
                    extension = "m4a";
                    break;
                default:
                    fileName = `${letter}${num}`; // b1, i16 (default)
                    extension = "ogg";
            }

            const audio = new Audio(`/assets/${language}/${fileName}.${extension}`);
            audio.load();
            audioMap.current[`${letter}${num}`] = audio;
        }
    }, [language]); // Reload when language changes

    const getLetter = (num) => {
        if (!num) return '';
        if (num <= 15) return 'B';
        if (num <= 30) return 'I';
        if (num <= 45) return 'N';
        if (num <= 60) return 'G';
        return 'O';
    };

    const toggleMute = () => {
        setIsMuted(prev => {
            const newState = !prev;
            localStorage.setItem('bingo_muted', newState);
            return newState;
        });
    };

    // const playBallSound = (num) => {
    //     if (!num || isMuted) return;
    //     const letter = getLetter(num).toLowerCase();
    //     const key = `${letter}${num}`;
    //     const audio = audioMap.current[key];
    //     if (audio) {
    //         audio.currentTime = 0;
    //         audio.play().catch(() => { });
    //     }
    // };
    const playBallSound = (num) => {
        if (!num || isMuted) return;
        const letter = getLetter(num).toLowerCase();
        const key = `${letter}${num}`;
        const audio = audioMap.current[key];
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch((e) => console.error("Audio play failed", e));
        }
    };

    const { state, claimBingo, setActiveCard } = useBingoBloc(roomId, user?._id, playBallSound);
    // Inside BingoGame.jsx
    useEffect(() => {
        if (state.errorMessage === 'Room reset: No players joined.') {
            // Give them a moment to read the message, then kick to lobby
            const timer = setTimeout(() => navigate('/'), 2500);
            return () => clearTimeout(timer);
        }
    }, [state.errorMessage, navigate]);
    // Get currently active card data
    const activeCard = state.cards[state.activeCardIndex];
    const hasCards = state.cards && state.cards.length > 0;

    const gridLayout = useMemo(() => [
        ['b1', 'i1', 'n1', 'g1', 'o1'], ['b2', 'i2', 'n2', 'g2', 'o2'],
        ['b3', 'i3', 'n3', 'g3', 'o3'], ['b4', 'i4', 'n4', 'g4', 'o4'],
        ['b5', 'i5', 'n5', 'g5', 'o5'],
    ], []);

    const handleExit = () => {
        navigate('/', { replace: true });
    };

    if (state.loading) return <LoadingSpinner isDark={isDark} />;

    return (
        <div className={`fixed inset-0 flex flex-col transition-colors duration-500 overflow-hidden
            ${isDark ? 'bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>

            <AnimatePresence>
                {state.errorMessage && <ErrorToast message={state.errorMessage} />}
            </AnimatePresence>

            {/*  */}
            <header className={`p-4 border-b flex flex-col gap-4 shrink-0 shadow-sm transition-colors duration-300
    ${isDark ? 'bg-slate-900/80 border-white/5 backdrop-blur-md' : 'bg-white border-slate-200'}`}>

    {/* TOP ROW: Navigation, Logo, and Controls */}
    <div className="flex justify-between items-center">
        {/* Exit Button */}
        <button 
            onClick={handleExit} 
            className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all active:scale-90 
                ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-900 border border-slate-200'}`}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
        </button>

        {/* Brand Logo */}
        {/* Brand Logo */}
        <div className="flex flex-col select-none">
        <h1 className="text-2xl font-black italic tracking-tighter leading-none">
            AFRO<span className="text-orange-500">BINGO</span>
        </h1>
        <span className="text-[7px] font-bold text-slate-500 tracking-[0.35em] mt-1">
            HABESHA ENGINE V3
        </span>
        </div>

        {/* Settings Group: Language + Mute */}
        <div className="flex gap-2 items-center">
            <div className="relative">
                <select
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        localStorage.setItem('bingo_lang', e.target.value);
                    }}
                    className={`pl-3 pr-8 py-2.5 rounded-2xl border appearance-none cursor-pointer text-[11px] font-black uppercase transition-all
                        ${isDark 
                            ? 'bg-slate-800 border-white/10 text-white hover:bg-slate-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:shadow-sm'}`}
                >
                    <option value="sounds">English</option>
                    <option value="amaharic">አማርኛ</option>
                    <option value="oromo">Oromoo</option>
                    <option value="tigregna">ትግርኛ</option>
                    <option value="fimale">Female (EN)</option>
                </select>
                {/* Custom Chevron for Select */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>

            <button 
                onClick={toggleMute} 
                className={`w-11 h-11 flex items-center justify-center rounded-2xl border transition-all active:scale-95
                    ${isDark 
                        ? 'border-white/10 bg-slate-800 text-white' 
                        : 'border-slate-200 bg-slate-50 text-slate-900'}`}
            >
                <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
            </button>
        </div>
    </div>

    {/* MIDDLE ROW: Multi-Card Tabs */}
    {hasCards && state.cards.length > 1 && (
        <div className="flex gap-2 px-1 overflow-x-auto pb-1 scrollbar-hide">
            {state.cards.map((c, idx) => (
                <button
                    key={c.cardId || idx}
                    onClick={() => setActiveCard(idx)}
                    className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-all whitespace-nowrap flex items-center gap-2
                        ${state.activeCardIndex === idx
                            ? 'bg-orange-500 text-white shadow-lg scale-105'
                            : isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 border border-slate-100'}`}
                >
                    <span className="opacity-70">Card</span> #{idx + 1}
                </button>
            ))}
        </div>
    )}

    {/* BOTTOM ROW: Current Ball Display and Bingo Button */}
    <div className={`flex items-center justify-between p-3 rounded-3xl border shadow-inner
        ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg border-b-4 border-orange-800">
                {getLetter(state.lastNumber) || '?'}
            </div>
            <div>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Current Ball</p>
                <p className="text-2xl font-black tabular-nums tracking-tight">
                    {state.lastNumber ? `${getLetter(state.lastNumber)}-${state.lastNumber}` : '--'}
                </p>
            </div>
        </div>

        {hasCards && (
            <button
                onClick={claimBingo}
                className="bg-red-600 hover:bg-red-500 active:scale-95 px-8 py-3.5 rounded-2xl font-black text-sm text-white shadow-[0_4px_20px_rgba(220,38,38,0.3)] transition-all uppercase italic tracking-tighter"
            >
                Bingo!
            </button>
        )}
    </div>
</header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* BINGO GRID SECTION */}
                    <div className="lg:col-span-5 flex flex-col items-center">
                        {hasCards ? (
                            <div className={`p-6 rounded-[2.5rem] border shadow-2xl relative w-full max-w-sm
                                ${isDark ? 'bg-slate-900/80 border-white/5' : 'bg-white border-slate-200'}`}>

                                {/* Viewing Badge */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-md">
                                    Card #{state.activeCardIndex + 1}
                                </div>

                                <div className="grid grid-cols-5 gap-2 mb-4 text-center font-black text-2xl italic">
                                    {['B', 'I', 'N', 'G', 'O'].map((l, i) => (
                                        <div key={l} className={['text-blue-500', 'text-red-500', 'text-purple-500', 'text-green-500', 'text-orange-500'][i]}>{l}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {gridLayout.flat().map((key) => {
                                        const val = activeCard[key];
                                        const isMarked = state.drawnNumbers.includes(val) || val === 0;
                                        const isRecent = val === state.lastNumber && val !== 0;
                                        return (
                                            <div key={key} className={`aspect-square flex items-center justify-center rounded-2xl text-xl font-black transition-all border
                                                ${isMarked ? 'bg-orange-500 text-white border-orange-400' : isDark ? 'bg-black/20 text-slate-500 border-white/5' : 'bg-slate-50 text-slate-400 border-slate-100'}
                                                ${isRecent ? 'ring-4 ring-orange-400 animate-pulse scale-105 z-10' : ''}`}>
                                                {val === 0 ? '⚓' : val}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className={`p-10 rounded-[2.5rem] border text-center w-full max-w-sm ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
                                <span className="text-4xl mb-4 block">👀</span>
                                <h3 className="font-black uppercase text-orange-500 tracking-tighter">Spectator Mode</h3>
                                <p className="text-xs text-slate-500 mt-2 font-bold uppercase leading-relaxed">
                                    You didn't purchase a card for this round.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* BOARD HISTORY SECTION */}
                    <div className="lg:col-span-7">
                        <div className={`rounded-[2rem] p-6 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
                            <h3 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Game Board</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'B', range: [1, 15], color: 'text-blue-500' },
                                    { label: 'I', range: [16, 30], color: 'text-red-500' },
                                    { label: 'N', range: [31, 45], color: 'text-purple-500' },
                                    { label: 'G', range: [46, 60], color: 'text-green-500' },
                                    { label: 'O', range: [61, 75], color: 'text-orange-500' },
                                ].map((row) => (
                                    <div key={row.label} className={`flex items-center gap-2 p-2 rounded-xl ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
                                        <span className={`w-4 font-black text-sm ${row.color}`}>{row.label}</span>
                                        <div className="flex flex-wrap gap-1">
                                            {Array.from({ length: 15 }, (_, i) => row.range[0] + i).map(n => (
                                                <div key={n} className={`w-7 h-7 text-[10px] flex items-center justify-center rounded-md font-bold
                                                    ${state.drawnNumbers.includes(n) ? 'bg-orange-500 text-white' : isDark ? 'bg-white/5 text-slate-700' : 'bg-white text-slate-300 border'}`}>
                                                    {n}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {state.winnerModal.show && (
                    <WinnerModal data={state.winnerModal} userId={user?._id} onBack={() => navigate('/')} />
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
};

export default BingoGame;
