
import React from 'react';
import { UnitDef } from '../types';
import { getGrammarForUnit } from '../data/grammarContent';
import { BookOpen } from 'lucide-react';

interface GrammarViewProps {
  unit: UnitDef;
  onBack: () => void;
  onHome: () => void;
}

const GrammarView: React.FC<GrammarViewProps> = ({ unit, onBack }) => {
  const topics = getGrammarForUnit(unit.id);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-2xl mb-4 shadow-sm">
          <BookOpen size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Konu Anlatımı</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          <span className="font-semibold text-teal-600 dark:text-teal-400">{unit.title}</span> ünitesi için önemli gramer kuralları ve ipuçları.
        </p>
      </div>

      <div className="space-y-6 pb-12">
        {topics.map((topic, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none animate-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 text-sm font-bold">
                {index + 1}
              </span>
              {topic.title}
            </h3>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {topic.content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-center pb-8">
         <button
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-200 dark:shadow-none transition-all active:scale-[0.98]"
          >
            Tamamladım
          </button>
      </div>

    </div>
  );
};

export default GrammarView;
