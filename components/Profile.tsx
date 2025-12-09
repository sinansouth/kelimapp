



import React, { useState, useEffect, useMemo } from 'react';
import { Save, Edit2, BarChart2, Trophy, Flame, Star, User, ShoppingBag, Target, CheckCircle, ChevronDown, ChevronUp, LogOut, Trash2, ShieldCheck, Ghost, LogIn, KeyRound, Mail, GraduationCap, Users, Copy, UserPlus } from 'lucide-react';
import { getUserProfile, getUserStats, saveUserProfile, getDailyState, UserProfile as IUserProfile, UserStats } from '../services/userService';
import { GradeLevel, Badge, Quest } from '../types';
// FIX: Changed to a named import to match the updated export in StatsModal.tsx.
import { StatsModal } from './StatsModal';
import AvatarModal from './AvatarModal';
import LeaderboardModal from './LeaderboardModal';
import { getAvatars, getBadges, getFrames, getBackgrounds } from '../services/contentService';
import { THEME_COLORS } from '../data/assets';
import { getAuthInstance, logoutUser, checkUsernameExists, updateCloudUsername, syncLocalToCloud, deleteAccount, resetUserPassword, updateUserEmail, addFriend, getFriends, LeaderboardEntry } from '../services/supabase';
import AuthModal from './AuthModal';
import { AlertType } from './CustomAlert';
import CustomSelect from './CustomSelect';

interface ProfileProps {
  onBack: () => void;
  onProfileUpdate?: () => void;
  onOpenMarket?: () => void;
  onLoginRequest?: (initialView?: 'login' | 'register') => void;
  externalStats?: UserStats;
  showAlert: (title: string, message: string, type: AlertType, onConfirm?: () => void) => void;
  onViewProfile: (userId: string) => void;
}

