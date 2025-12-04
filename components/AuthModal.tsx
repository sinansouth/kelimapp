import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Lock, User, Check, GraduationCap, Ghost, Mail, HelpCircle } from 'lucide-react';
import { loginUser, registerUser, resetUserPassword, getUserData, syncLocalToCloud, getAuthInstance } from '../services/firebase';
import { createGuestProfile, getUserProfile, getUserStats, clearLocalUserData, overwriteLocalWithCloud, saveUserProfile } from '../services/userService';
import CustomSelect from './CustomSelect';
import DataConflictModal from './DataConflictModal';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  initialView?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, initialView = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Conflict State
  const [conflictData, setConflictData] = useState<any>(null);

  useEffect(() => {
      setMode(initialView);
  }, [initialView]);

  // Options for CustomSelect
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

  const handleClose = () => {
      // If user is not logged in (profile name is empty) and tries to close,
      // treat it as a Guest Login to prevent "Student" default profile issues.
      const profile = getUserProfile();
      if (!profile.name) {
          handleGuestLogin();
      } else {
          onClose();
      }
  };

  const handleConflictChoice = async (choice: 'local' | 'cloud') => {
      const auth = getAuthInstance();
      if (!auth.currentUser || !conflictData) return;

      setLoading(true);
      try {
          if (choice === 'local') {
              // Overwrite Cloud with Local
              // IMPORTANT: Ensure we are not a guest anymore
              const currentProfile = getUserProfile();
              const updatedProfile = { ...currentProfile, isGuest: false };
              saveUserProfile(updatedProfile);
              
              await syncLocalToCloud(auth.currentUser.uid);
          } else {
              // Overwrite Local with Cloud
              // Ensure cloud data doesn't accidentally bring back isGuest=true
              if (conflictData.profile) {
                  conflictData.profile.isGuest = false;
              }
              overwriteLocalWithCloud(conflictData);
          }
          onSuccess();
          onClose();
      } catch (e) {
          console.error(e);
          setError("Veri senkronizasyon hatası.");
      } finally {
          setLoading(false);
          setConflictData(null);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    // FORGOT PASSWORD FLOW
    if (mode === 'forgot') {
        if (!email) {
            setError("Lütfen e-posta adresinizi girin.");
            return;
        }
        setLoading(true);
        try {
            await resetUserPassword(email);
            setSuccessMsg("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. (Lütfen spam/gereksiz kutusunu da kontrol ediniz)");
            setTimeout(() => setMode('login'), 4000);
        } catch (err: any) {
            setError("E-posta gönderilemedi. Adresi kontrol edin.");
        } finally {
            setLoading(false);
        }
        return;
    }

    // LOGIN FLOW
    if (mode === 'login') {
         if (!name || !password) { 
             setError("Lütfen tüm alanları doldurun.");
             return;
         }

         setLoading(true);
         try {
            await loginUser(name, password, rememberMe);
            const auth = getAuthInstance();
            
            if (auth.currentUser) {
                // Check for data conflict
                const localStats = getUserStats();
                const cloudData = await getUserData(auth.currentUser.uid);
                const lastUid = localStorage.getItem('lgs_last_uid');
                
                // If we have significant local progress (XP > 0) AND cloud data exists
                // AND they are different people (UID doesn't match last UID stored or generic check)
                if (localStats.xp > 0 && cloudData && cloudData.stats && lastUid !== auth.currentUser.uid) {
                    setConflictData(cloudData); // Trigger Modal
                } else if (cloudData) {
                    // Just download cloud data if no local conflict
                    // This fixes the issue where a guest logging in would still see guest data
                    // unless overwritten by cloud data
                    
                    // CRITICAL FIX: Ensure cloud profile isn't marked as guest
                    if (cloudData.profile) {
                        cloudData.profile.isGuest = false;
                    }
                    
                    overwriteLocalWithCloud(cloudData);
                    localStorage.setItem('lgs_last_uid', auth.currentUser.uid);
                    onSuccess();
                    onClose();
                } else {
                    // No cloud data (new user or wiped), upload local
                    // CRITICAL FIX: Update local profile to remove isGuest before syncing
                    const currentProfile = getUserProfile();
                    const updatedProfile = { ...currentProfile, isGuest: false };
                    saveUserProfile(updatedProfile);

                    await syncLocalToCloud(auth.currentUser.uid);
                    localStorage.setItem('lgs_last_uid', auth.currentUser.uid);
                    onSuccess();
                    onClose();
                }
            }

         } catch (err: any) {
            console.error(err);
            setError("Giriş başarısız. Kullanıcı adı/E-posta veya şifre hatalı.");
            setLoading(false);
         }
         return;
    }

    // REGISTER FLOW
    if (mode === 'register') {
        if (!grade) {
            setError("Lütfen sınıfınızı seçin.");
            return;
        }

        if (name.length < 3) {
            setError("Kullanıcı adı en az 3 karakter olmalıdır.");
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError("Geçerli bir e-posta adresi giriniz.");
            return;
        }

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        setLoading(true);
        try {
            // Register flow automatically syncs local data to the new account
            await registerUser(name, email, password, grade);
            const auth = getAuthInstance();
            if(auth.currentUser) {
                 localStorage.setItem('lgs_last_uid', auth.currentUser.uid);
            }
            
            alert("Kayıt başarılı! Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayarak hesabınızı aktifleştirin. (Lütfen spam/gereksiz kutusunu da kontrol ediniz)");
            onSuccess();
            onClose(); 
        } catch (err: any) {
            console.error(err);
            if (err.message.includes("email-already-in-use")) {
                setError("Bu e-posta adresi zaten kullanılıyor.");
            } else {
                setError(err.message || "Kayıt oluşturulamadı. Lütfen tekrar deneyin.");
            }
        } finally {
            setLoading(false);
        }
    }
  };

  const handleGuestLogin = () => {
      if (mode === 'login' && !grade) {
             createGuestProfile('A1');
             onSuccess();
             onClose();
             return;
      }
      
      if (!grade) {
          setError("Misafir olmak için lütfen bir sınıf seçin.");
          return;
      }
      
      createGuestProfile(grade);
      onSuccess();
      onClose();
  };

  if (conflictData) {
      const localStats = getUserStats();
      return (
          <DataConflictModal 
              localXP={localStats.xp}
              localLevel={localStats.level}
              cloudXP={conflictData.stats?.xp || 0}
              cloudLevel={conflictData.stats?.level || 1}
              onChooseLocal={() => handleConflictChoice('local')}
              onChooseCloud={() => handleConflictChoice('cloud')}
          />
      );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="relative bg-indigo-600 p-6 text-center">
           <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-white mb-1">
                {mode === 'login' ? 'Giriş Yap' : mode === 'register' ? 'Kayıt Ol' : 'Şifre Sıfırla'}
            </h2>
            <p className="text-indigo-100 text-sm">
                {mode === 'login' ? 'Hesabına erişmek için bilgilerini gir.' : mode === 'register' ? 'İlerlemeni kaydetmek için bir hesap oluştur.' : 'E-posta adresini gir.'}
            </p>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {mode === 'login' && (
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kullanıcı Adı veya E-posta</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                placeholder="Kullanıcı adı veya e-posta"
                                required
                                autoCapitalize="none"
                                autoCorrect="off"
                            />
                        </div>
                    </div>
                )}

                {mode === 'register' && (
                    <>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Kullanıcı Adı</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                placeholder="Kullanıcı adı"
                                required
                                autoCapitalize="none"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                placeholder="ornek@mail.com"
                                required
                            />
                        </div>
                    </div>
                    </>
                )}

                {mode === 'forgot' && (
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                placeholder="Hesabına bağlı e-posta"
                                required
                            />
                        </div>
                    </div>
                )}

                {mode !== 'forgot' && (
                    <div>
                        <div className="flex justify-between items-center mb-1">
                             <label className="text-xs font-bold text-slate-500 uppercase ml-1">Şifre</label>
                             {mode === 'login' && (
                                 <button type="button" onClick={() => setMode('forgot')} className="text-[10px] text-indigo-500 font-bold hover:underline">Şifremi Unuttum?</button>
                             )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                placeholder="******"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                )}

                {(mode === 'register' || (mode === 'login')) && (
                     <div className="relative z-20">
                        <CustomSelect 
                            options={gradeOptions}
                            value={grade}
                            onChange={setGrade}
                            placeholder="Seçiniz"
                            label={`Sınıf / Seviye ${mode === 'login' ? '(Misafir Girişi İçin)' : ''}`}
                            icon={<GraduationCap size={18} />}
                        />
                    </div>
                )}

                {mode === 'login' && (
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setRememberMe(!rememberMe)}
                            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                                {rememberMe && <Check size={14} strokeWidth={3} />}
                            </div>
                            Beni Hatırla
                        </button>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm font-medium text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}
                
                {successMsg && (
                     <div className="text-green-500 text-sm font-medium text-center bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800">
                        {successMsg}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {loading ? 'İşleniyor...' : (mode === 'login' ? <><LogIn size={18} /> Giriş Yap</> : mode === 'register' ? <><UserPlus size={18} /> Kayıt Ol</> : 'Şifreyi Sıfırla')}
                </button>
            </form>

            {mode !== 'forgot' && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-center">
                    <button 
                        type="button"
                        onClick={handleGuestLogin}
                        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    >
                        <Ghost size={18} /> Misafir Olarak Devam Et
                    </button>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {mode === 'login' ? "Hesabın yok mu?" : "Zaten hesabın var mı?"}
                        <button 
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }}
                            className="ml-2 font-bold text-indigo-600 hover:underline"
                        >
                            {mode === 'login' ? "Kayıt Ol" : "Giriş Yap"}
                        </button>
                    </p>
                </div>
            )}
            
            {mode === 'forgot' && (
                 <div className="mt-4 text-center">
                     <button 
                        onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                        className="text-sm font-bold text-indigo-600 hover:underline"
                     >
                         Giriş Ekranına Dön
                     </button>
                 </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default AuthModal;