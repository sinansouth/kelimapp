
import React, { useState } from 'react';
import { X, Layers, GraduationCap, FileBox } from 'lucide-react';
import { UNIT_ASSETS } from '../data/assets';
import { GradeLevel } from '../types';

interface ResetScopeModalProps {
  onClose: () => void;
  onConfirm: (scope: { type: 'all' | 'grade' | 'unit', value?: string }) => void;
  title: string;
}

const ResetScopeModal: React.FC<ResetScopeModalProps> = ({ onClose, onConfirm, title }) => {
  const [step, setStep] = useState<'type' | 'grade' | 'unit'>('type');
  const [selectedType, setSelectedType] = useState<'all' | 'grade' | 'unit'>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  
  const grades: GradeLevel[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'A1', 'A2', 'B1', 'B2', 'C1'];

  const handleTypeSelect = (type: 'all' | 'grade' | 'unit') => {
      if (type === 'all') {
          onConfirm({ type: 'all' });
      } else {
          setSelectedType(type);
          setStep('grade');
      }
  };

  const handleGradeSelect = (grade: string) => {
      if (selectedType === 'grade') {
          onConfirm({ type: 'grade', value: grade });
      } else {
          setSelectedGrade(grade);
          setStep('unit');
      }
  };

  const handleUnitSelect = (unitId: string) => {
      onConfirm({ type: 'unit', value: unitId });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[80vh]">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white truncate pr-4">{title}</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <X size={20} />
            </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
            
            {step === 'type' && (
                <div className="space-y-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Hangi verileri silmek istersin?</p>
                    
                    <button onClick={() => handleTypeSelect('all')} className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-4 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Layers size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-white">Tüm Uygulama</div>
                            <div className="text-xs text-slate-400">Bütün veriler silinir.</div>
                        </div>
                    </button>

                    <button onClick={() => handleTypeSelect('grade')} className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-4 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-white">Belirli Bir Sınıf</div>
                            <div className="text-xs text-slate-400">Seçilen sınıfa ait tüm veriler.</div>
                        </div>
                    </button>

                    <button onClick={() => handleTypeSelect('unit')} className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-4 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <FileBox size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800 dark:text-white">Belirli Bir Ünite</div>
                            <div className="text-xs text-slate-400">Sadece tek bir ünite verisi.</div>
                        </div>
                    </button>
                </div>
            )}

            {step === 'grade' && (
                <div className="space-y-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Sınıf Seçiniz:</p>
                    <div className="grid grid-cols-3 gap-2">
                        {grades.map(g => (
                            <button 
                                key={g} 
                                onClick={() => handleGradeSelect(g)}
                                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 font-bold text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'unit' && (
                <div className="space-y-2">
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Ünite Seçiniz ({selectedGrade}. Sınıf):</p>
                     {UNIT_ASSETS[selectedGrade as GradeLevel]?.length > 0 ? (
                        <div className="space-y-2">
                            {UNIT_ASSETS[selectedGrade as GradeLevel].map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => handleUnitSelect(u.id)}
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 text-left font-medium text-sm text-slate-700 dark:text-slate-300 transition-colors truncate"
                                >
                                    {u.unitNo} - {u.title}
                                </button>
                            ))}
                        </div>
                     ) : (
                         <div className="text-center text-slate-400 py-4">Bu sınıf için ünite bulunamadı.</div>
                     )}
                </div>
            )}

        </div>

      </div>
    </div>
  );
};

export default ResetScopeModal;
