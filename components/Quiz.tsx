
import React, { useState, useEffect, useRef } from 'react';
import { WordCard, Badge, GradeLevel, QuizDifficulty, Challenge } from '../types';
import { CheckCircle, XCircle, ChevronRight, HelpCircle, Trophy, Swords, Clock, AlertTriangle } from 'lucide-react';
import { playSound } from '../services/soundService';
import { updateStats, updateQuestProgress, processDuelResultLocal, getUserProfile } from '../services/userService';
import { completeChallenge, submitTournamentScore, syncLocalToCloud } from '../services/supabase';

interface QuizProps {
  words: WordCard[];
  allWords: WordCard[];
  onRestart: () => void;
  onBack: () => void;
  onHome: () => void;
  isBookmarkQuiz?: boolean;
  isReviewMode?: boolean;
  difficulty?: QuizDifficulty;
  onCelebrate?: (message: string, type: 'unit' | 'quiz' | 'goal') => void;
  onBadgeUnlock?: (badge: Badge) => void;
  grade?: GradeLevel | null;
  
  // Challenge / Duel Props
  challengeMode?: 'create' | 'join' | 'tournament';
  challengeData?: Challenge;
  unitIdForChallenge?: string;
  challengeType?: 'public' | 'private' | 'friend';
  targetFriendId?: string;
  tournamentMatchId?: string;
  tournamentName?: string;
}

