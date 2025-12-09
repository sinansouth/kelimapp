
import { UserStats, Quest, DailyState, Badge, BadgeContext, GradeLevel, WordCard, ThemeType, Challenge } from '../types';
import { BADGES, UNIT_ASSETS } from '../data/assets';
import { fetchAllWords } from './contentService';

export type UserProfile = {
  name: string;
  grade: string;
  avatar: string;
  frame: string;
  background: string;
  theme?: ThemeType;
  purchasedThemes: string[];
  purchasedFrames: string[];
  purchasedBackgrounds: string[];
  isGuest?: boolean;
  friendCode?: string;
  inventory: {
      streakFreezes: number;
  };
  isAdmin?: boolean;
  lastUsernameChange?: number;
  updatedAt?: number;
};

export interface AppSettings {
  soundEnabled: boolean;
  theme: ThemeType;
}

// --- Defaults ---
export const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  badges: [],
  flashcardsViewed: 0,
  quizCorrect: 0,
  quizWrong: 0,
  dailyGoal: 20,
  date: new Date().toLocaleDateString('tr-TR'),
  xpBoostEndTime: 0,
  lastGoalMetDate: null,
  viewedWordsToday: [],
  perfectQuizzes: 0,
  questsCompleted: 0,
  totalTimeSpent: 0,
  duelWins: 0,
  duelLosses: 0,
  duelDraws: 0,
  duelPoints: 0,
  matchingAllTimeBest: 0,
  mazeAllTimeBest: 0,
  wordSearchAllTimeBest: 0,
  completedUnits: [],
  completedGrades: [],
  weekly: {
      weekId: getWeekId(),
      quizCorrect: 0,
      quizWrong: 0,
      cardsViewed: 0,
      matchingBestTime: 0,
      mazeHighScore: 0,
      wordSearchHighScore: 0,
      duelPoints: 0,
      duelWins: 0,
      duelLosses: 0,
      duelDraws: 0
  },
  updatedAt: Date.now()
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  grade: '',
  avatar: '🧑‍🎓',
  frame: 'frame_none',
  background: 'bg_default',
  theme: 'dark',
  purchasedThemes: ['light', 'dark'],
  purchasedFrames: ['frame_none'],
  purchasedBackgrounds: ['bg_default'],
  inventory: { streakFreezes: 0 }
};

