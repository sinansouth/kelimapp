import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Crown, User, Filter, WifiOff, RefreshCw } from 'lucide-react';
import { getLeaderboard, LeaderboardEntry } from '../services/firebase';
import { AVATARS, FRAMES, BACKGROUNDS } from '../data/assets';

interface LeaderboardModalProps {
  onClose: () => void;
  currentUserXP: number;
  currentUserGrade: string;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose, currentUserXP, currentUserGrade }) => {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | string>('ALL'); // 'ALL' or grade
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    // If offline, don't try to fetch, just stop loading
    if (!navigator.onLine) {
        setIsOffline(true);
        setLoading(false);
        return;
    }

    setIsOffline(false);
    // Don't set loading to true on background refreshes to avoid flickering
    if (users.length === 0) setLoading(true);
    
    const data = await getLeaderboard(filter);
    setUsers(data);
    setLoading(false);
    setLastUpdated(new Date());
  };

  // Initial Fetch and Grade Filter Change
  useEffect(() => {
    setLoading(true); // Show spinner on filter change
    fetchData();
  }, [filter]);

  // Auto-Refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        fetchData();
    }, 60000); // 60 seconds

    // Network Status Listeners
    const handleOnline = () => { setIsOffline(false); fetchData(); };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        clearInterval(interval);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [filter]); // Re-bind if filter changes to ensure refresh uses correct filter

  const getRankIcon = (index: number) => {
      switch(index) {
          case 0: return <Crown size={24} className="text-yellow-500 fill-yellow-500" />;
          case 1: return <Medal size={22} className="text-slate-400 fill-slate-300" />;
          case 2: return <Medal size={22} className="text-orange-500 fill-orange-400" />;
          default: return <span className="font-bold text-sm w-6 text-center" style={{color: 'inherit'}}>{index + 1}</span>;
      }
  };

  const getThemeStyles = (theme?: string) => {
    // Default fallbacks
    let bg = '#ffffff';
    let text = '#1e293b';
    let border = '#e2e8f0';
    let font = "'Inter', sans-serif";
    
    switch (theme) {
        case 'light': bg = '#ffffff'; text = '#0f172a'; border = '#e2e8f0'; font = "'Inter', sans-serif"; break;
        case 'neon': bg = '#000000'; text = '#33ff00'; border = '#33ff00'; font = "'Inter', sans-serif"; break;
        case 'ocean': bg = '#075985'; text = '#e0f2fe'; border = '#0369a1'; font = "'Inter', sans-serif"; break;
        case 'sunset': bg = '#7c2d12'; text = '#ffedd5'; border = '#9a3412'; font = "'Inter', sans-serif"; break;
        case 'forest': bg = '#14532d'; text = '#dcfce7'; border = '#15803d'; font = "'Inter', sans-serif"; break;
        case 'royal': bg = '#4338ca'; text = '#fef3c7'; border = '#fbbf24'; font = "'Playfair Display', serif"; break;
        case 'candy': bg = '#9d174d'; text = '#fce7f3'; border = '#be185d'; font = "'Fredoka', sans-serif"; break;
        case 'cyberpunk': bg = '#27272a'; text = '#facc15'; border = '#facc15'; font = "'Orbitron', sans-serif"; break;
        case 'coffee': bg = '#4e342e'; text = '#d7ccc8'; border = '#6d4c41'; font = "'Inter', sans-serif"; break;
        case 'galaxy': bg = '#1e1b4b'; text = '#e9d5ff'; border = '#6b21a8'; font = "'Inter', sans-serif"; break;
        case 'retro': bg = '#eee8d5'; text = '#657b83'; border = '#b58900'; font = "'Courier Prime', monospace"; break;
        case 'matrix': bg = '#001100'; text = '#00ff41'; border = '#003b00'; font = "'Courier Prime', monospace"; break;
        case 'midnight': bg = '#1e293b'; text = '#e2e8f0'; border = '#334155'; font = "'Inter', sans-serif"; break;
        case 'volcano': bg = '#2b0b0b'; text = '#fee2e2'; border = '#7f1d1d'; font = "'Rubik Burned', display"; break;
        case 'ice': bg = '#164e63'; text = '#cffafe'; border = '#155e75'; font = "'Inter', sans-serif"; break;
        case 'lavender': bg = '#4c1d95'; text = '#ede9fe'; border = '#6d28d9'; font = "'Inter', sans-serif"; break;
        case 'gamer': bg = '#111111'; text = '#ffffff'; border = '#ef4444'; font = "'Russo One', sans-serif"; break;
        case 'luxury': bg = '#262626'; text = '#fcfcd4'; border = '#fbbf24'; font = "'Playfair Display', serif"; break;
        case 'comic': bg = '#f3f4f6'; text = '#000000'; border = '#000000'; font = "'Bangers', display"; break;
        case 'nature_soft': bg = '#dcfce7'; text = '#14532d'; border = '#84cc16'; font = "'Patrick Hand', cursive"; break;
        default: // dark or undefined
             bg = '#1e293b'; text = '#f8fafc'; border = '#334155'; font = "'Inter', sans-serif";
    }

    return { backgroundColor: bg, color: text, borderColor: border, fontFamily: font };
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-200"
           style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)'}}>
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center relative shrink-0">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X size={24} />
            </button>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white mx-auto mb-3 backdrop-blur-md">
                <Trophy size={28} className="fill-yellow-300 text-yellow-300" />
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Lider Tablosu</h2>
            
            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 mt-4">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border-2 ${filter === 'ALL' ? 'bg-white text-indigo-600 border-white' : 'bg-indigo-700 text-white border-indigo-500 hover:bg-indigo-500'}`}
                >
                    Tümü
                </button>
                {currentUserGrade && (
                    <button 
                        onClick={() => setFilter(currentUserGrade)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border-2 ${filter === currentUserGrade ? 'bg-white text-indigo-600 border-white' : 'bg-indigo-700 text-white border-indigo-500 hover:bg-indigo-500'}`}
                    >
                        {currentUserGrade}. Sınıf
                    </button>
                )}
            </div>
        </div>

        {/* Offline Warning */}
        {isOffline && (
            <div className="bg-red-500 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
                <WifiOff size={14} /> İnternet Bağlantısı Yok
            </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" style={{backgroundColor: 'var(--color-bg-main)'}}>
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            ) : users.length === 0 ? (
                 <div className="text-center py-10 opacity-60 text-sm flex flex-col items-center gap-2" style={{color: 'var(--color-text-muted)'}}>
                     {isOffline ? (
                         <>
                            <WifiOff size={32} />
                            <span>Sıralamayı görmek için internete bağlanın.</span>
                         </>
                     ) : (
                         <span>Bu kategoride henüz veri yok.</span>
                     )}
                 </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user, index) => {
                         const avatarDef = AVATARS.find(a => a.icon === user.avatar) || AVATARS[0];
                         const frameDef = FRAMES.find(f => f.id === user.frame) || FRAMES[0];
                         const bgDef = BACKGROUNDS.find(b => b.id === user.background) || BACKGROUNDS[0];
                         const themeStyle = getThemeStyles(user.theme);

                         return (
                            <div key={user.uid} style={themeStyle} className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-transform active:scale-[0.99] shadow-sm relative overflow-hidden`}>
                                <div className="shrink-0 w-8 flex justify-center relative z-10">
                                    {getRankIcon(index)}
                                </div>
                                
                                <div className="relative w-14 h-14 flex items-center justify-center shrink-0 z-10">
                                    {/* Frame Border */}
                                    <div className={`absolute inset-0 w-full h-full rounded-full z-30 pointer-events-none ${frameDef.style}`}></div>
                                    
                                    {/* Background */}
                                    <div className={`absolute inset-0 w-full h-full rounded-full z-10 ${bgDef.style}`}></div>

                                    {/* Avatar */}
                                    <div className="w-full h-full rounded-full overflow-hidden relative z-20 flex items-center justify-center text-2xl bg-transparent">
                                         {avatarDef.image ? (
                                             <img src={avatarDef.image} alt={user.name} className="w-full h-full object-cover scale-[1.01]" />
                                         ) : (
                                             <span>{avatarDef.icon}</span>
                                         )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 relative z-10">
                                    <h4 className="font-bold text-sm truncate" style={{fontFamily: themeStyle.fontFamily}}>{user.name || 'İsimsiz'}</h4>
                                    <div className="flex items-center gap-2 text-[10px] opacity-80">
                                        <span className="px-1.5 py-0.5 rounded font-bold" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>{user.grade}. Sınıf</span>
                                        <span>Lvl {user.level}</span>
                                        {user.streak > 0 && <span>🔥 {user.streak}</span>}
                                    </div>
                                </div>

                                <div className="text-right relative z-10">
                                    <div className="font-black text-base">{user.xp.toLocaleString()}</div>
                                    <div className="text-[8px] font-bold uppercase opacity-60">XP</div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t shrink-0" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)'}}>
            <div className="flex items-center justify-between text-sm mb-1">
                <span style={{color: 'var(--color-text-muted)'}}>Senin Puanın:</span>
                <span className="font-black text-lg text-indigo-500">{currentUserXP.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center justify-between text-[10px] opacity-50" style={{color: 'var(--color-text-muted)'}}>
                 <div className="flex items-center gap-1">
                    <RefreshCw size={10} className="animate-spin-slow" /> 
                    <span>Anlık güncellenir</span>
                 </div>
                 <span>Son: {lastUpdated.toLocaleTimeString()}</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LeaderboardModal;