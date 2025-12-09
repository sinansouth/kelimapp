
import React, { useState, useEffect } from 'react';
import { X, Swords, Plus, RefreshCw, Trophy, Users, Globe, Lock, UserPlus } from 'lucide-react';
import { getOpenChallenges, getPastChallenges, createChallenge, getAuthInstance, getFriends } from '../services/supabase';
import { Challenge, QuizDifficulty, GradeLevel } from '../types';
import { getUserProfile, getTheme } from '../services/userService';
import { getUnitAssets } from '../services/contentService';
import CustomSelect from './CustomSelect';

interface ChallengeModalProps {
  onClose: () => void;
  onCreateChallenge: (config: {
        grade: GradeLevel,
        unit: any,
        difficulty: QuizDifficulty,
        count: number,
        type: 'public' | 'private' | 'friend',
        targetFriendId?: string
  }) => void;
  onJoinChallenge: (challenge: Challenge, words?: any) => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ onClose, onCreateChallenge, onJoinChallenge }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'create' | 'history'>('active');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [history, setHistory] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [myUid, setMyUid] = useState<string | null>(null);
  
  // Create Form State
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('5');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('normal');
  const [challengeType, setChallengeType] = useState<'public' | 'friend'>('public');
  const [targetFriendId, setTargetFriendId] = useState<string>('');
  
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
      getAuthInstance().currentUser.then(user => {
          if (user) {
              setMyUid(user.id);
              fetchChallenges(user.id);
              fetchHistory(user.id);
              fetchFriends(user.id);
          }
      });
  }, []);

  const fetchChallenges = async (uid: string) => {
      setLoading(true);
      try {
          const list = await getOpenChallenges(uid);
          setChallenges(list);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const fetchHistory = async (uid: string) => {
      // setLoading(true); // Don't block UI for history
      try {
          const list = await getPastChallenges(uid);
          setHistory(list);
      } catch (e) {
          console.error(e);
      }
  };
  
  const fetchFriends = async (uid: string) => {
      try {
          const f = await getFriends(uid);
          setFriends(f);
      } catch (e) {}
  };

  const handleCreate = () => {
      if (!selectedUnitId) return;
      const unitAssets = getUnitAssets();
      const unit = unitAssets[selectedGrade]?.find(u => u.id === selectedUnitId);
      
      if (unit) {
          onCreateChallenge({
              grade: selectedGrade,
              unit: unit,
              difficulty,
              count: wordCount,
              type: challengeType,
              targetFriendId: challengeType === 'friend' ? targetFriendId : undefined
          });
      }
  };

  const getResultColor = (c: Challenge) => {
      if (c.winnerId === 'tie') return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
      if (c.winnerId === myUid) return 'bg-green-50 dark:bg-green-900/20 border-green-200';
      return 'bg-red-50 dark:bg-red-900/20 border-red-200';
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-orange-500 p-4 shrink-0 text-white flex justify-between items-center">
             <div className="flex items-center gap-2">
                 <Swords size={24} />
                 <h2 className="text-xl font-black">Düello Meydanı</h2>
             </div>
             <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                 <X size={20} />
             </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <button onClick={() => setActiveTab('active')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'active' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500' : 'text-slate-500'}`}>
                Açık Meydan
            </button>
            <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'create' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500' : 'text-slate-500'}`}>
                Meydan Oku
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === 'history' ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500' : 'text-slate-500'}`}>
                Geçmiş
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50 dark:bg-slate-900">
            {activeTab === 'active' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase">Bekleyen Düellolar</h3>
                        <button onClick={() => myUid && fetchChallenges(myUid)} className="p-1 text-slate-400 hover:text-orange-500"><RefreshCw size={14}/></button>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Yükleniyor...</div>
                    ) : challenges.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            Henüz açık bir düello yok. Sen oluştur!
                        </div>
                    ) : (
                        challenges.map(c => (
                            <div key={c.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center font-bold text-xs">
                                            {c.creatorName.substring(0,2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-slate-800 dark:text-white">{c.creatorName}</div>
                                            <div className="text-[10px] text-slate-500">{c.unitName || 'Genel'}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                                        {c.wordCount} Soru
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            // Need to fetch words for this challenge. 
                                            // In a real app we'd fetch words by indices. 
                                            // For now, we rely on App.tsx to handle the join logic fully if we pass the challenge object.
                                            // BUT we need the words.
                                            // Let's assume App.tsx will fetch words based on unitId and shuffle same way or use indices.
                                            // Actually, passing just challenge object to onJoinChallenge allows App to fetch.
                                            onJoinChallenge(c);
                                        }}
                                        className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Kabul Et
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'create' && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Sınıf</label>
                        <select 
                            value={selectedGrade} 
                            onChange={e => { setSelectedGrade(e.target.value as GradeLevel); setSelectedUnitId(''); }}
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        >
                            {Object.keys(getUnitAssets()).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Ünite</label>
                        <select 
                            value={selectedUnitId} 
                            onChange={e => setSelectedUnitId(e.target.value)}
                            className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                        >
                            <option value="">Seçiniz</option>
                            {getUnitAssets()[selectedGrade]?.map(u => <option key={u.id} value={u.id}>{u.unitNo} - {u.title}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Soru Sayısı</label>
                            <select value={wordCount} onChange={e => setWordCount(Number(e.target.value))} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Zorluk</label>
                            <select value={difficulty} onChange={e => setDifficulty(e.target.value as QuizDifficulty)} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none">
                                <option value="easy">Kolay</option>
                                <option value="normal">Normal</option>
                                <option value="hard">Zor</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Rakip</label>
                        <div className="flex gap-2 mb-2">
                            <button 
                                onClick={() => setChallengeType('public')}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${challengeType === 'public' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-600' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                            >
                                <Globe size={16} className="mx-auto mb-1"/> Herkes
                            </button>
                            <button 
                                onClick={() => setChallengeType('friend')}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${challengeType === 'friend' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                            >
                                <UserPlus size={16} className="mx-auto mb-1"/> Arkadaş
                            </button>
                        </div>
                        
                        {challengeType === 'friend' && (
                            <select 
                                value={targetFriendId} 
                                onChange={e => setTargetFriendId(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm"
                            >
                                <option value="">Arkadaş Seç</option>
                                {friends.map(f => (
                                    <option key={f.uid} value={f.uid}>{f.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <button 
                        onClick={handleCreate}
                        disabled={!selectedUnitId || (challengeType === 'friend' && !targetFriendId)}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                    >
                        Meydan Oku!
                    </button>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">Henüz geçmiş maçın yok.</div>
                    ) : (
                        history.map(c => {
                            const isMyWin = c.winnerId === myUid;
                            const isTie = c.winnerId === 'tie';
                            const resultText = isMyWin ? 'Kazandın' : isTie ? 'Berabere' : 'Kaybettin';
                            
                            return (
                                <div key={c.id} className={`p-3 rounded-xl border flex justify-between items-center ${getResultColor(c)}`}>
                                    <div>
                                        <div className="text-xs font-bold opacity-70 mb-0.5">{new Date(c.createdAt).toLocaleDateString()}</div>
                                        <div className="font-bold text-sm text-slate-800 dark:text-white">vs {c.creatorId === myUid ? c.opponentName || '?' : c.creatorName}</div>
                                        <div className="text-[10px] opacity-70">{c.unitName}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-lg">{c.creatorId === myUid ? c.creatorScore : c.opponentScore} - {c.creatorId === myUid ? c.opponentScore : c.creatorScore}</div>
                                        <div className="text-[10px] font-bold uppercase">{resultText}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
