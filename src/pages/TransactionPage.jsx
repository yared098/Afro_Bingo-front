import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Wallet, 
  Search,
  ReceiptText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const TransactionPage = () => {
  const { user, api } = useAuth();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Ensure backend uses .populate('roomId', 'name')
      const res = await api.get(`/transactions/user/${user._id}`);
      setTransactions(res.data); // Removed .reverse() because backend already does sort({createdAt: -1})
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchTransactions();
  }, [user?._id]);

  const filteredTxs = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-black text-[10px] tracking-[0.2em] uppercase">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-2 py-4 sm:py-8 space-y-8">
      {/* Viva BINGO BRANDED HEADER */}
      <div className="flex flex-col gap-1 px-2">
        <div className="flex items-center gap-2">
            <ReceiptText className="text-amber-500" size={20} />
            <h2 className="text-2xl font-black uppercase tracking-tight leading-none">
              {t.transactions?.split(' ')[0] || 'My'} <span className="text-amber-500">{t.transactions?.split(' ').slice(1).join(' ') || 'Transactions'}</span>
            </h2>
        </div>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Financial History & Protocols</p>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
        {['all', 'win', 'lose', 'purchase'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 border whitespace-nowrap
              ${filter === type 
                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/10' 
                : isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white' 
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm'}`}
          >
            {type === 'all' ? t.all || 'All' : type}
          </button>
        ))}
      </div>

      {/* TRANSACTION CARD LIST CONTAINER */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTxs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`py-20 text-center border-2 border-dashed rounded-[2.5rem] ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-100 bg-white/5'}`}
            >
              <div className="w-16 h-16 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-500" size={24} />
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No Activity Records</p>
            </motion.div>
          ) : (
            filteredTxs.map((tx, idx) => (
              <TransactionCard key={tx._id} tx={tx} index={idx} isDark={isDark} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TransactionCard = ({ tx, index, isDark }) => {
  const isPositive = tx.type === 'win' || tx.type === 'win_reward' || tx.type === 'purchase' || tx.type === 'deposit';
  const displayTitle = tx.roomId?.name || tx.reason || "System Protocol";
  
  const styleMap = {
    win: { 
      bg: 'bg-emerald-500/10', 
      iconColor: 'text-emerald-500', 
      borderColor: 'border-emerald-500/20',
      glyph: <ArrowDownLeft size={18} />
    },
    lose: { 
      bg: 'bg-rose-500/10', 
      iconColor: 'text-rose-500', 
      borderColor: 'border-rose-500/20',
      glyph: <ArrowUpRight size={18} />
    },
    purchase: { 
      bg: 'bg-amber-500/10', 
      iconColor: 'text-amber-500', 
      borderColor: 'border-amber-500/20',
      glyph: <Wallet size={18} />
    }
  };

  const style = styleMap[tx.type] || { 
    bg: 'bg-slate-500/10', 
    iconColor: 'text-slate-500', 
    borderColor: 'border-slate-500/20',
    glyph: <History size={18} />
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group border rounded-[1.75rem] p-4 flex items-center gap-4 transition-all duration-200 ${
        isDark 
        ? 'bg-slate-900/40 border-slate-900 hover:border-slate-800' 
        : 'bg-white border-slate-200 hover:border-amber-200 shadow-sm'
      }`}
    >
      {/* Visual Indicator Icon */}
      <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center border ${style.bg} ${style.iconColor} ${style.borderColor}`}>
        {style.glyph}
      </div>

      {/* Info Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <div className="flex flex-col min-w-0">
            <h4 className="font-black text-[11px] uppercase tracking-tight truncate pr-2">
              🎯 {displayTitle}
            </h4>
            {/* Show Transaction ID as sub-text */}
            <span className="text-[7px] font-mono text-slate-500 truncate uppercase mt-0.5">
              ID: {tx.transactionId}
            </span>
          </div>

          <div className={`font-black text-xs tabular-nums whitespace-nowrap ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '+' : '-'} {tx.amount?.toLocaleString()} <span className="text-[9px] opacity-70">ETB</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 font-bold">
              {new Date(tx.createdAt).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </span>
          </div>
          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border ${style.bg} ${style.iconColor} ${style.borderColor}`}>
            {tx.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionPage;