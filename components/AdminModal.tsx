
import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { X, Zap, Trophy, Unlock, Trash2, ShieldAlert, Search, User, Award, Megaphone, Users, Calendar, Save, Lock, Gift, Settings, Activity, Menu, Clock, CheckCircle, Eye, Target, Edit2, Info, Cloud, Upload, Plus, FileText, Check, Power, Database } from 'lucide-react';
import { adminAddXP, adminSetLevel, adminUnlockAllItems, adminResetDailyQuests, adminUnlockAllBadges, adminUnlockAllAvatars, getUserStats } from '../services/userService';
import { playSound } from '../services/soundService';
import { createTournament, updateTournament, searchUser, adminGiveXP, toggleAdminStatus, createGlobalAnnouncement, getTournaments, deleteTournament, updateTournamentStatus, checkTournamentTimeouts, saveUnitData, getUnitData, updateUnitWords, syncLocalToCloud, getGlobalAnnouncements, deleteAnnouncement, updateAnnouncement, getGlobalSettings, updateGlobalSettings, upsertSystemContent, upsertGrammar } from '../services/supabase';
import { getUnitAssets } from '../services/contentService';
import { GradeLevel, QuizDifficulty, Tournament, WordCard, Announcement } from '../types';

// Data imports for uploading
import { APP_TIPS as LOCAL_TIPS } from '../data/tips';
import { GRAMMAR_CONTENT as LOCAL_GRAMMAR } from '../data/grammarContent';
import { UNIT_ASSETS as LOCAL_UNIT_ASSETS, AVATARS, FRAMES, BACKGROUNDS, GRADE_DATA, BADGES } from '../data/assets';

interface AdminModalProps {
  onClose: () => void;
  onUpdate: () => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tournaments' | 'users' | 'system' | 'content' | 'database'>('dashboard');
  const [currentStats, setCurrentStats] = useState(getUserStats());
  
  // Tournament State
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [tId, setTId] = useState<string | null>(null); // For editing
  const [tName, setTName] = useState('');
  const [tGrade, setTGrade] = useState<GradeLevel>('5');
  const [tUnit, setTUnit] = useState<string>('');
  const [tRegStartDate, setTRegStartDate] = useState('');
  const [tRegEndDate, setTRegEndDate] = useState('');
  const [tStartDate, setTStartDate] = useState('');
  const [tEndDate, setTEndDate] = useState('');
  const [tMaxParticipants, setTMaxParticipants] = useState<number>(32);
  const [tQuestionCount, setTQuestionCount] = useState<number>(15);
  const [tDifficulty, setTDifficulty] = useState<QuizDifficulty>('normal');
  const [tMinLevel, setTMinLevel] = useState<number>(1);
  const [tRoundDuration, setTRoundDuration] = useState<number>(30); // Default 30 mins
  // Rewards
  const [tReward1, setTReward1] = useState<number>(1000);
  const [tReward2, setTReward2] = useState<number>(500);
  const [tReward3, setTReward3] = useState<number>(250);
  const [tRewardPart, setTRewardPart] = useState<number>(50);

  const [creatingT, setCreatingT] = useState(false);
  const [showTournamentList, setShowTournamentList] = useState(true);

