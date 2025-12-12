import React from 'react';
import { GraduationCap } from 'lucide-react';

const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-80"></div>
            <div className="absolute top-[-20%] right-[-20%] w-[80vh] h-[80vh] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-20%] w-[80vh] h-[80vh] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    <div className="w-32 h-32 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-in zoom-in duration-500">
                        <GraduationCap size={64} className="text-white" />
                    </div>
                    {/* Ring Animation */}
                    <div className="absolute inset-0 border-4 border-indigo-400/30 rounded-3xl animate-[ping_3s_ease-in-out_infinite]"></div>
                </div>

                <div className="mt-8 text-center animate-in slide-in-from-bottom-8 duration-700 fade-in">
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
                        Kelim<span className="text-indigo-400">App</span>
                    </h1>
                    <p className="text-indigo-200 text-sm font-medium tracking-widest uppercase opacity-80">
                        İngilizce Öğrenmenin En Kolay Yolu
                    </p>
                </div>

                {/* Loading Indicator */}
                <div className="mt-12 w-48 h-1.5 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-[50%] animate-[shimmer_1.5s_infinite_linear] rounded-full relative">
                        <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 text-slate-500 text-xs font-medium animate-in fade-in duration-1000 delay-300">
                Veriler Hazırlanıyor...
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(250%); }
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
