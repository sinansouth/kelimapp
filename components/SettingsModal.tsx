import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { AppSettings, getAppSettings, saveAppSettings } from '../services/userService';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<AppSettings>({ soundEnabled: true, theme: 'dark' });

  useEffect(() => {
      setSettings(getAppSettings());
  }, []);

  const toggleSound = () => {
      const newSettings = { ...settings, soundEnabled: !settings.soundEnabled };
      setSettings(newSettings);
      saveAppSettings(newSettings);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h2 className="text-lg font-black text-slate-800 dark:text-white">Ayarlar</h2>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${settings.soundEnabled ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                        {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 dark:text-white text-sm">Ses Efektleri</div>
                    </div>
                </div>
                <button 
                    onClick={toggleSound}
                    className={`w-10 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.soundEnabled ? 'left-5' : 'left-1'}`}></div>
                </button>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-800/30 text-center">
                <p className="text-[10px] text-yellow-700 dark:text-yellow-500 font-medium">
                    Temalar ve diğer özellikler için <strong>XP Market</strong>'i ziyaret et!
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;