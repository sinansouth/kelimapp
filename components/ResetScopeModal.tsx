
import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface ResetScopeModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ResetScopeModal: React.FC<ResetScopeModalProps> = ({ onClose, onConfirm, title }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-red-50 dark:bg-red-900/10">
            <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle size={20} /> {title}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                    <Trash2 size={32} />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2">Emin misiniz?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Bu işlem <strong>geri alınamaz</strong>.
                </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs space-y-2 mb-6 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
                    Silinecek Veriler:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Tüm XP, Seviye ve Rozetler</li>
                    <li>Günlük Seri (Streak)</li>
                    <li>Satın alınan temalar ve çerçeveler</li>
                    <li>Ezberlenen ve Favori kelimeler</li>
                    <li>Oyun skorları ve İstatistikler</li>
                </ul>
                <p className="font-bold text-green-600 dark:text-green-400 pt-2 mt-2 border-t border-slate-200 dark:border-slate-700">
                    Korunacak Veriler:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                    <li>Kullanıcı Adı ve Şifre</li>
                    <li>Sınıf Seviyesi</li>
                    <li>Arkadaş Kodu</li>
                </ul>
            </div>

            <button 
                onClick={onConfirm}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <Trash2 size={18} /> Tüm Verileri Sıfırla
            </button>
            
            <button 
                onClick={onClose}
                className="w-full mt-3 py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-sm transition-colors"
            >
                İptal Et
            </button>
        </div>

      </div>
    </div>
  );
};

export default ResetScopeModal;