// --- Helpers ---
function getWeekId(): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${weekNo}`;
}

// --- Local Storage Accessors ---

export const getUserStats = (): UserStats => {
  try {
    const saved = localStorage.getItem('lgs_user_stats');
    if (!saved) return DEFAULT_STATS;
    const stats = JSON.parse(saved);
    // Migration for new fields
    if (!stats.weekly || stats.weekly.weekId !== getWeekId()) {
        stats.weekly = { ...DEFAULT_STATS.weekly, weekId: getWeekId() };
    }
    return { ...DEFAULT_STATS, ...stats };
  } catch (e) {
    return DEFAULT_STATS;
  }
};

export const saveUserStats = (stats: UserStats) => {
  stats.updatedAt = Date.now();
  localStorage.setItem('lgs_user_stats', JSON.stringify(stats));
};

export const getUserProfile = (): UserProfile => {
  try {
    const saved = localStorage.getItem('lgs_user_profile');
    if (!saved) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile, updateTimestamp = true) => {
  if (updateTimestamp) profile.updatedAt = Date.now();
  localStorage.setItem('lgs_user_profile', JSON.stringify(profile));
};

export const getAppSettings = (): AppSettings => {
  try {
    const saved = localStorage.getItem('lgs_app_settings');
    if (!saved) return { soundEnabled: true, theme: 'dark' };
    return JSON.parse(saved);
  } catch (e) {
    return { soundEnabled: true, theme: 'dark' };
  }
};

export const saveAppSettings = (settings: AppSettings) => {
  localStorage.setItem('lgs_app_settings', JSON.stringify(settings));
};

export const getTheme = (): ThemeType => {
    return getAppSettings().theme || 'dark';
};

export const saveTheme = (theme: ThemeType) => {
    const settings = getAppSettings();
    settings.theme = theme;
    saveAppSettings(settings);
    // Also update profile for persistence across devices
    const profile = getUserProfile();
    profile.theme = theme;
    saveUserProfile(profile);
};

// --- Core Logic ---

export const updateStats = (
  action: 'card_view' | 'quiz_correct' | 'quiz_wrong' | 'memorized' | 'review_remember' | 'review_forgot' | 'duel_result', 
  grade?: GradeLevel | null,
  unitId?: string,
  value: number = 1
): Badge[] => {
  const stats = getUserStats();
  const today = new Date().toLocaleDateString('tr-TR');
  
  if (stats.date !== today) {
    // New day logic
    if (stats.lastStudyDate) {
        const last = new Date(stats.lastStudyDate.split('.').reverse().join('-'));
        const curr = new Date(today.split('.').reverse().join('-'));
        const diffTime = Math.abs(curr.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            stats.streak += 1;
        } else if (diffDays > 1) {
            // Check streak freeze
            const profile = getUserProfile();
            if (profile.inventory.streakFreezes > 0) {
                profile.inventory.streakFreezes -= 1;
                saveUserProfile(profile);
                // Keep streak
            } else {
                stats.streak = 1;
            }
        }
    } else {
        stats.streak = 1;
    }
    stats.date = today;
    stats.lastStudyDate = today;
    stats.viewedWordsToday = [];
    stats.dailyGoal = 20; // Reset daily goal target if needed or keep dynamic
  }

  // XP Boost Logic
  const xpMultiplier = (stats.xpBoostEndTime > Date.now()) ? 2 : 1;

  switch (action) {
    case 'card_view':
      stats.flashcardsViewed += value;
      stats.weekly.cardsViewed += value;
      if (typeof unitId === 'string' && !stats.viewedWordsToday.includes(unitId)) {
          stats.viewedWordsToday.push(unitId);
      }
      stats.xp += 1 * xpMultiplier;
      break;
    case 'quiz_correct':
      stats.quizCorrect += value;
      stats.weekly.quizCorrect += value;
      stats.xp += (20 * value) * xpMultiplier;
      break;
    case 'quiz_wrong':
      stats.quizWrong += value;
      stats.weekly.quizWrong += value;
      break;
    case 'memorized':
      stats.xp += (10 * value) * xpMultiplier;
      break;
    case 'review_remember':
      stats.xp += (10 * value) * xpMultiplier;
      break;
    case 'review_forgot':
      stats.xp += (2 * value) * xpMultiplier;
      break;
    case 'duel_result':
      // value: 0=loss, 1=draw, 3=win
      stats.duelPoints += value;
      stats.weekly.duelPoints += value;
      if (value === 3) { stats.duelWins++; stats.weekly.duelWins++; stats.xp += 100 * xpMultiplier; updateQuestProgress('win_duel', 1); }
      else if (value === 1) { stats.duelDraws++; stats.weekly.duelDraws++; stats.xp += 25 * xpMultiplier; }
      else { stats.duelLosses++; stats.weekly.duelLosses++; stats.xp += 10 * xpMultiplier; }
      updateQuestProgress('play_duel', 1);
      break;
  }

  // Level Up Logic (Simple: Level = sqrt(XP/100))
  const newLevel = Math.floor(Math.sqrt(stats.xp / 100)) + 1;
  if (newLevel > stats.level) {
      stats.level = newLevel;
      // Could trigger level up animation here via a global event or return value
  }

  // Badge Check
  const newBadges: Badge[] = [];
  const context: BadgeContext = { grade, unitId, action };
  
  BADGES.forEach(badge => {
    if (!stats.badges.includes(badge.id) && badge.condition(stats, context)) {
      stats.badges.push(badge.id);
      newBadges.push(badge);
      stats.xp += 500; // Bonus XP for badge
    }
  });

  saveUserStats(stats);
  return newBadges;
};

export const updateGameStats = (game: 'matching' | 'maze' | 'wordSearch', score: number) => {
    const stats = getUserStats();
    if (game === 'matching') {
        if (score > (stats.weekly.matchingBestTime || 0)) stats.weekly.matchingBestTime = score;
        if (score > (stats.matchingAllTimeBest || 0)) stats.matchingAllTimeBest = score;
    } else if (game === 'maze') {
        if (score > (stats.weekly.mazeHighScore || 0)) stats.weekly.mazeHighScore = score;
        if (score > (stats.mazeAllTimeBest || 0)) stats.mazeAllTimeBest = score;
    } else if (game === 'wordSearch') {
        if (score > (stats.weekly.wordSearchHighScore || 0)) stats.weekly.wordSearchHighScore = score;
        if (score > (stats.wordSearchAllTimeBest || 0)) stats.wordSearchAllTimeBest = score;
    }
    saveUserStats(stats);
};

export const processDuelResultLocal = (challenge: Challenge) => {
    let resultType = 0;
    if (challenge.winnerId === challenge.creatorId) {
        resultType = 3; // Win
    } else if (challenge.winnerId === 'tie') {
        resultType = 1; // Tie
    } else {
        resultType = 0; // Loss
    }
    updateStats('duel_result', null, undefined, resultType);
};

// --- Daily Quests ---

export const getDailyState = (): DailyState => {
    try {
        const saved = localStorage.getItem('lgs_daily_state');
        const today = new Date().toLocaleDateString('tr-TR');
        if (saved) {
            const state: DailyState = JSON.parse(saved);
            if (state.date === today) return state;
        }
        
        // Generate new quests
        const newQuests: Quest[] = [
            { id: 'q1', description: '20 Kelime Kartı İncele', target: 20, current: 0, rewardXP: 100, isCompleted: false, type: 'view_cards' },
            { id: 'q2', description: 'Bir Quiz Tamamla', target: 1, current: 0, rewardXP: 150, isCompleted: false, type: 'finish_quiz' },
            { id: 'q3', description: '500 XP Kazan', target: 500, current: 0, rewardXP: 200, isCompleted: false, type: 'earn_xp' }
        ];
        
        // Add random 4th quest
        const extraQuests: Quest[] = [
            { id: 'q4', description: 'Eşleştirme Oyunu Oyna', target: 1, current: 0, rewardXP: 100, isCompleted: false, type: 'play_matching' },
            { id: 'q4', description: 'Labirent Oyunu Oyna', target: 1, current: 0, rewardXP: 100, isCompleted: false, type: 'play_maze' },
            { id: 'q4', description: 'Hatası Quiz Bitir', target: 1, current: 0, rewardXP: 300, isCompleted: false, type: 'perfect_quiz' },
            { id: 'q4', description: '10 Dakika Çalış', target: 10, current: 0, rewardXP: 150, isCompleted: false, type: 'study_time' },
        ];
        newQuests.push(extraQuests[Math.floor(Math.random() * extraQuests.length)]);

        const newState = {
            date: today,
            quests: newQuests,
            wordOfTheDayIndex: Math.floor(Math.random() * 1000)
        };
        localStorage.setItem('lgs_daily_state', JSON.stringify(newState));
        return newState;
    } catch (e) {
        return { date: '', quests: [], wordOfTheDayIndex: 0 };
    }
};

export const updateQuestProgress = (type: string, amount: number) => {
    const state = getDailyState();
    let updated = false;
    
    state.quests = state.quests.map(q => {
        if (!q.isCompleted && q.type === type) {
            q.current += amount;
            if (q.current >= q.target) {
                q.isCompleted = true;
                q.current = q.target;
                adminAddXP(q.rewardXP); // Directly add reward
                updated = true;
            }
            updated = true;
        }
        return q;
    });
    
    if (updated) {
        // Also update questsCompleted stat
        const completedCount = state.quests.filter(q => q.isCompleted).length;
        const stats = getUserStats();
        if (completedCount > stats.questsCompleted) { // Simplistic check, ideally track unique completions
             // Just incrementing stats for badge tracking, mostly approximate
             stats.questsCompleted += 1;
             saveUserStats(stats);
        }
        
        localStorage.setItem('lgs_daily_state', JSON.stringify(state));
    }
};

// --- SRS (Spaced Repetition System) ---

interface SRSData {
    [wordId: string]: {
        box: number; // 1 to 5
        nextReview: number; // Timestamp
    }
}

export const getSRSData = (): SRSData => {
    try {
        return JSON.parse(localStorage.getItem('lgs_srs_data') || '{}');
    } catch { return {}; }
};

export const saveSRSData = (data: SRSData) => {
    localStorage.setItem('lgs_srs_data', JSON.stringify(data));
};

export const getSRSStatus = () => {
    const data = getSRSData();
    const counts: {[key:number]: number} = {1:0, 2:0, 3:0, 4:0, 5:0};
    Object.values(data).forEach(item => {
        if(counts[item.box] !== undefined) counts[item.box]++;
    });
    return counts;
};

export const registerSRSInteraction = (wordId: string) => {
    // When a user sees a card for the first time or studies it, add to box 1 if not exists
    const data = getSRSData();
    if (!data[wordId]) {
        data[wordId] = { box: 1, nextReview: Date.now() + 86400000 }; // 1 day
        saveSRSData(data);
    }
};

export const handleReviewResult = (wordId: string, success: boolean) => {
    const data = getSRSData();
    let item = data[wordId] || { box: 1, nextReview: 0 };
    
    if (success) {
        item.box = Math.min(item.box + 1, 5);
    } else {
        item.box = 1;
    }
    
    // Intervals: 1d, 3d, 7d, 14d, 30d
    const intervals = [1, 3, 7, 14, 30];
    const daysToAdd = intervals[item.box - 1] || 1;
    item.nextReview = Date.now() + (daysToAdd * 24 * 60 * 60 * 1000);
    
    data[wordId] = item;
    saveSRSData(data);
};

export const getDueWords = async (allowedUnitIds?: string[]): Promise<WordCard[]> => {
    const data = getSRSData();
    const now = Date.now();
    const dueWordIds = Object.keys(data).filter(id => data[id].nextReview <= now);
    
    if (dueWordIds.length === 0) return [];

    const allWords = await fetchAllWords();
    const flatWords: WordCard[] = [];
    
    // Flatten all words for searching
    Object.values(allWords).forEach(unitWords => flatWords.push(...unitWords));
    
    // Filter due words
    let results = flatWords.filter(w => {
        const id = w.unitId ? `${w.unitId}|${w.english}` : w.english;
        return dueWordIds.includes(id);
    });

    if (allowedUnitIds) {
        results = results.filter(w => w.unitId && allowedUnitIds.includes(w.unitId));
    }

    return results;
};

export const getTotalDueCount = (): number => {
    const data = getSRSData();
    const now = Date.now();
    return Object.values(data).filter(i => i.nextReview <= now).length;
};

export const getDueCountForGrade = (grade: GradeLevel): number => {
    // This is an approximation since we can't easily map wordIds back to grades without fetching all words
    // For performance, we might just return total due count or try to filter if possible.
    // Ideally SRS keys should include grade prefix.
    // For now, returning total due count to avoid heavy computation on every render.
    return getTotalDueCount(); 
};

// --- Memorized & Bookmarks ---

export const getMemorizedSet = (): Set<string> => {
    const data = getSRSData();
    // Consider memorized if box >= 5 OR explicitly marked (we use SRS box 5 as memorized threshold effectively)
    // But we also need a manual toggle. Let's use a separate local storage for manual overrides if needed, 
    // or just rely on SRS data. 
    // Let's assume box 5 is memorized.
    const set = new Set<string>();
    Object.keys(data).forEach(k => {
        if(data[k].box >= 5) set.add(k);
    });
    return set;
};

export const addToMemorized = (wordId: string) => {
    const data = getSRSData();
    data[wordId] = { box: 5, nextReview: Date.now() + (30 * 24 * 60 * 60 * 1000) };
    saveSRSData(data);
};

export const removeFromMemorized = (wordId: string) => {
    const data = getSRSData();
    if(data[wordId]) {
        data[wordId].box = 1;
        data[wordId].nextReview = Date.now();
        saveSRSData(data);
    }
};

export const addToBookmarks = (wordId: string) => {
    const bookmarks = new Set(JSON.parse(localStorage.getItem('lgs_bookmarks') || '[]'));
    bookmarks.add(wordId);
    localStorage.setItem('lgs_bookmarks', JSON.stringify([...bookmarks]));
};

export const removeFromBookmarks = (wordId: string) => {
    const bookmarks = new Set(JSON.parse(localStorage.getItem('lgs_bookmarks') || '[]'));
    bookmarks.delete(wordId);
    localStorage.setItem('lgs_bookmarks', JSON.stringify([...bookmarks]));
};

// --- Market ---

export const buyItem = (itemId: string, cost: number): boolean => {
    const stats = getUserStats();
    const profile = getUserProfile();
    
    if (stats.xp >= cost) {
        stats.xp -= cost;
        saveUserStats(stats);
        
        if (itemId === 'streak_freeze') {
            profile.inventory.streakFreezes += 1;
        } else if (itemId === 'xp_boost') {
            stats.xpBoostEndTime = Date.now() + (60 * 60 * 1000); // 1 hour
            saveUserStats(stats);
        }
        
        saveUserProfile(profile);
        return true;
    }
    return false;
};

export const buyTheme = (themeId: ThemeType, cost: number): boolean => {
    const stats = getUserStats();
    const profile = getUserProfile();
    
    if (stats.xp >= cost) {
        stats.xp -= cost;
        saveUserStats(stats);
        if (!profile.purchasedThemes.includes(themeId)) {
            profile.purchasedThemes.push(themeId);
            saveUserProfile(profile);
        }
        return true;
    }
    return false;
};

export const buyFrame = (frameId: string, cost: number): boolean => {
    const stats = getUserStats();
    const profile = getUserProfile();
    
    if (stats.xp >= cost) {
        stats.xp -= cost;
        saveUserStats(stats);
        if (!profile.purchasedFrames.includes(frameId)) {
            profile.purchasedFrames.push(frameId);
            saveUserProfile(profile);
        }
        return true;
    }
    return false;
};

export const buyBackground = (bgId: string, cost: number): boolean => {
    const stats = getUserStats();
    const profile = getUserProfile();
    
    if (stats.xp >= cost) {
        stats.xp -= cost;
        saveUserStats(stats);
        if (!profile.purchasedBackgrounds) profile.purchasedBackgrounds = ['bg_default'];
        if (!profile.purchasedBackgrounds.includes(bgId)) {
            profile.purchasedBackgrounds.push(bgId);
            saveUserProfile(profile);
        }
        return true;
    }
    return false;
};

export const equipFrame = (frameId: string) => {
    const profile = getUserProfile();
    if (profile.purchasedFrames.includes(frameId)) {
        profile.frame = frameId;
        saveUserProfile(profile);
    }
};

export const equipBackground = (bgId: string) => {
    const profile = getUserProfile();
    if (!profile.purchasedBackgrounds) profile.purchasedBackgrounds = ['bg_default'];
    if (profile.purchasedBackgrounds.includes(bgId)) {
        profile.background = bgId;
        saveUserProfile(profile);
    }
};

// --- Admin ---

export const adminAddXP = (amount: number) => {
    const stats = getUserStats();
    stats.xp += amount;
    saveUserStats(stats);
};

export const adminSetLevel = (level: number) => {
    const stats = getUserStats();
    stats.level = level;
    stats.xp = level * level * 100;
    saveUserStats(stats);
};

export const adminUnlockAllItems = () => {
    const profile = getUserProfile();
    // This requires importing asset lists, which might create circular dependency.
    // Instead we can just say "all known IDs" if we had them, or just rely on specific logic.
    // For now, let's just give a lot of XP so they can buy everything.
    adminAddXP(1000000);
};

export const adminResetDailyQuests = () => {
    localStorage.removeItem('lgs_daily_state');
};

export const adminUnlockAllBadges = () => {
    const stats = getUserStats();
    stats.badges = BADGES.map(b => b.id);
    saveUserStats(stats);
};

export const adminUnlockAllAvatars = () => {
    // Avatars are level unlocked, so set level high
    adminSetLevel(100);
};

// --- Sync & Other ---

export const overwriteLocalWithCloud = (cloudData: any) => {
    if (cloudData.profile) saveUserProfile(cloudData.profile, false);
    if (cloudData.stats) saveUserStats(cloudData.stats);
    if (cloudData.srs_data) saveSRSData(cloudData.srs_data);
};

export const clearLocalUserData = () => {
    localStorage.removeItem('lgs_user_stats');
    localStorage.removeItem('lgs_user_profile');
    localStorage.removeItem('lgs_srs_data');
    localStorage.removeItem('lgs_bookmarks');
    localStorage.removeItem('lgs_daily_state');
};

export const createGuestProfile = (grade: string) => {
    const profile = getUserProfile();
    profile.grade = grade;
    profile.isGuest = true;
    profile.name = 'Misafir Öğrenci';
    saveUserProfile(profile);
};

export const hasSeenTutorial = (): boolean => {
    return localStorage.getItem('lgs_tutorial_seen') === 'true';
};

export const markTutorialAsSeen = () => {
    localStorage.setItem('lgs_tutorial_seen', 'true');
};

export const getDueGrades = (): string[] => {
    // In a real app this would analyze SRS data by grade. 
    // Here we return all grades if there are due words, filtering would happen later.
    if (getTotalDueCount() > 0) return ['2','3','4','5','6','7','8','9','10','11','12','A1','A2','B1','B2','C1'];
    return [];
};

export const updateTimeSpent = (minutes: number) => {
    const stats = getUserStats();
    stats.totalTimeSpent += minutes;
    saveUserStats(stats);
    // Badge checks for time are handled in updateStats usually or check here
    updateStats('card_view', null, undefined, 0); // Trigger badge check
};

export const saveLastActivity = (grade: string, unitId: string) => {
    const stats = getUserStats();
    stats.lastActivity = { grade, unitId };
    saveUserStats(stats);
};

export const getLastReadAnnouncementId = (): string | null => {
    return localStorage.getItem('lgs_last_announcement');
};

export const setLastReadAnnouncementId = (id: string) => {
    localStorage.setItem('lgs_last_announcement', id);
};

export const checkDataVersion = (): boolean => {
    const currentVer = 3; // Must match APP_CONFIG
    const storedVer = parseInt(localStorage.getItem('lgs_data_version') || '0');
    if (storedVer < currentVer) {
        // Migration or wipe logic if needed
        // For simplicity, we just update version
        localStorage.setItem('lgs_data_version', currentVer.toString());
        return false; // Return true if data was wiped
    }
    return false;
};

export const resetAppProgress = () => {
    clearLocalUserData();
    localStorage.setItem('lgs_data_version', '3'); // Preserve version to avoid loop
};

export const getLastUpdatedTimestamp = (): number => {
    const profile = getUserProfile();
    const stats = getUserStats();
    return Math.max(profile.updatedAt || 0, stats.updatedAt || 0);
};

export const getRandomWordForGrade = async (grade: string): Promise<WordCard | null> => {
    const units = UNIT_ASSETS[grade];
    if (!units || units.length === 0) return null;
    
    // Pick random unit
    const randomUnit = units[Math.floor(Math.random() * units.length)];
    const allWords = await fetchAllWords();
    const unitWords = allWords[randomUnit.id];
    
    if (unitWords && unitWords.length > 0) {
        return unitWords[Math.floor(Math.random() * unitWords.length)];
    }
    return null;
};
