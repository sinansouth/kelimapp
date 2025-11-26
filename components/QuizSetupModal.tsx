import React from 'react';
import { Target, Play, X } from 'lucide-react';

interface QuizSetupModalProps {
  onClose: () => void;
  onStart: (count: number) => void;
  totalWords: number;
  title: string;
}

const QuizSetupModal: React.FC<QuizSetupModalProps> = ({ onClose, onStart, totalWords, title }) => {
  const options = [10, 25, 50, -1]; // -1 represents 'ALL'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)'}}>
        
        <div className="bg-indigo-600 p-6 text-center relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                <X size={24} />
            </button>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-lg">
                <Target size={32} />
            </div>
            <h2 className="text-xl font-black text-white mb-1">Quiz Hazırlığı</h2>
            <p className="text-indigo-100 text-sm truncate px-4">{title}</p>
        </div>

        <div className="p-6">
            <p className="text-center mb-6 font-medium" style={{color: 'var(--color-text-main)'}}>
                Kaç soru çözmek istersin?
                <span className="block text-xs mt-1 font-normal" style={{color: 'var(--color-text-muted)'}}>(Toplam {totalWords} kelime mevcut)</span>
            </p>

            <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => {
                    const label = opt === -1 ? "TÜMÜ" : opt.toString();
                    const isDisabled = opt !== -1 && opt > totalWords;
                    
                    return (
                        <button
                            key={opt}
                            onClick={() => onStart(opt)}
                            disabled={isDisabled}
                            className={`p-4 rounded-xl border-2 font-black text-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-1
                                ${isDisabled 
                                    ? 'opacity-50 cursor-not-allowed' 
                                    : 'hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                }`}
                            style={isDisabled ? 
                                {borderColor: 'var(--color-border)', color: 'var(--color-text-muted)'} : 
                                {borderColor: 'var(--color-border)', color: 'var(--color-text-main)'}
                            }
                        >
                            {label}
                            {opt === -1 && totalWords > 50 && (
                                <span className="text-[10px] font-normal text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">Uzun Sürer</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

      </div>
    </div>
  );
};

export default QuizSetupModal;