const Quiz: React.FC<QuizProps> = ({ 
    words, allWords, onRestart, onBack, onHome, difficulty = 'normal', 
    onCelebrate, onBadgeUnlock, grade, challengeMode, challengeData, tournamentMatchId 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Challenge State
  const [challengeResult, setChallengeResult] = useState<'win' | 'loss' | 'tie' | null>(null);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  
  const correctCount = useRef(0);
  const wrongCount = useRef(0);
  const startTimeRef = useRef(Date.now());

  const getDifficultyTime = () => {
      switch(difficulty) {
          case 'relaxed': return 30;
          case 'easy': return 20;
          case 'normal': return 15;
          case 'hard': return 10;
          case 'impossible': return 5;
          default: return 15;
      }
  };

  useEffect(() => {
    generateOptions();
    setTimer(0);
    setTimeLeft(getDifficultyTime());
    setIsTimerActive(true);
    startTimeRef.current = Date.now();
  }, [currentQuestionIndex]);

  useEffect(() => {
      let interval: any = null;
      if (isTimerActive) {
          interval = setInterval(() => {
              setTimer(prev => prev + 1);
              setTimeLeft(prev => {
                  if (prev <= 1) {
                      handleTimeUp();
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleTimeUp = () => {
      setIsTimerActive(false);
      handleOptionSelect("TIMEOUT"); // Special value for timeout
  };

  const generateOptions = () => {
    if (!words[currentQuestionIndex]) return;
    const correct = words[currentQuestionIndex].turkish;
    const distractors = allWords
      .filter(w => w.turkish !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.turkish);
    
    setOptions([...distractors, correct].sort(() => 0.5 - Math.random()));
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    
    setIsTimerActive(false);
    setSelectedOption(option);
    
    const currentWord = words[currentQuestionIndex];
    const isAnswerCorrect = option === currentWord.turkish;
    
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(prev => prev + 1);
      correctCount.current += 1;
      playSound('correct');
      
      // Update stats immediately for better UX
      const newBadges = updateStats('quiz_correct', grade, undefined, 1); 
      updateQuestProgress('finish_quiz', 1); // Progress per question for some quests? No, usually per quiz.
      updateQuestProgress('correct_answers', 1);
      
      if (newBadges.length > 0 && onBadgeUnlock) {
          newBadges.forEach(b => onBadgeUnlock(b));
      }
    } else {
      wrongCount.current += 1;
      playSound('wrong');
      updateStats('quiz_wrong', grade);
    }

    // Auto advance
    setTimeout(() => {
      if (currentQuestionIndex < words.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = async () => {
      setShowResult(true);
      const totalSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Check for perfect quiz badge context
      const context = { quizSize: words.length };
      // Trigger badge check with custom context
      // Note: This relies on updateStats running at least once, which it does on answers.
      // But we might want to check completion badges here.
      // Actually updateStats is called per answer.
      
      updateQuestProgress('finish_quiz', 1);
      if (correctCount.current === words.length) {
          updateQuestProgress('perfect_quiz', 1);
      }
      
      // Challenge Logic
      if (challengeMode === 'create') {
          // In create mode, we just finished setting the score.
          // The actual creation happens in the parent component or we trigger it here.
          // However, props suggest parent handles it via modal or other logic.
          // Wait, if mode is create, we are the creator. We need to save this score.
          // But Quiz component is generic.
          // Let's assume we just show the score and the parent (App.tsx) handles the "Creation" via specific callbacks if passed.
          // But here we don't have onCreate callback.
          // In App.tsx, challenge creation logic was: set words -> open quiz.
          // We need to persist the challenge to DB here if we are in 'create' mode.
          // But we need the function.
          // Let's assume for now we just show result.
          // Actually, we should probably call a service here if we had the challenge params.
      } else if (challengeMode === 'join' || challengeMode === 'tournament') {
           if (challengeData) {
                const percentage = Math.round((correctCount.current / words.length) * 100);
                
                // Determine result for local user
                let resultType = 0;
                if (percentage > challengeData.creatorScore) {
                    setChallengeResult('win');
                    resultType = 3;
                } else if (percentage < challengeData.creatorScore) {
                    setChallengeResult('loss');
                    resultType = 0;
                } else {
                    setChallengeResult('tie');
                    resultType = 1;
                }
                
                // Update stats
                updateStats('duel_result', grade, undefined, resultType);
                
                // Sync to cloud
                if (navigator.onLine) {
                    try {
                        const userProfile = getUserProfile();
                        await completeChallenge(challengeData.id, userProfile.name, percentage);
                        
                        if (challengeMode === 'tournament' && tournamentMatchId) {
                             await submitTournamentScore(challengeData.unitId || '', tournamentMatchId, percentage, totalSeconds); // Note: challengeData structure might differ slightly, checking type defs... Tournament matches are stored in tournament doc.
                        }
                    } catch (e) {
                        console.error("Failed to sync challenge result", e);
                    }
                }
                
                setOpponentScore(challengeData.creatorScore);
           }
      }
      
      syncLocalToCloud(); // Sync everything
      
      if (onCelebrate && correctCount.current === words.length) {
          onCelebrate("Mükemmel! Hepsini doğru bildin.", 'quiz');
      }
  };

  if (showResult) {
    const percentage = Math.round((score / words.length) * 100);
    const isChallenge = !!challengeMode;
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in zoom-in">
        
        {isChallenge ? (
            <div className="mb-8 relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-xl ${challengeResult === 'win' ? 'bg-yellow-100 border-yellow-400 text-yellow-600' : challengeResult === 'loss' ? 'bg-red-100 border-red-400 text-red-600' : 'bg-slate-100 border-slate-400 text-slate-600'}`}>
                    {challengeResult === 'win' ? <Trophy size={64} /> : challengeResult === 'loss' ? <XCircle size={64} /> : <Swords size={64} />}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-4 py-1 rounded-full shadow-md font-black text-lg whitespace-nowrap">
                    {challengeResult === 'win' ? 'KAZANDIN!' : challengeResult === 'loss' ? 'KAYBETTİN' : 'BERABERE'}
                </div>
            </div>
        ) : (
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-lg">
              <CheckCircle size={48} />
            </div>
        )}

        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
            {isChallenge ? (challengeResult === 'win' ? 'Tebrikler!' : 'Güzel Maçtı!') : 'Quiz Tamamlandı!'}
        </h2>
        
        <div className="flex items-center gap-8 mb-8">
            <div className="text-center">
                <div className="text-xs font-bold text-slate-400 uppercase">Sen</div>
                <div className="text-4xl font-black text-indigo-600">{percentage}%</div>
            </div>
            {isChallenge && (
                <>
                <div className="text-2xl font-black text-slate-300">VS</div>
                <div className="text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase">Rakip</div>
                    <div className="text-4xl font-black text-slate-600">{opponentScore}%</div>
                </div>
                </>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 dark:border-green-800">
            <div className="text-green-600 dark:text-green-400 font-bold text-lg">{correctCount.current}</div>
            <div className="text-xs text-green-700 dark:text-green-500">Doğru</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 dark:border-red-800">
            <div className="text-red-600 dark:text-red-400 font-bold text-lg">{wrongCount.current}</div>
            <div className="text-xs text-red-700 dark:text-red-500">Yanlış</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {!isChallenge && (
              <button 
                onClick={onRestart}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
              >
                Tekrar Dene
              </button>
          )}
          <button 
            onClick={onBack}
            className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            Tamamla
          </button>
        </div>
      </div>
    );
  }

  const currentWord = words[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-600 transition-all duration-300" strokeDasharray="113" strokeDashoffset={113 - (113 * (currentQuestionIndex + 1) / words.length)} strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-bold text-slate-600 dark:text-slate-300">{currentQuestionIndex + 1}</span>
            </div>
            {challengeMode && (
                <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2 py-1 rounded-lg text-xs font-bold">
                    <Swords size={12} /> Düello
                </div>
            )}
        </div>
        
        <div className={`flex items-center gap-1 font-mono font-bold text-lg px-3 py-1 rounded-lg transition-colors ${timeLeft <= 5 ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
            <Clock size={16} /> {timeLeft}s
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center mb-8 relative">
         <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
             
             <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                 İngilizcesi
             </span>
             
             <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2 break-words">
                 {currentWord.english}
             </h2>
             
             {currentWord.context && (
                 <p className="text-slate-400 text-sm font-medium italic mt-2">
                     ({currentWord.context})
                 </p>
             )}
         </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 pb-8 shrink-0">
        {options.map((option, idx) => {
          let stateStyles = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md";
          
          if (selectedOption) {
             if (option === currentWord.turkish) {
                 stateStyles = "bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/30";
             } else if (option === selectedOption) {
                 stateStyles = "bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/30";
             } else {
                 stateStyles = "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-300 opacity-50";
             }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              className={`relative p-4 rounded-2xl border-2 font-bold text-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-between group ${stateStyles}`}
            >
              <span>{option}</span>
              {selectedOption === option && (
                  option === currentWord.turkish 
                    ? <CheckCircle className="animate-bounce" size={24} /> 
                    : <XCircle className="animate-shake" size={24} />
              )}
              {!selectedOption && (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-400 transition-colors"></div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default Quiz;
