import React, { useState, useMemo } from 'react';
import { WordCard } from '../types';
import { Search, CheckCircle, Circle, BookOpen, Target } from 'lucide-react';

interface WordSelectorProps {
  words: WordCard[];
  unitTitle: string;
  onStart: (selectedWords: WordCard[], mode: 'study' | 'quiz') => void;
  onBack: () => void;
}

const WordSelector: React.FC<WordSelectorProps> = ({ words, unitTitle, onStart }) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWords = useMemo(() => {
    if (!searchTerm) return words;
    const lowerTerm = searchTerm.toLowerCase();
    return words.filter(
      (w) => 
        w.english.toLowerCase().includes(lowerTerm)
    );
  }, [words, searchTerm]);

  const getOriginalIndex = (filteredIndex: number) => {
    const word = filteredWords[filteredIndex];
    return words.indexOf(word);
  };

  const toggleSelection = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const toggleAll = () => {
    if (selectedIndices.size === words.length) {
      setSelectedIndices(new Set());
    } else {
      const allIndices = new Set(words.map((_, i) => i));
      setSelectedIndices(allIndices);
    }
  };

  const handleStart = (mode: 'study' | 'quiz') => {
    const selectedWords = words.filter((_, i) => selectedIndices.has(i));
    onStart(selectedWords, mode);
  };

  const selectedCount = selectedIndices.size;

  return (
    <div className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 pb-0">
      
      {/* Header Info */}
      <div className="text-center mb-4 shrink-0">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Kelime Seç</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{unitTitle}</p>
      </div>

      {/* Search & Controls */}
      <div className="mb-4 space-y-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="İngilizce kelime ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white shadow-sm"
          />
        </div>
        
        <div className="flex justify-between items-center px-2">
           <button 
             onClick={toggleAll}
             className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
           >
             {selectedIndices.size === words.length ? 'Seçimleri Kaldır' : 'Tümünü Seç'}
           </button>
           <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
             {selectedCount} seçildi
           </span>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto -mx-2 px-2 space-y-2 pb-24 custom-scrollbar">
        {filteredWords.length > 0 ? (
          filteredWords.map((word, i) => {
            const originalIndex = getOriginalIndex(i);
            const isSelected = selectedIndices.has(originalIndex);
            
            return (
              <div 
                key={originalIndex}
                onClick={() => toggleSelection(originalIndex)}
                className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-500 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm'
                  }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}>
                  {isSelected ? <CheckCircle size={24} className="fill-current" /> : <Circle size={24} />}
                </div>
                <div className="flex-grow">
                  <div className="font-bold text-slate-800 dark:text-white text-lg">{word.english}</div>
                </div>
              </div>
            );
          })
        ) : (
           <div className="text-center py-20 text-slate-400 dark:text-slate-500">
             Kelime bulunamadı.
           </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-10">
         <div className="max-w-4xl mx-auto flex gap-3">
            <button
              onClick={() => handleStart('study')}
              disabled={selectedCount === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
               <BookOpen size={20} /> Çalış ({selectedCount})
            </button>
            <button
              onClick={() => handleStart('quiz')}
              disabled={selectedCount < 4} 
              className="flex-1 bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-white disabled:opacity-50 disabled:hover:border-indigo-100 disabled:cursor-not-allowed py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              title={selectedCount < 4 ? "Quiz için en az 4 kelime seçmelisin" : ""}
            >
               <Target size={20} /> Quiz Yap
            </button>
         </div>
      </div>
    </div>
  );
};

export default WordSelector;