const getGradeVisuals = (grade: string) => {
  if (['2', '3', '4'].includes(grade)) {
    return { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-600 dark:text-teal-400' };
  }
  if (['5', '6', '7', '8'].includes(grade)) {
    return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400' };
  }
  if (['9', '10', '11', '12'].includes(grade)) {
    return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' };
  }
  if (grade && (grade.startsWith('A') || grade.startsWith('B') || grade.startsWith('C'))) {
      return { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-400' };
  }
  return { bg: 'bg-slate-50 dark:bg-slate-900/50', border: 'border-slate-200 dark:border-slate-800', text: 'text-slate-600 dark:text-slate-400' };
};

const gradeOptions = [
    { value: "2", label: "2. Sınıf", group: "İlkokul" },
    { value: "3", label: "3. Sınıf", group: "İlkokul" },
    { value: "4", label: "4. Sınıf", group: "İlkokul" },
    { value: "5", label: "5. Sınıf", group: "Ortaokul" },
    { value: "6", label: "6. Sınıf", group: "Ortaokul" },
    { value: "7", label: "7. Sınıf", group: "Ortaokul" },
    { value: "8", label: "8. Sınıf", group: "Ortaokul" },
    { value: "9", label: "9. Sınıf", group: "Lise" },
    { value: "10", label: "10. Sınıf", group: "Lise" },
    { value: "11", label: "11. Sınıf", group: "Lise" },
    { value: "12", label: "12. Sınıf", group: "Lise" },
    { value: "A1", label: "A1 (Başlangıç)", group: "Genel İngilizce" },
    { value: "A2", label: "A2 (Temel)", group: "Genel İngilizce" },
    { value: "B1", label: "B1 (Orta)", group: "Genel İngilizce" },
    { value: "B2", label: "B2 (Orta Üstü)", group: "Genel İngilizce" },
    { value: "C1", label: "C1 (İleri)", group: "Genel İngilizce" },
];

const Profile: React.FC<ProfileProps> = ({ onBack, onProfileUpdate, onOpenMarket, onLoginRequest, externalStats, showAlert, onViewProfile }) => {
  const [profile, setProfile] = useState<IUserProfile>({ name: '', grade: '', avatar: '', frame: 'frame_none', background: 'bg_default', purchasedThemes: [], purchasedFrames: [], purchasedBackgrounds: [], inventory: { streakFreezes: 0 } });
  const [stats, setStats] = useState<UserStats | null>(externalStats || null);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Accordion states
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [tooltipBadgeId, setTooltipBadgeId] = useState<string | null>(null);
  
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  
  // Friends State
  const [friendCode, setFriendCode] = useState('');
  const [friendsList, setFriendsList] = useState<LeaderboardEntry[]>([]);
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);

  const visuals = useMemo(() => getGradeVisuals(profile.grade), [profile.grade]);

  const AVATARS = getAvatars();
  const BADGES = getBadges();
  const FRAMES = getFrames();
  const BACKGROUNDS = getBackgrounds();

  useEffect(() => {
      if (externalStats) {
          setStats(externalStats);
      }
  }, [externalStats]);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
    if (!externalStats) {
        setStats(getUserStats());
    }
    setDailyQuests(getDailyState().quests);
    setAvatarLoadError(false);

    const auth = getAuthInstance();
    // Supabase auth user is a promise in our wrapper
    auth.currentUser.then(user => {
        setCurrentUser(user);
        if (user && !userProfile.isGuest) {
            fetchFriends(user.id);
        }
    });
  }, [showStatsModal, showAvatarModal, externalStats]);

  const fetchFriends = async (uid: string) => {
      setFriendsLoading(true);
      try {
          const friends = await getFriends(uid);
          setFriendsList(friends);
      } catch (e) {
          console.error("Failed to fetch friends", e);
      } finally {
          setFriendsLoading(false);
      }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const oldProfile = getUserProfile();
    const isNameChanged = profile.name !== oldProfile.name;

    if (isNameChanged && !profile.isGuest) {
        if (!navigator.onLine) {
            showAlert("Hata", "İsim değiştirmek için internet bağlantısı gereklidir.", "error");
            setIsSaving(false);
            return;
        }

        const lastChange = oldProfile.lastUsernameChange || 0;
        const now = Date.now();
        const daysSinceLastChange = (now - lastChange) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastChange < 7) {
            const daysLeft = Math.ceil(7 - daysSinceLastChange);
            showAlert("Hata", `İsmini haftada sadece 1 kez değiştirebilirsin. ${daysLeft} gün sonra tekrar dene.`, "warning");
            setIsSaving(false);
            return;
        }

        try {
            const exists = await checkUsernameExists(profile.name);
            if (exists) {
                showAlert("Hata", "Bu isim zaten alınmış.", "error");
                setIsSaving(false);
                return;
            }

            const auth = getAuthInstance();
            const user = await auth.currentUser;
            if (user) {
                await updateCloudUsername(user.id, profile.name);
            }
        } catch (err) {
            showAlert("Hata", "İsim kontrolü sırasında bir hata oluştu.", "error");
            setIsSaving(false);
            return;
        }
    }

    const updatedProfile = { 
        ...profile,
        lastUsernameChange: isNameChanged ? Date.now() : profile.lastUsernameChange 
    }; 
    
    saveUserProfile(updatedProfile, true); 
    
    // Sync to Cloud
    if (!profile.isGuest) {
         await syncLocalToCloud();
    }

    setProfile(updatedProfile);
    showAlert("Başarılı", "Profilin güncellendi!", "success");
    setIsEditing(false);
    setIsSaving(false);
    
    if (onProfileUpdate) {
        onProfileUpdate();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleGradeChange = (value: string) => {
      setProfile(prev => ({ ...prev, grade: value }));
  };

  const handleDeleteAccount = () => {
      showAlert("Hesap Silinecek", "Hesabını kalıcı olarak silmek istediğine emin misin? Bu işlem geri alınamaz.", "warning", async () => {
          setIsSaving(true);
          try {
              await deleteAccount();
          } catch (e) {
              showAlert("Hata", "Hesap silinirken bir hata oluştu.", "error");
              setIsSaving(false);
          }
      });
  };
  
  const handleResetPassword = async () => {
      if (currentUser?.email) {
          try {
              await resetUserPassword(currentUser.email);
              showAlert("Başarılı", `Şifre sıırlama bağlantısı ${currentUser.email} adresine gönderildi.`, "success");
          } catch (e) {
              showAlert("Hata", "E-posta gönderilemedi.", "error");
          }
      }
  };

  const handleGuestSignup = () => {
      if (onLoginRequest) onLoginRequest('register');
  };

  const handleAddFriend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      if (!friendCode.trim()) return;
      if (friendCode.trim().length !== 6) {
           showAlert("Hata", "Arkadaş kodu 6 haneli olmalıdır.", "error");
           return;
      }

      setAddingFriend(true);
      try {
          const friendName = await addFriend(currentUser.id, friendCode.trim().toUpperCase());
          showAlert("Başarılı", `${friendName} arkadaş olarak eklendi!`, "success");
          setFriendCode('');
          fetchFriends(currentUser.id);
      } catch (err: any) {
          showAlert("Hata", err.message || "Arkadaş eklenemedi.", "error");
      } finally {
          setAddingFriend(false);
      }
  };
  
  const copyFriendCode = () => {
      if (profile.friendCode) {
          navigator.clipboard.writeText(profile.friendCode);
          showAlert("Kopyalandı", "Arkadaş kodun kopyalandı.", "success");
      }
  };
  
  // ... rest of the render code (same as original file) ...
  const avatarData = AVATARS.find(a => a.icon === profile.avatar);
  const frameDef = FRAMES.find(f => f.id === profile.frame) || FRAMES[0];
  const backgroundDef = BACKGROUNDS.find(b => b.id === profile.background) || BACKGROUNDS[0];
  
  const unlockedBadges = useMemo(() => {
      if (!stats?.badges) return [];
      const reversedIds = [...stats.badges].reverse();
      return reversedIds
        .map(id => BADGES.find(b => b.id === id))
        .filter((b): b is Badge => b !== undefined);
  }, [stats?.badges, BADGES]);

  const completedQuestsCount = dailyQuests.filter(q => q.isCompleted).length;

  const onAuthSuccess = () => {
      const userProfile = getUserProfile();
      setProfile(userProfile);
      if (onProfileUpdate) onProfileUpdate();
      setShowAuthModal(false);
      getAuthInstance().currentUser.then(user => {
          if (!userProfile.isGuest && user) {
              fetchFriends(user.id);
          }
      });
  };

  return (
    <>
    {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={onAuthSuccess} />}
    
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-32">
      
      <div className="rounded-[2rem] shadow-xl border overflow-hidden transition-colors relative" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)'}}>
        
        {!isEditing && (
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button 
                    onClick={() => setIsEditing(true)} 
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
                >
                    Düzenle
                </button>
            </div>
        )}

        <div className="p-6 text-center">
          <div className="mb-4 flex justify-center relative z-0">
             <button onClick={() => !isEditing && setShowAvatarModal(true)} className={`relative w-32 h-32 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center z-10 ${profile.frame === 'frame_none' ? 'shadow-lg' : ''}`}>
                 <div className={`absolute inset-0 w-full h-full rounded-full pointer-events-none z-30 ${frameDef.style}`}></div>
                <div className={`absolute inset-0 w-full h-full rounded-full z-10 ${backgroundDef.style}`}></div>
                <div className={`w-full h-full rounded-full flex items-center justify-center text-5xl overflow-hidden relative z-20 bg-transparent`}>
                    {avatarData?.image && !avatarLoadError ? (
                         <img src={avatarData.image} alt={avatarData.name} className="w-full h-full object-cover scale-[1.01]" onError={() => setAvatarLoadError(true)} />
                    ) : (
                        profile.avatar && (profile.avatar.startsWith('http') || profile.avatar.startsWith('data:') || profile.avatar.startsWith('/')) && !avatarLoadError ? (
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover scale-[1.01]" onError={() => setAvatarLoadError(true)} />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center bg-transparent`}>
                                <span className="filter drop-shadow-md transform transition-transform group-hover:scale-110 leading-none flex items-center justify-center h-full w-full">
                                    {avatarData?.icon || profile.avatar || <User size={40} />}
                                </span>
                            </div>
                        )
                    )}
                </div>
             </button>
          </div>

          {!isEditing && (
               <div className="flex flex-col items-center animate-in fade-in mt-2">
                 
                 <div className="mb-2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center gap-1">
                    <Star size={10} className="fill-current" />
                    <span>LVL {stats?.level || 1}</span>
                 </div>

                 <div className="relative flex items-center justify-center mb-1 w-full max-w-xs">
                     <h2 className="text-2xl font-black tracking-tight text-center truncate px-2" style={{color: 'var(--color-text-main)'}}>{profile.name || 'Öğrenci'}</h2>
                 </div>
                 
                 {profile.isGuest ? (
                      <div className="mb-4 flex items-center gap-2">
                         <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                             <Ghost size={12} /> Misafir Modu
                         </span>
                         <button onClick={handleGuestSignup} className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-1">
                            <LogIn size={10} /> Giriş Yap - Kaydol
                         </button>
                     </div>
                 ) : (
                     <div className="mb-4 flex items-center gap-2">
                         <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">Online</span>
                         <button onClick={logoutUser} className="text-[10px] font-bold text-red-500 hover:underline flex items-center gap-1">
                            <LogOut size={10} /> Çıkış
                         </button>
                     </div>
                 )}

                 <div className={`font-bold text-xs mb-6 px-3 py-1 rounded-full border ${visuals.bg} ${visuals.border} ${visuals.text}`}>
                   {profile.grade ? (
                       ['A1','A2','B1','B2','C1'].includes(profile.grade) ? `${profile.grade} Seviye` : `${profile.grade}. Sınıf`
                   ) : 'Sınıf Seçilmedi'}
                 </div>
                 
                 {/* Stats Grid - UPDATED FOR VISIBILITY */}
                 <div className="grid grid-cols-3 gap-2 w-full mb-6 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col items-center justify-center">
                        <Flame size={24} className="text-orange-500 mb-1 fill-orange-500" />
                        <div className="text-lg font-black leading-none mb-0.5" style={{color: 'var(--color-text-main)'}}>{stats?.streak || 0}</div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Gün Seri</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-x border-slate-200 dark:border-slate-700 px-2">
                        <Trophy size={24} className="text-indigo-500 mb-1 fill-indigo-500" />
                        <div className="text-lg font-black leading-none mb-0.5" style={{color: 'var(--color-text-main)'}}>{stats?.xp || 0}</div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Toplam XP</span>
                    </div>
                     <div className="flex flex-col items-center justify-center">
                        <Star size={24} className="text-yellow-500 mb-1 fill-yellow-500" />
                        <div className="text-lg font-black leading-none mb-0.5" style={{color: 'var(--color-text-main)'}}>{unlockedBadges.length}</div>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Rozet</span>
                    </div>
                 </div>
                 
                 <button onClick={() => setShowStatsModal(true)} className="w-full mb-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                     <BarChart2 size={16} /> Detaylı İstatistikler
                 </button>

                 <button id="market-button"
                    onClick={onOpenMarket}
                    className="w-full mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-3 shadow-md relative overflow-hidden active:scale-[0.99] transition-transform group flex items-center justify-between"
                 >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/20 transition-colors"></div>
                     <div className="text-left z-10">
                         <div className="flex items-center gap-2 text-yellow-100 font-bold text-[10px] uppercase tracking-wide mb-0.5">
                             <ShoppingBag size={12} /> Mağaza
                         </div>
                         <div className="text-lg font-black text-white">Kozmetikler</div>
                         <div className="text-yellow-100 text-[10px] font-medium">Temalar, çerçeveler ve arka planlar</div>
                     </div>
                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform z-10 shrink-0">
                         <Star size={16} className="fill-white ml-0.5 text-white" />
                     </div>
                 </button>
                 
                 <button 
                     onClick={() => setShowLeaderboard(true)}
                     className="w-full mb-6 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-3 shadow-sm active:scale-[0.99] transition-all flex items-center justify-between group hover:border-indigo-300 dark:hover:border-indigo-700"
                 >
                     <div className="text-left flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                             <Trophy size={20} />
                         </div>
                         <div>
                             <div className="text-sm font-black text-slate-800 dark:text-white">Lider Tablosu</div>
                             <div className="text-xs text-slate-500 dark:text-slate-400">Sıralamanı gör</div>
                         </div>
                     </div>
                     <div className="text-indigo-500">
                         <ChevronDown className="-rotate-90" />
                     </div>
                 </button>
                
                {dailyQuests.length > 0 && (
                    <div className="w-full mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                         <button 
                            onClick={() => setIsQuestsOpen(!isQuestsOpen)}
                            className="w-full p-3 flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                    <Target size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Günlük Görevler</h3>
                                <span className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${completedQuestsCount === dailyQuests.length ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    {completedQuestsCount}/{dailyQuests.length}
                                </span>
                            </div>
                            {isQuestsOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>
                        
                        {isQuestsOpen && (
                            <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 animate-in slide-in-from-top-2">
                                <div className="space-y-2 pt-3">
                                    {dailyQuests.map((quest) => (
                                        <div key={quest.id} className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={`min-w-[2rem] px-1.5 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors
                                                    ${quest.isCompleted ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
                                                `}>
                                                    {quest.isCompleted ? <CheckCircle size={12} /> : `${quest.current}/${quest.target}`}
                                                </div>
                                                <div className="truncate">
                                                    <div className={`text-[10px] font-medium truncate ${quest.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                                        {quest.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-[10px] font-bold ml-2 whitespace-nowrap ${quest.isCompleted ? 'text-green-500' : 'text-orange-500'}`}>
                                                {quest.isCompleted ? 'Tamamlandı' : `+${quest.rewardXP} XP`}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                 )}

                <div className="w-full mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <button 
                        onClick={() => setIsAchievementsOpen(!isAchievementsOpen)}
                        className="w-full p-3 flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                                <ShieldCheck size={16} />
                            </div>
                            <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Başarımlarım</h3>
                            <span className="ml-2 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{unlockedBadges.length}</span>
                        </div>
                        {isAchievementsOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </button>

                    {isAchievementsOpen && (
                        <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 animate-in slide-in-from-top-2">
                             {unlockedBadges.length > 0 ? (
                                <div className="grid grid-cols-5 gap-2 pt-3">
                                    {unlockedBadges.map((badge, index) => (
                                        <div 
                                            key={badge.id} 
                                            className="relative group flex justify-center"
                                            onClick={() => setTooltipBadgeId(tooltipBadgeId === badge.id ? null : badge.id)}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shadow-sm hover:scale-110 transition-transform cursor-pointer hover:border-yellow-300 dark:hover:border-yellow-500 overflow-hidden">
                                                {/* FIX: Check if badge.icon is a string before calling startsWith to avoid runtime errors. */}
                                                {badge.image ? (
                                                    <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    (typeof badge.icon === 'string' && (badge.icon.startsWith('http') || badge.icon.startsWith('data:') || badge.icon.startsWith('/'))) ? (
                                                        <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="flex items-center justify-center w-full h-full leading-none">{badge.icon}</span>
                                                    )
                                                )}
                                            </div>
                                            {/* Tooltip */}
                                            {tooltipBadgeId === badge.id && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                                                    {badge.name}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-slate-400 italic py-4 text-center">Henüz hiç rozet kazanılmadı.</div>
                            )}
                        </div>
                    )}
                </div>
                
                {/* Friends Section - Only for logged in users */}
                {!profile.isGuest && (
                    <div className="w-full mb-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <button 
                            onClick={() => setIsFriendsOpen(!isFriendsOpen)}
                            className="w-full p-3 flex items-center justify-between group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                    <Users size={16} />
                                </div>
                                <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Arkadaşlarım</h3>
                                <span className="ml-2 text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{friendsList.length}</span>
                            </div>
                            {isFriendsOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>

                        {isFriendsOpen && (
                            <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 animate-in slide-in-from-top-2">
                                {/* Add Friend Form */}
                                <form onSubmit={handleAddFriend} className="flex gap-2 mt-3 mb-4">
                                    <input 
                                        type="text" 
                                        value={friendCode}
                                        onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                                        placeholder="Arkadaş Kodu (Örn: A1B2C3)"
                                        className="flex-1 p-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-indigo-500 uppercase font-bold"
                                        maxLength={6}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={addingFriend || !friendCode}
                                        className="px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center justify-center min-w-[40px]"
                                    >
                                        {addingFriend ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <UserPlus size={16} />}
                                    </button>
                                </form>
                                
                                {/* My Friend Code */}
                                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Senin Kodun</span>
                                        <span className="text-sm font-mono font-black tracking-widest text-slate-700 dark:text-slate-200 select-all">{profile.friendCode || '------'}</span>
                                    </div>
                                    <button onClick={copyFriendCode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors" title="Kodu Kopyala">
                                        <Copy size={16} />
                                    </button>
                                </div>

                                {/* Friends List */}
                                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {friendsLoading ? (
                                        <div className="text-center py-4 text-xs text-slate-400">Yükleniyor...</div>
                                    ) : friendsList.length > 0 ? (
                                        friendsList.map((friend) => {
                                            const fAvatar = AVATARS.find(a => a.icon === friend.avatar) || AVATARS[0];
                                            const fFrame = FRAMES.find(f => f.id === friend.frame) || FRAMES[0];
                                            const fBg = BACKGROUNDS.find(b => b.id === friend.background) || BACKGROUNDS[0];
                                            const friendTheme = THEME_COLORS[friend.theme as any] || THEME_COLORS['dark'];
                                            
                                            return (
                                                <div key={friend.uid} className="flex items-center justify-between p-2 rounded-xl border shadow-sm transition-all hover:brightness-95"
                                                     style={{
                                                         backgroundColor: friendTheme.bgCard,
                                                         borderColor: friendTheme.border
                                                     }}
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="relative w-10 h-10 shrink-0">
                                                            <div className={`absolute inset-0 w-full h-full rounded-full z-30 pointer-events-none ${fFrame.style} scale-90`}></div>
                                                            <div className={`absolute inset-0 w-full h-full rounded-full z-10 ${fBg.style} scale-90`}></div>
                                                            <div className="w-full h-full rounded-full overflow-hidden relative z-20 flex items-center justify-center text-lg bg-transparent scale-90">
                                                                {fAvatar.image ? <img src={fAvatar.image} className="w-full h-full object-cover" /> : <span>{fAvatar.icon}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs font-bold truncate" style={{color: friendTheme.textMain}}>{friend.name}</div>
                                                            <div className="text-[9px] truncate" style={{color: friendTheme.textMuted}}>Lvl {friend.level} • {friend.grade === 'GENERAL' ? 'Genel' : `${friend.grade}. Sınıf`}</div>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => onViewProfile(friend.uid)}
                                                        className="text-[10px] font-bold hover:underline px-2 shrink-0"
                                                        style={{color: friendTheme.primary}}
                                                    >
                                                        Profil
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-4 text-xs text-slate-400">Henüz arkadaş eklemedin.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex gap-3 w-full mt-auto pt-4 pb-6">
                    <button 
                        onClick={onBack}
                        className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all active:scale-[0.98]"
                    >
                        Geri Dön
                    </button>
                </div>

           </div>
          )}
          
          {/* Edit Mode Form (Overlay) */}
          {isEditing && (
             <div className="px-6 pb-6 w-full animate-in fade-in">
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">İsim</label>
                          <input 
                             type="text" 
                             name="name"
                             value={profile.name}
                             onChange={handleChange}
                             className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 dark:text-white"
                          />
                      </div>
                      
                      <div>
                          <CustomSelect 
                              options={gradeOptions}
                              value={profile.grade}
                              onChange={handleGradeChange}
                              label="Sınıf / Seviye"
                              icon={<GraduationCap size={18} />}
                          />
                      </div>
                  </div>
                  
                  <div className="w-full mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 pb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Hesap İşlemleri</h4>
                        {currentUser && (
                             <button onClick={handleResetPassword} className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                 <KeyRound size={14} /> Şifre Sıfırla
                             </button>
                        )}
                        <button onClick={handleDeleteAccount} className="w-full py-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-bold text-xs hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors flex items-center justify-center gap-2">
                             <Trash2 size={14} /> Hesabı Sil
                        </button>
                  </div>
                  
                  <div className="flex gap-3 w-full pt-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            disabled={isSaving}
                            className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold transition-all active:scale-[0.98]"
                        >
                            İptal
                        </button>
                         <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isSaving ? 'Kaydediliyor...' : <><Save size={18} /> Kaydet</>}
                        </button>
                  </div>
             </div>
          )}

        </div>
      </div>

      </div>
      {showStatsModal && <StatsModal onClose={() => setShowStatsModal(false)} currentGrade={profile.grade as any} />}
      {showAvatarModal && <AvatarModal onClose={() => setShowAvatarModal(false)} userStats={stats!} onUpdate={() => { setProfile(getUserProfile()); if(onProfileUpdate) onProfileUpdate(); }} />}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} currentUserXP={stats?.xp || 0} currentUserGrade={profile.grade} />}
    </>
  );
};

export default Profile;