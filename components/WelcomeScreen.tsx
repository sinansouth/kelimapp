
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
                    {/* Actions Area */}
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={onLogin}
                            className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <LogIn size={20} /> Giriş Yap
                        </button>
                        <button
                            onClick={onRegister}
                            className="py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-lg hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            <UserPlus size={20} /> Kayıt Ol
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
