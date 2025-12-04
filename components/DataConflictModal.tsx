
import React from 'react';
import { Cloud, Smartphone, ArrowRight, AlertTriangle } from 'lucide-react';

interface DataConflictModalProps {
  localXP: number;
  cloudXP: number;
  localLevel: number;
  cloudLevel: number;
  onChooseLocal: () => void;
  onChooseCloud: () => void;
}

const DataConflictModal: React.FC<DataConflictModalProps> = ({ 
  localXP, cloudXP, localLevel, cloudLevel, onChooseLocal, onChooseCloud 
}) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        <div className="bg-orange-500 p-5 text-center text-white">
            <AlertTriangle size={40} className="mx-auto mb-2" />
            <h2 className="text-xl font-black">Veri Çakışması</h2>
            <p className="text-sm opacity-90 font-medium">Hangi verilerle devam etmek istersin?</p>
        </div>

        <div className="p-6">
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 text-center">
                Cihazında kayıtlı olan misafir verileri ile buluttaki hesabının verileri farklı. Lütfen hangisini kullanmak istediğini seç. 
                <br/><span className="text-red-500 font-bold text-xs block mt-2">Dikkat: Seçilmeyen veri silinecektir!</span>
            </p>

            <div className="flex gap-4">
                <button 
                    onClick={onChooseLocal}
                    className="flex-1 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 transition-all group text-left relative overflow-hidden"
                >
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        <Smartphone size={14} /> Cihazdaki
                    </div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{localXP} XP</div>
                    <div className="text-xs font-bold text-slate-400">Seviye {localLevel}</div>
                    <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
                        <ArrowRight size={20} />
                    </div>
                </button>

                <button 
                    onClick={onChooseCloud}
                    className="flex-1 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 bg-slate-50 dark:bg-slate-800 transition-all group text-left relative overflow-hidden"
                >
                     <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        <Cloud size={14} /> Buluttaki
                    </div>
                    <div className="text-2xl font-black text-green-600 dark:text-green-400">{cloudXP} XP</div>
                    <div className="text-xs font-bold text-slate-400">Seviye {cloudLevel}</div>
                     <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-green-500">
                        <ArrowRight size={20} />
                    </div>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataConflictModal;
