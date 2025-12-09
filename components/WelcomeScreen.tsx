
import React from 'react';
import { Ghost, LogIn, UserPlus, ArrowRight, Gamepad2 } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister, onGuest }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 dark:bg-slate-900 flex flex-col animate-in fade-in duration-300">
        
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
             
             {/* Logo Container with Animation */}
             <div className="relative mb-8 group">
                 <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
                 <div className="w-36 h-36 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 relative bg-white dark:bg-slate-800 transform group-hover:scale-105 transition-transform duration-500 border border-slate-100 dark:border-slate-700">
                     <img 
                        src="https://8upload.com/image/4864223e0a7b82f8/AppLogo.png" 
                        alt="KelimApp Logo" 
                        className="w-full h-full object-cover rounded-[2rem]"
                     />
                 </div>
             </div>
             
             <h1 className="text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
                 Kelim<span className="text-indigo-600">App</span>
             </h1>
             
             <p className="text-slate-600 dark:text-slate-400 font-medium text-lg max-w-xs leading-relaxed">
                 Oyunlarla İngilizce öğrenmenin en eğlenceli yolu.
             </p>
        </div>

        {/* Actions Area */}
        <div className="p-6 pb-12 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 relative">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-8"></div>
            
            <div className="max-w-md mx-auto space-y-4">
                {/* Primary Action: Guest Login */}
                <button 
                    onClick={onGuest}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <div className="p-2 bg-white/20 rounded-xl">
                        <Ghost size={24} className="group-hover:rotate-12 transition-transform" /> 
                    </div>
                    <span>Hemen Başla (Misafir)</span>
                    <ArrowRight size={20} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-slate-950 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hesabın Varsa</span>
                    </div>
                </div>

                {/* Secondary Actions: Login / Register */}
                <div className="grid grid-cols-2 gap-3">
                     <button 
                        onClick={onLogin}
                        className="py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300"
                     >
                         <LogIn size={18} /> Giriş Yap
                     </button>
                     <button 
                        onClick={onRegister}
                        className="py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300"
                     >
                         <UserPlus size={18} /> Kayıt Ol
                     </button>
                </div>
            </div>
            
            <p className="text-center text-[10px] text-slate-400 mt-6 max-w-xs mx-auto">
                Devam ederek Kullanım Koşulları ve Gizlilik Politikasını kabul etmiş olursunuz.
            </p>
            
        </div>
    </div>
  );
};

export default WelcomeScreen;
