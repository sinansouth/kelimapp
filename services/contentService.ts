
import { getUnitData, supabase, getSystemContent, getAllGrammar } from './supabase';
import { WordCard, UnitDef, Announcement, GrammarTopic, Avatar, FrameDef, BackgroundDef, Badge } from '../types';
// Removed local data imports to break dependency

// Cache variables for dynamic content
let allWordsCache: Record<string, WordCard[]> | null = null;
let cachedUnitAssets: Record<string, UnitDef[]> = {};
let cachedAvatars: Avatar[] = [];
let cachedFrames: FrameDef[] = [];
let cachedBackgrounds: BackgroundDef[] = [];
let cachedBadges: Badge[] = [];
let cachedAnnouncements: Announcement[] = [];
let cachedTips: string[] = [];
let cachedGrammar: Record<string, GrammarTopic[]> = {};

export const fetchAllWords = async (): Promise<Record<string, WordCard[]>> => {
    if (allWordsCache && Object.keys(allWordsCache).length > 0) {
        return allWordsCache;
    }
    try {
        if (navigator.onLine) {
            const { data, error } = await supabase.from('units').select('id, words');
            if (error) throw error;
            
            const vocabulary: Record<string, WordCard[]> = {};
            if (data) {
                for (const unit of data) {
                    vocabulary[unit.id] = (unit.words as any[]).map((w: any) => ({ ...w, unitId: unit.id }));
                }
            }
            allWordsCache = vocabulary;
            return vocabulary;
        }
    } catch (e) {
        console.error("Failed to fetch all words from cloud.", e);
        throw e;
    }
    
    allWordsCache = {};
    return allWordsCache;
};

export const fetchDynamicContent = async () => {
    try {
        if (navigator.onLine) {
            // 1. Fetch System Content (Assets, Tips) - Note: Announcements are now in their own table
            const { data: systemData, error: systemError } = await supabase.from('system_content').select('*');
            
            if (!systemError && systemData) {
                systemData.forEach(item => {
                    if (item.key === 'assets_unit_assets') cachedUnitAssets = item.value;
                    if (item.key === 'assets_avatars') cachedAvatars = item.value;
                    if (item.key === 'assets_frames') cachedFrames = item.value;
                    if (item.key === 'assets_backgrounds') cachedBackgrounds = item.value;
                    if (item.key === 'assets_badges') {
                        // Badge conditions need to be re-attached or handled logic-side.
                        // For now, we load the static data part. Logic is usually hardcoded in userService.
                        // We will rely on userService's internal BADGES definition for logic if possible, 
                        // or if this was purely visual data, we use it. 
                        // Since Badge logic is complex code, we might need to keep BADGES code in userService or assets.ts
                        // BUT user said we put badges in DB. Let's assume visual data is in DB.
                        cachedBadges = item.value;
                    }
                    if (item.key === 'tips') cachedTips = item.value;
                });
            }

            // 2. Fetch Grammar
            const grammarData = await getAllGrammar();
            if (grammarData) {
                grammarData.forEach((g: any) => {
                    cachedGrammar[g.unit_id] = g.topics;
                });
            }
            
            // 3. Fetch Announcements (from table)
            // We use getGlobalAnnouncements for this usually, but caching here doesn't hurt
        }
    } catch (e) {
        console.error("Failed to fetch dynamic content", e);
    }
};

export const getVocabulary = async (): Promise<Record<string, WordCard[]>> => {
    return allWordsCache || await fetchAllWords().catch(() => ({}));
};

export const getWordsForUnit = async (unitId: string): Promise<WordCard[]> => {
    if (allWordsCache && allWordsCache[unitId] && allWordsCache[unitId].length > 0) {
        return allWordsCache[unitId];
    }
    try {
        if (navigator.onLine) {
            const cloudData = await getUnitData(unitId);
            if (cloudData && cloudData.length > 0) {
                const taggedWords = cloudData.map(w => ({ ...w, unitId }));
                if (!allWordsCache) allWordsCache = {};
                allWordsCache[unitId] = taggedWords;
                return taggedWords;
            }
        }
    } catch (e) {
        console.error(`Error fetching unit data for ${unitId}:`, e);
    }
    return [];
};

export const getAllWordsForGrade = async (grade: string): Promise<WordCard[]> => {
    const vocabulary = await getVocabulary();
    const units = cachedUnitAssets[grade];
    if (!units) return [];

    let allWords: WordCard[] = [];
    units.forEach(u => {
        if (vocabulary[u.id]) {
            allWords = [...allWords, ...vocabulary[u.id]];
        }
    });
    return allWords;
};

export const getSmartDistractors = (correctWord: WordCard, allWords: WordCard[], count: number = 3): WordCard[] => {
    let sameContextWords = allWords.filter(w => 
        w.english !== correctWord.english && 
        w.turkish.trim().toLowerCase() !== correctWord.turkish.trim().toLowerCase() &&
        w.context === correctWord.context
    );

    let otherWords = allWords.filter(w => 
        w.english !== correctWord.english && 
        w.turkish.trim().toLowerCase() !== correctWord.turkish.trim().toLowerCase() &&
        w.context !== correctWord.context
    );

    const selectedDistractors: WordCard[] = [];
    const seenMeanings = new Set<string>();
    seenMeanings.add(correctWord.turkish.trim().toLowerCase());

    const addFromPool = (pool: WordCard[]) => {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        for (const d of shuffled) {
            if (selectedDistractors.length >= count) break;
            const meaning = d.turkish.trim().toLowerCase();
            if (!seenMeanings.has(meaning)) {
                selectedDistractors.push(d);
                seenMeanings.add(meaning);
            }
        }
    };

    addFromPool(sameContextWords);
    if (selectedDistractors.length < count) {
        addFromPool(otherWords);
    }

    return selectedDistractors;
};

// Getters for Dynamic Content
export const getUnitAssets = (): Record<string, UnitDef[]> => cachedUnitAssets;
export const getAvatars = (): Avatar[] => cachedAvatars;
export const getFrames = (): FrameDef[] => cachedFrames;
export const getBackgrounds = (): BackgroundDef[] => cachedBackgrounds;
export const getBadges = (): Badge[] => cachedBadges;
export const getGrammarForUnit = (unitId: string): GrammarTopic[] => cachedGrammar[unitId] || [];
export const getTips = (): string[] => cachedTips;

// Announcements are fetched live from table usually, but this is a helper placeholder
export const getAnnouncements = (): Announcement[] => cachedAnnouncements; 