  // User Management State
  const [searchQuery, setSearchQuery] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false); 

  // Announcement State
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annId, setAnnId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annLoading, setAnnLoading] = useState(false);
  
  // System State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  // Database Upload State
  const [isUploadingData, setIsUploadingData] = useState(false);
  const [showRLSHelp, setShowRLSHelp] = useState(false);
  
  // Content Editor State
  const [selectedEditorGrade, setSelectedEditorGrade] = useState<GradeLevel>('5');
  const [selectedEditorUnit, setSelectedEditorUnit] = useState<string>('');
  const [editorWords, setEditorWords] = useState<WordCard[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);
  const [wordForm, setWordForm] = useState<WordCard>({ english: '', turkish: '', exampleEng: '', exampleTr: '', context: '' });

  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const UNIT_ASSETS = getUnitAssets();
  
  useEffect(() => {
      if (activeTab === 'tournaments') loadTournaments();
      if (activeTab === 'system') loadSystemSettings();
  }, [activeTab]);

  const refresh = () => {
    setCurrentStats(getUserStats());
    onUpdate();
  };

  const loadTournaments = async () => {
      const list = await getTournaments();
      setTournaments(list);
  };

  const loadAnnouncements = async () => {
      setAnnLoading(true);
      try {
          const list = await getGlobalAnnouncements();
          setAnnouncements(list);
      } catch (e) {
          console.error(e);
      } finally {
          setAnnLoading(false);
      }
  };
  
  const loadSystemSettings = async () => {
      await loadAnnouncements();
      try {
          const settings = await getGlobalSettings();
          if (settings.maintenance_mode) {
              setMaintenanceMode(settings.maintenance_mode.isActive);
          }
      } catch (e) { console.error(e); }
  };
  
  // --- Tournament Handlers ---
  const resetTournamentForm = () => {
      setTId(null);
      setTName('');
      setTGrade('5');
      setTUnit('');
      setTRegStartDate('');
      setTRegEndDate('');
      setTStartDate('');
      setTEndDate('');
      setTMaxParticipants(32);
      setTQuestionCount(15);
      setTDifficulty('normal');
      setTMinLevel(1);
      setTRoundDuration(30);
      setTReward1(1000);
      setTReward2(500);
      setTReward3(250);
      setTRewardPart(50);
  };

  const handleEditTournament = (t: Tournament) => {
      setTId(t.id);
      setTName(t.title);
      setTGrade(t.grade as GradeLevel);
      setTUnit(t.unitId);
      
      const toInputString = (ts: number) => {
          if (!ts) return '';
          const d = new Date(ts);
          const localD = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
          return localD.toISOString().slice(0, 16);
      };

      setTRegStartDate(toInputString(t.registrationStartDate || Date.now()));
      setTRegEndDate(toInputString(t.registrationEndDate));
      setTStartDate(toInputString(t.startDate));
      setTEndDate(toInputString(t.endDate));
      
      setTMaxParticipants(t.maxParticipants);
      setTQuestionCount(t.config.wordCount);
      setTDifficulty(t.config.difficulty);
      setTMinLevel(t.minLevel || 1);
      setTRoundDuration(t.roundDuration || 30);
      setTReward1(t.rewards.firstPlace);
      setTReward2(t.rewards.secondPlace);
      setTReward3(t.rewards.thirdPlace);
      setTRewardPart(t.rewards.participation);
      
      setShowTournamentList(false);
  };

  const handleSaveTournament = async () => {
      if (!tName || !tUnit || !tStartDate || !tEndDate || !tRegEndDate || !tRegStartDate) {
          alert("Lütfen tüm alanları doldur.");
          return;
      }
      
      const regStart = new Date(tRegStartDate).getTime();
      const regEnd = new Date(tRegEndDate).getTime();
      const start = new Date(tStartDate).getTime();
      const end = new Date(tEndDate).getTime();
      
      if (regEnd <= regStart) { alert("Kayıt bitiş tarihi, başlangıç tarihinden sonra olmalıdır."); return; }
      if (start <= regEnd) { alert("Turnuva başlangıcı, kayıt bitişinden sonra olmalıdır."); return; }
      if (end <= start) { alert("Bitiş tarihi başlangıç tarihinden sonra olmalıdır."); return; }

      setCreatingT(true);
      try {
          const unitDef = UNIT_ASSETS[tGrade]?.find(u => u.id === tUnit);
          const data = {
              title: tName,
              grade: tGrade,
              unitId: tUnit,
              unitName: unitDef?.title || 'Bilinmeyen Ünite',
              registrationStartDate: regStart,
              registrationEndDate: regEnd,
              startDate: start,
              endDate: end,
              maxParticipants: tMaxParticipants,
              minLevel: tMinLevel,
              roundDuration: tRoundDuration,
              rewards: { firstPlace: tReward1, secondPlace: tReward2, thirdPlace: tReward3, participation: tRewardPart },
              config: { difficulty: tDifficulty, wordCount: tQuestionCount }
          };

          if (tId) {
              await updateTournament(tId, data);
              alert("Turnuva Güncellendi!");
          } else {
              await createTournament(data);
              alert("Turnuva Oluşturuldu!");
          }
          
          resetTournamentForm();
          loadTournaments();
          setShowTournamentList(true);
      } catch (e) {
          console.error(e);
          alert("Hata oluştu.");
      } finally {
          setCreatingT(false);
      }
  };

  const handleDeleteTournament = async (id: string) => {
      if (confirm("Bu turnuvayı silmek istediğine emin misin?")) {
          setTournaments(prev => prev.filter(t => t.id !== id));
          try { await deleteTournament(id); } catch (e) { alert("Silinirken hata oluştu."); loadTournaments(); }
      }
  };

  const handleCheckTimeouts = async (id: string) => {
      try {
          const didUpdate = await checkTournamentTimeouts(id);
          if (didUpdate) { alert("Süresi dolan maçlar güncellendi ve tur atlatıldı."); loadTournaments(); }
          else { alert("İşlem yapılacak maç bulunamadı veya süreleri henüz dolmamış."); }
      } catch (e) { console.error(e); alert("Kontrol sırasında hata oluştu."); }
  };
  
  // --- User Handlers ---
  const handleSearchUser = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery) return;
      setUserActionLoading(true); setShowUserDetails(false);
      try {
          const user = await searchUser(searchQuery);
          if (user) setFoundUser(user); else { alert("Kullanıcı bulunamadı."); setFoundUser(null); }
      } catch (e) { alert("Hata oluştu."); } finally { setUserActionLoading(false); }
  };

  const handleGiveUserXP = async (amount: number) => {
      if (!foundUser) return;
      try {
          await adminGiveXP(foundUser.uid, amount);
          alert(`${foundUser.leaderboardData.name} kullanıcısına ${amount} XP verildi.`);
          const updatedUser = await searchUser(foundUser.email); if (updatedUser) setFoundUser(updatedUser);
      } catch (e) { alert("Hata"); }
  };

  const handleToggleAdmin = async () => {
      if (!foundUser) return;
      try {
          const newStatus = !foundUser.profile.isAdmin;
          await toggleAdminStatus(foundUser.uid, newStatus);
          setFoundUser({ ...foundUser, profile: { ...foundUser.profile, isAdmin: newStatus } });
          alert(`Yönetici yetkisi ${newStatus ? 'verildi' : 'alındı'}.`);
      } catch (e) { alert("Hata"); }
  };

  // --- Announcement Handlers ---
  const handleSaveAnnouncement = async () => {
      if (!annTitle || !annContent) return;
      setAnnLoading(true);
      try {
          if (annId) {
              await updateAnnouncement(annId, annTitle, annContent);
              alert("Duyuru güncellendi.");
          } else {
              await createGlobalAnnouncement(annTitle, annContent);
              alert("Duyuru gönderildi.");
          }
          setAnnTitle(''); setAnnContent(''); setAnnId(null);
          loadAnnouncements();
      } catch (e: any) { 
          alert("İşlem başarısız: " + (e.message || e)); 
      } finally { 
          setAnnLoading(false); 
      }
  };

  const handleEditAnnouncement = (ann: any) => {
      setAnnId(ann.id);
      setAnnTitle(ann.title);
      setAnnContent(ann.content);
  };

  const handleDeleteAnnouncement = async (id: string) => {
      if(!confirm("Bu duyuruyu silmek istiyor musunuz?")) return;
      try {
          await deleteAnnouncement(id);
          loadAnnouncements();
      } catch (e) { alert("Silinemedi."); }
  };
  
  // --- System Handlers ---
  const handleMaintenanceToggle = async () => {
      const newState = !maintenanceMode;
      try {
          await updateGlobalSettings('maintenance_mode', { 
              isActive: newState, 
              message: "Sistem bakımdadır, lütfen daha sonra tekrar deneyiniz."
          });
          setMaintenanceMode(newState);
          alert(`Bakım modu ${newState ? 'açıldı' : 'kapandı'}.`);
      } catch (e) {
          alert("Ayar güncellenemedi.");
      }
  };
  
  // --- Content Editor Handlers ---
  const handleLoadWords = async () => {
      if (!selectedEditorUnit) return;
      setIsLoadingWords(true);
      try {
          let words = await getUnitData(selectedEditorUnit);
          setEditorWords(words || []);
          setEditingWordIndex(null);
          setWordForm({ english: '', turkish: '', exampleEng: '', exampleTr: '', context: '' });
      } catch (e) {
          alert("Veri çekilemedi: " + e);
      } finally {
          setIsLoadingWords(false);
      }
  };

  const handleSaveWord = async () => {
      if (!selectedEditorUnit) return;
      if (!wordForm.english || !wordForm.turkish) { alert("İngilizce ve Türkçe alanları zorunludur."); return; }

      const newWords = [...editorWords];
      if (editingWordIndex !== null) {
          newWords[editingWordIndex] = wordForm;
      } else {
          newWords.push(wordForm);
      }

      try {
          await updateUnitWords(selectedEditorUnit, newWords);
          setEditorWords(newWords);
          setEditingWordIndex(null);
          setWordForm({ english: '', turkish: '', exampleEng: '', exampleTr: '', context: '' });
          alert("Kaydedildi!");
      } catch (e) {
          alert("Kaydedilirken hata oluştu: " + e);
      }
  };

  const handleDeleteWord = async (index: number) => {
      if (!confirm("Bu kelimeyi silmek istediğinize emin misiniz?")) return;
      if (!selectedEditorUnit) return;

      const newWords = editorWords.filter((_, i) => i !== index);
      try {
          await updateUnitWords(selectedEditorUnit, newWords);
          setEditorWords(newWords);
      } catch (e) {
          alert("Silinirken hata oluştu.");
      }
  };

  const handleEditWordClick = (index: number) => {
      setEditingWordIndex(index);
      setWordForm(editorWords[index]);
      const form = document.getElementById('word-editor-form');
      if (form) form.scrollIntoView({ behavior: 'smooth' });
  };
  
  // --- Cheat Handlers ---
  const handleAddXP = (amount: number) => { adminAddXP(amount); playSound('success'); refresh(); };
  const handleSetLevel = (level: number) => { adminSetLevel(level); playSound('success'); refresh(); };
  const handleUnlockBadges = () => { adminUnlockAllBadges(); playSound('success'); alert("Rozetler Açıldı!"); refresh(); };
  const handleUnlockAvatars = () => { adminUnlockAllAvatars(); playSound('success'); alert("Avatarlar Açıldı!"); refresh(); };
  const handleResetQuests = () => { adminResetDailyQuests(); playSound('click'); alert("Görevler sıfırlandı."); refresh(); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-0 md:p-4 animate-in fade-in duration-200">
      <div className="w-full md:max-w-6xl h-full md:h-[90vh] bg-slate-900 text-white md:rounded-3xl shadow-2xl border-none md:border border-slate-700 flex flex-col md:flex-row overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2 font-black text-red-500">
                 <ShieldAlert size={20} className="fill-current" /> ADMIN
             </div>
             <div className="flex items-center gap-3">
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
                     <Menu size={24} />
                 </button>
                 <button onClick={onClose} className="p-2 text-slate-400">
                     <X size={24} />
                 </button>
             </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 border-b border-slate-800 z-50 p-2 flex flex-col gap-1 shadow-2xl">
                 <button onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg font-bold flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>
                     <Zap size={20} /> Dashboard
                 </button>
                 <button onClick={() => { setActiveTab('tournaments'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg font-bold flex items-center gap-3 ${activeTab === 'tournaments' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>
                     <Trophy size={20} /> Turnuvalar
                 </button>
                 <button onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg font-bold flex items-center gap-3 ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>
                     <Users size={20} /> Kullanıcılar
                 </button>
                 <button onClick={() => { setActiveTab('content'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg font-bold flex items-center gap-3 ${activeTab === 'content' ? 'bg-green-600 text-white' : 'text-slate-400'}`}>
                     <Cloud size={20} /> İçerik
                 </button>
                 <button onClick={() => { setActiveTab('system'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg font-bold flex items-center gap-3 ${activeTab === 'system' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>
                     <Settings size={20} /> Sistem
                 </button>
                 <button onClick={() => { setActiveTab('database'); setIsMobileMenuOpen(false); }} className={`p-3 rounded-lg font-bold flex items-center gap-3 ${activeTab === 'database' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}>
                     <Database size={20} /> Veri Tabanı
                 </button>
            </div>
        )}

        {/* Desktop Sidebar */}
        <div className="w-64 bg-slate-950 border-r border-slate-800 p-6 hidden md:flex flex-col shrink-0">
             <div className="flex items-center gap-2 font-black text-xl text-red-500 mb-8 tracking-tight">
                 <ShieldAlert className="fill-current" /> ADMIN PANEL
             </div>
             
             <nav className="space-y-2 flex-1">
                 <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-400 hover:bg-slate-900'}`}>
                     <Zap size={20} /> Dashboard
                 </button>
                 <button onClick={() => setActiveTab('tournaments')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'tournaments' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-slate-400 hover:bg-slate-900'}`}>
                     <Trophy size={20} /> Turnuvalar
                 </button>
                 <button onClick={() => setActiveTab('users')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-900'}`}>
                     <Users size={20} /> Kullanıcılar
                 </button>
                 <button onClick={() => setActiveTab('content')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'content' ? 'bg-green-600 text-white shadow-lg shadow-green-900/50' : 'text-slate-400 hover:bg-slate-900'}`}>
                     <Cloud size={20} /> İçerik
                 </button>
                 <button onClick={() => setActiveTab('system')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'system' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-400 hover:bg-slate-900'}`}>
                     <Settings size={20} /> Sistem
                 </button>
                 <button onClick={() => setActiveTab('database')} className={`w-full text-left p-3 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'database' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-400 hover:bg-slate-900'}`}>
                     <Database size={20} /> Veri Tabanı
                 </button>
             </nav>
             
             <button onClick={onClose} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-300 flex items-center gap-2 justify-center transition-colors">
                 <X size={18} /> Paneli Kapat
             </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900 relative custom-scrollbar">
            
            {/* DASHBOARD (Cheats & My Stats) */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
                        <Activity className="text-red-500" /> Hızlı İşlemler
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                         <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
                             <div className="text-xs font-bold text-green-400 uppercase mb-4 tracking-wider flex items-center gap-2"><Gift size={14}/> Kendine XP Ekle</div>
                             <div className="flex gap-3">
                                 <button onClick={() => handleAddXP(1000)} className="flex-1 bg-slate-700 hover:bg-green-600 py-3 rounded-xl font-black text-sm transition-all active:scale-95 border border-slate-600 hover:border-green-500">+1K</button>
                                 <button onClick={() => handleAddXP(5000)} className="flex-1 bg-slate-700 hover:bg-green-600 py-3 rounded-xl font-black text-sm transition-all active:scale-95 border border-slate-600 hover:border-green-500">+5K</button>
                             </div>
                         </div>
                         <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
                             <div className="text-xs font-bold text-blue-400 uppercase mb-4 tracking-wider flex items-center gap-2"><Award size={14}/> Seviye Ata</div>
                             <div className="flex gap-3">
                                 <button onClick={() => handleSetLevel(10)} className="flex-1 bg-slate-700 hover:bg-blue-600 py-3 rounded-xl font-black text-sm transition-all active:scale-95 border border-slate-600 hover:border-blue-500">Lvl 10</button>
                                 <button onClick={() => handleSetLevel(50)} className="flex-1 bg-slate-700 hover:bg-blue-600 py-3 rounded-xl font-black text-sm transition-all active:scale-95 border border-slate-600 hover:border-blue-500">Lvl 50</button>
                             </div>
                         </div>
                         <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
                             <div className="text-xs font-bold text-yellow-400 uppercase mb-4 tracking-wider flex items-center gap-2"><Unlock size={14}/> Kilitleri Aç</div>
                             <div className="flex gap-3">
                                 <button onClick={handleUnlockBadges} className="flex-1 bg-slate-700 hover:bg-yellow-600 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-600 hover:border-yellow-500 flex flex-col items-center gap-1">
                                     <Award size={18} /> Rozetler
                                 </button>
                                 <button onClick={handleUnlockAvatars} className="flex-1 bg-slate-700 hover:bg-purple-600 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 border border-slate-600 hover:border-purple-500 flex flex-col items-center gap-1">
                                     <User size={18} /> Avatarlar
                                 </button>
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {/* TOURNAMENTS TAB - (Keeping existing logic) */}
            {activeTab === 'tournaments' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl md:text-3xl font-black">Turnuvalar</h2>
                        <button onClick={() => { resetTournamentForm(); setShowTournamentList(!showTournamentList); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-colors">
                            {showTournamentList ? 'Yeni Oluştur' : 'Listeye Dön'}
                        </button>
                    </div>
                    
                    {showTournamentList ? (
                        <div className="grid grid-cols-1 gap-4">
                            {tournaments.map(t => {
                                // ... (Existing tournament display logic)
                                const now = Date.now();
                                const regStart = t.registrationStartDate || 0;
                                let displayStatus = t.status.toUpperCase();
                                let statusColor = 'bg-slate-700 text-slate-400';
                                if (t.status === 'active') { displayStatus = 'DEVAM EDİYOR'; statusColor = 'bg-blue-900 text-blue-400'; } 
                                else if (t.status === 'registration') {
                                    if (now < regStart) { displayStatus = 'KAYIT BEKLENİYOR'; statusColor = 'bg-orange-900 text-orange-400'; } 
                                    else { displayStatus = 'KAYIT AÇIK'; statusColor = 'bg-green-900 text-green-400'; }
                                } else { displayStatus = 'TAMAMLANDI'; statusColor = 'bg-slate-800 text-slate-500'; }

                                return (
                                <div key={t.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:border-slate-600 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-lg text-white">{t.title}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold tracking-wide ${statusColor}`}>{displayStatus}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">{t.grade === 'GENERAL' ? 'Genel' : `${t.grade}. Sınıf`}</span>
                                            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 truncate max-w-[150px]">{t.unitName}</span>
                                            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1"><Users size={12}/> {t.participants.length}/{t.maxParticipants}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <button onClick={() => handleCheckTimeouts(t.id)} className="w-full md:w-auto px-3 py-2 bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 rounded-lg text-xs font-bold border border-blue-800 flex items-center justify-center gap-1"><Clock size={14}/> Süre</button>
                                        <button onClick={() => handleEditTournament(t)} className="flex-1 md:flex-none px-3 py-2 bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50 rounded-lg text-xs font-bold border border-yellow-800 flex items-center justify-center"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDeleteTournament(t.id)} className="flex-1 md:flex-none px-3 py-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg text-xs font-bold border border-red-800 flex items-center justify-center"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            )})}
                            {tournaments.length === 0 && <div className="text-center text-slate-500 py-10">Hiç turnuva yok.</div>}
                        </div>
                    ) : (
                        // CREATE FORM (Existing Logic)
                        <div className="bg-slate-800 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-xl">
                           <h3 className="font-bold text-indigo-400 mb-6 flex items-center gap-2 text-lg"><Trophy size={24}/> {tId ? 'Düzenle' : 'Yeni Oluştur'}</h3>
                           {/* ... Form inputs ... */}
                           <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Ad</label><input type="text" value={tName} onChange={(e)=>setTName(e.target.value)} className="w-full p-4 bg-slate-900 border border-slate-600 rounded-2xl text-sm" placeholder="Turnuva Adı" /></div>
                                    <div className="flex gap-4">
                                        <div className="flex-1"><label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Sınıf</label><select value={tGrade} onChange={(e)=>{setTGrade(e.target.value as GradeLevel); setTUnit('')}} className="w-full p-4 bg-slate-900 border border-slate-600 rounded-2xl text-sm">{Object.keys(UNIT_ASSETS).map(g=><option key={g} value={g}>{g}</option>)}</select></div>
                                        <div className="flex-[2]"><label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Ünite</label><select value={tUnit} onChange={(e)=>setTUnit(e.target.value)} className="w-full p-4 bg-slate-900 border border-slate-600 rounded-2xl text-sm"><option value="">Seçiniz</option>{UNIT_ASSETS[tGrade]?.map(u=><option key={u.id} value={u.id}>{u.unitNo} - {u.title}</option>)}</select></div>
                                    </div>
                                </div>
                                {/* Dates & Config */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Kayıt Baş.</label><input type="datetime-local" value={tRegStartDate} onChange={e=>setTRegStartDate(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Kayıt Bit.</label><input type="datetime-local" value={tRegEndDate} onChange={e=>setTRegEndDate(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Maç Baş.</label><input type="datetime-local" value={tStartDate} onChange={e=>setTStartDate(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Maç Bit.</label><input type="datetime-local" value={tEndDate} onChange={e=>setTEndDate(e.target.value)} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Katılımcı</label><select value={tMaxParticipants} onChange={e=>setTMaxParticipants(Number(e.target.value))} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"><option value="4">4</option><option value="8">8</option><option value="16">16</option><option value="32">32</option><option value="64">64</option></select></div>
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Soru Sayısı</label><input type="number" value={tQuestionCount} onChange={e=>setTQuestionCount(Number(e.target.value))} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Min. Lvl</label><input type="number" value={tMinLevel} onChange={e=>setTMinLevel(Number(e.target.value))} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                    <div><label className="text-xs font-bold text-slate-400 block mb-1">Tur (DK)</label><input type="number" value={tRoundDuration} onChange={e=>setTRoundDuration(Number(e.target.value))} className="w-full p-2 bg-slate-900 border border-slate-600 rounded-xl text-xs"/></div>
                                </div>
                                <button onClick={handleSaveTournament} disabled={creatingT} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all">{creatingT ? 'İşleniyor...' : 'Kaydet'}</button>
                           </div>
                        </div>
                    )}
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl md:text-3xl font-black mb-6">Kullanıcı Yönetimi</h2>
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl min-h-[400px]">
                        <form onSubmit={handleSearchUser} className="flex gap-3 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="E-posta, Kullanıcı Adı veya UID..." className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-2xl text-base focus:border-blue-500 focus:ring-2 outline-none transition-all placeholder:text-slate-600" />
                            </div>
                            <button type="submit" className="px-8 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-white transition-colors">Ara</button>
                        </form>

                        {userActionLoading && <div className="text-center py-10 text-slate-400">Aranıyor...</div>}
                        
                        {foundUser && (
                            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-600 animate-in fade-in zoom-in duration-300">
                                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-4xl border-2 border-slate-700">{foundUser.profile.avatar}</div>
                                        <div>
                                            <h3 className="font-bold text-xl text-white">{foundUser.profile.name}</h3>
                                            <p className="text-sm text-slate-400 font-mono mt-0.5 break-all">{foundUser.email}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-yellow-500 font-bold">Lvl {foundUser.stats?.level || 1}</span>
                                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-blue-400 font-bold">{foundUser.stats?.xp || 0} XP</span>
                                                {foundUser.profile.isAdmin && <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-900 font-bold flex items-center gap-1"><ShieldAlert size={10}/> ADMIN</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowUserDetails(!showUserDetails)} className="w-full md:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold border border-slate-700 transition-colors">{showUserDetails ? 'Gizle' : 'Detaylar'}</button>
                                </div>
                                {showUserDetails && (
                                    <div className="mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono overflow-x-auto">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {/* (User details here) */}
                                            <div className="bg-slate-900 p-2 rounded border border-slate-800">Streak: {foundUser.stats?.streak}</div>
                                            <div className="bg-slate-900 p-2 rounded border border-slate-800">Quiz: {foundUser.stats?.quizCorrect}/{foundUser.stats?.quizWrong}</div>
                                            <div className="bg-slate-900 p-2 rounded border border-slate-800">Cards: {foundUser.stats?.flashcardsViewed}</div>
                                            <div className="bg-slate-900 p-2 rounded border border-slate-800">Time: {Math.floor((foundUser.stats?.totalTimeSpent || 0)/60)}h</div>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button onClick={() => handleGiveUserXP(1000)} className="p-4 bg-slate-800 hover:bg-yellow-900/20 border border-slate-700 hover:border-yellow-500/50 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all text-yellow-500"><Gift size={18} /> +1000 XP</button>
                                    <button onClick={handleToggleAdmin} className={`p-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all border ${foundUser.profile.isAdmin ? 'bg-red-900/10 border-red-800 text-red-500' : 'bg-green-900/10 border-green-800 text-green-500'}`}><Lock size={18} /> {foundUser.profile.isAdmin ? 'Yöneticiliği Al' : 'Yönetici Yap'}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* CONTENT MANAGEMENT TAB */}
            {activeTab === 'content' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
                        <Cloud className="text-green-500" /> İçerik Yönetimi
                    </h2>

                    {/* Word Editor Section */}
                    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl mb-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><Edit2 size={20} /> Kelime Düzenleyici</h3>
                        
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Sınıf</label>
                                <select 
                                    value={selectedEditorGrade} 
                                    onChange={(e) => { setSelectedEditorGrade(e.target.value as GradeLevel); setSelectedEditorUnit(''); }}
                                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-sm"
                                >
                                    {Object.keys(UNIT_ASSETS).map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="flex-[2]">
                                <label className="text-xs font-bold text-slate-400 block mb-2 uppercase">Ünite</label>
                                <select 
                                    value={selectedEditorUnit} 
                                    onChange={(e) => setSelectedEditorUnit(e.target.value)}
                                    className="w-full p-3 bg-slate-900 border border-slate-600 rounded-xl text-sm"
                                >
                                    <option value="">Seçiniz</option>
                                    {UNIT_ASSETS[selectedEditorGrade]?.map(u => (
                                        <option key={u.id} value={u.id}>{u.unitNo} - {u.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button 
                                    onClick={handleLoadWords} 
                                    disabled={!selectedEditorUnit || isLoadingWords}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all h-[46px]"
                                >
                                    {isLoadingWords ? 'Yükleniyor...' : 'Verileri Getir'}
                                </button>
                            </div>
                        </div>

                        {/* Editor Form */}
                        {selectedEditorUnit && (
                            <div id="word-editor-form" className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 mb-6">
                                <h4 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-wider">
                                    {editingWordIndex !== null ? 'Kelime Düzenle' : 'Yeni Kelime Ekle'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input type="text" placeholder="İngilizce (Örn: Apple)" value={wordForm.english} onChange={e => setWordForm({...wordForm, english: e.target.value})} className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm" />
                                    <input type="text" placeholder="Türkçe (Örn: Elma)" value={wordForm.turkish} onChange={e => setWordForm({...wordForm, turkish: e.target.value})} className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm" />
                                    <input type="text" placeholder="Örnek Cümle (Eng)" value={wordForm.exampleEng} onChange={e => setWordForm({...wordForm, exampleEng: e.target.value})} className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm" />
                                    <input type="text" placeholder="Örnek Cümle (Tr)" value={wordForm.exampleTr} onChange={e => setWordForm({...wordForm, exampleTr: e.target.value})} className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm" />
                                    <input type="text" placeholder="Bağlam (Context)" value={wordForm.context} onChange={e => setWordForm({...wordForm, context: e.target.value})} className="p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm col-span-1 md:col-span-2" />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handleSaveWord} className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                                        <Save size={18} /> {editingWordIndex !== null ? 'Güncelle' : 'Ekle'}
                                    </button>
                                    {editingWordIndex !== null && (
                                        <button onClick={() => { setEditingWordIndex(null); setWordForm({ english: '', turkish: '', exampleEng: '', exampleTr: '', context: '' }); }} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all">
                                            İptal
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Words List */}
                        {editorWords.length > 0 && (
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar border border-slate-700 rounded-xl">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-900 text-slate-400 sticky top-0">
                                        <tr>
                                            <th className="p-3 font-bold">İngilizce</th>
                                            <th className="p-3 font-bold">Türkçe</th>
                                            <th className="p-3 font-bold text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {editorWords.map((w, i) => (
                                            <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                                                <td className="p-3 font-medium text-white">{w.english}</td>
                                                <td className="p-3 text-slate-300">{w.turkish}</td>
                                                <td className="p-3 text-right">
                                                    <button onClick={() => handleEditWordClick(i)} className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg mr-1"><Edit2 size={16}/></button>
                                                    <button onClick={() => handleDeleteWord(i)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={16}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {selectedEditorUnit && !isLoadingWords && editorWords.length === 0 && (
                            <div className="text-center py-8 text-slate-500">Bu ünitede henüz kelime yok veya yüklenmedi.</div>
                        )}
                    </div>
                </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === 'system' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl md:text-3xl font-black mb-6">Sistem Ayarları</h2>
                    
                    {/* Announcement Manager */}
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl mb-6">
                        <h3 className="font-bold text-orange-400 mb-6 flex items-center gap-2 text-lg"><Megaphone size={24} /> Duyuru Yönetimi</h3>
                        
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-600">
                                <div className="text-xs font-bold text-slate-500 mb-2 uppercase">{annId ? 'Duyuru Düzenle' : 'Yeni Duyuru'}</div>
                                <div className="space-y-3">
                                    <input type="text" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="Duyuru Başlığı" className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm outline-none focus:border-orange-500 transition-colors"/>
                                    <textarea value={annContent} onChange={(e) => setAnnContent(e.target.value)} placeholder="Duyuru metni buraya..." className="w-full p-3 bg-slate-800 border border-slate-600 rounded-xl text-sm outline-none h-24 resize-none focus:border-orange-500 transition-colors"/>
                                    <div className="flex justify-end gap-2">
                                        {annId && <button onClick={() => { setAnnId(null); setAnnTitle(''); setAnnContent(''); }} className="px-4 py-2 text-slate-400 hover:text-white text-sm">İptal</button>}
                                        <button onClick={handleSaveAnnouncement} disabled={annLoading} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all">
                                            {annLoading ? '...' : (annId ? 'Güncelle' : 'Yayınla')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                             <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Aktif Duyurular</h4>
                             {announcements.length > 0 ? (
                                 <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                                     {announcements.map(ann => (
                                         <div key={ann.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700 flex justify-between items-start group">
                                             <div>
                                                 <div className="font-bold text-white text-sm">{ann.title}</div>
                                                 <div className="text-xs text-slate-400 line-clamp-1">{ann.content}</div>
                                                 <div className="text-[10px] text-slate-500 mt-1">{ann.date}</div>
                                             </div>
                                             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <button onClick={() => handleEditAnnouncement(ann)} className="p-1.5 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50"><Edit2 size={14}/></button>
                                                 <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1.5 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"><Trash2 size={14}/></button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             ) : (
                                 <div className="text-center text-slate-500 text-sm py-4">Henüz duyuru yok.</div>
                             )}
                        </div>
                    </div>

                    {/* Maintenance Mode */}
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-2"><Power size={20} className={maintenanceMode ? "text-red-500" : "text-green-500"} /> Bakım Modu</h3>
                                <p className="text-slate-400 text-xs mt-1">Aktif olduğunda sadece yöneticiler uygulamaya erişebilir.</p>
                            </div>
                            <button 
                                onClick={handleMaintenanceToggle}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${maintenanceMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                            >
                                {maintenanceMode ? 'Bakımı Kapat' : 'Bakımı Aç'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
                         <h3 className="font-bold text-slate-300 mb-6 text-lg">Sıfırlama İşlemleri</h3>
                         <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-2xl">
                             <p className="text-xs text-red-400 mb-4 font-medium leading-relaxed">Dikkat: Bu işlem tüm kullanıcıların günlük görev ilerlemelerini sıfırlar.</p>
                             <button onClick={handleResetQuests} className="w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 hover:border-red-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"><Trash2 size={18} /> Günlük Görevleri Sıfırla</button>
                         </div>
                    </div>
                </div>
            )}
            
            {/* DATABASE TAB (Simplified) */}
            {activeTab === 'database' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
                        <Database className="text-purple-500" /> Veri Tabanı
                    </h2>
                    
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-purple-900/30 text-purple-400 rounded-xl">
                                <Info size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Veri Yönetimi</h3>
                                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                                    Veritabanı yönetimi ve senkronizasyon işlemleri otomatik olarak yapılmaktadır.
                                    <br/>
                                    Manuel işlem gerekirse lütfen sistem yöneticisi ile iletişime geçin.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AdminModal;
