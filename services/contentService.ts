
import { getUnitData as fetchUnitDataFromSupabase, supabase, withTimeout, getGlobalAnnouncements, DbResult } from './supabase';
import { WordCard, UnitDef, Announcement, GrammarTopic, Avatar, FrameDef, BackgroundDef, Badge } from '../types';
import { UNIT_ASSETS, AVATARS, FRAMES, BACKGROUNDS, BADGES } from '../data/assets';
import { getGrammarForUnit as getGrammarData } from '../data/grammarContent';

// This service abstracts the data fetching logic.
// It tries to fetch from Supabase first. 

let allWordsCache: Record<string, WordCard[]> | null = null;

export const fetchAllWords = async (): Promise<Record<string, WordCard[]>> => {
    // 1. Varsa önbelleği direkt dön
    if (allWordsCache && Object.keys(allWordsCache).length > 0) {
        return allWordsCache;
    }

    // 2. İnternet yoksa boş dön, hata verme
    if (!navigator.onLine) {
        if (!allWordsCache) allWordsCache = {};
        return allWordsCache;
    }

    try {
        // 3. Buluttan çekmeyi dene ama hata olursa önemseme
        // withTimeout artık null dönüyor, hata fırlatmıyor (supabase.ts'deki değişiklikle)
        // Using default timeout from supabase.ts (15000ms)
        const query = supabase.from('units').select('id, words');
        const result = await withTimeout<DbResult<{ id: string, words: any[] }[]>>(query, 60000);

        // Hata veya timeout durumunda
        if (!result || result.error) {
            console.warn("Cloud fetch failed or timed out, using local fallback");
            if (!allWordsCache) allWordsCache = {};
            return allWordsCache;
        }

        const data = result.data;

        const vocabulary: Record<string, WordCard[]> = {};
        if (data) {
            for (const unit of data) {
                // Ensure unitId is attached to each word card from the fetched data
                if (Array.isArray(unit.words)) {
                    vocabulary[unit.id] = unit.words.map((w: any) => ({ ...w, unitId: unit.id }));
                }
            }
        }
        allWordsCache = vocabulary;
        return vocabulary;

    } catch (e) {
        console.warn("Exception during fetchAllWords:", e);
        // Do not throw error here, return whatever we have or empty object to prevent app crash on load
        if (!allWordsCache) allWordsCache = {};
        return allWordsCache;
    }
};

export const getVocabulary = async (): Promise<Record<string, WordCard[]>> => {
    return allWordsCache || await fetchAllWords();
};

export const getWordsForUnit = async (unitId: string): Promise<WordCard[]> => {
    // 1. Try to get from cache first
    if (allWordsCache && allWordsCache[unitId] && allWordsCache[unitId].length > 0) {
        return allWordsCache[unitId];
    }

    // 2. If not in cache (or cache empty/failed), try to fetch specifically for this unit
    try {
        if (navigator.onLine) {
            console.log(`Cache miss for ${unitId}, fetching from cloud...`);
            const query = supabase
                .from('units')
                .select('words')
                .eq('id', unitId)
                .single();

            // Using default timeout from supabase.ts (15000ms)
            const result = await withTimeout<DbResult<{ words: WordCard[] }>>(query, 30000);

            if (result && !result.error && result.data) {
                const cloudData = result.data.words;
                if (cloudData && cloudData.length > 0) {
                    const taggedWords = cloudData.map(w => ({ ...w, unitId }));

                    // Update cache incrementally
                    if (!allWordsCache) allWordsCache = {};
                    allWordsCache[unitId] = taggedWords;

                    return taggedWords;
                }
            }
        }
    } catch (e) {
        console.error(`Error fetching unit data for ${unitId}:`, e);
    }

    // Hata durumunda boş dizi dön, uygulama çökmesin
    return [];
};

export const getAllWordsForGrade = async (grade: string): Promise<WordCard[]> => {
    const vocabulary = await getVocabulary();
    const units = UNIT_ASSETS[grade];
    if (!units) return [];

    let allWords: WordCard[] = [];
    units.forEach(u => {
        if (vocabulary[u.id]) {
            allWords = [...allWords, ...vocabulary[u.id]];
        }
    });
    return allWords;
};


// Smart Distractor Logic - Moved here to decouple from data file
export const getSmartDistractors = (correctWord: WordCard, allWords: WordCard[], count: number = 3): WordCard[] => {
    // 1. Filter words with same context
    let sameContextWords = allWords.filter(w =>
        w.english !== correctWord.english &&
        w.turkish.trim().toLowerCase() !== correctWord.turkish.trim().toLowerCase() &&
        w.context === correctWord.context
    );

    // 2. Filter other words (if not enough same context)
    let otherWords = allWords.filter(w =>
        w.english !== correctWord.english &&
        w.turkish.trim().toLowerCase() !== correctWord.turkish.trim().toLowerCase() &&
        w.context !== correctWord.context
    );

    const selectedDistractors: WordCard[] = [];
    const seenMeanings = new Set<string>();
    seenMeanings.add(correctWord.turkish.trim().toLowerCase());

    // Helper to shuffle and pick
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

// FIX: Added missing data access functions
export const getUnitAssets = (): Record<string, UnitDef[]> => {
    return UNIT_ASSETS;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
    return await getGlobalAnnouncements();
};

export const fetchDynamicContent = async () => {
    // Placeholder for future dynamic content fetching
    return Promise.resolve();
};

export const getGrammarForUnit = async (unitId: string): Promise<GrammarTopic[]> => {
    try {
        // If unitId follows grade pattern like 'g9u1' (g<grade>...), try to load only that grade file
        const gradeMatch = unitId.match(/^g(\d{1,2})/i);
        if (gradeMatch) {
            const grade = gradeMatch[1];
            try {
                const mod = await import(`../data/grammar_g${grade}.tsx`);
                const key = `GRAMMAR_G${grade}`;
                const content = (mod as any)[key];
                if (content && content[unitId]) return content[unitId];
            } catch (e) {
                // fallthrough to generic loader
            }
        }

        // General content (A1..C1) or fallback to generic grammar
        if (unitId.toLowerCase().startsWith('gen')) {
            const mod = await import('../data/grammar_gen');
            return (mod as any).GRAMMAR_GEN[unitId] || [];
        }

        // As a last resort, import the combined grammar content (smaller chance but safe)
        const all = await import('../data/grammarContent');
        return all.getGrammarForUnit(unitId);
    } catch (e) {
        console.warn('Failed to load grammar content dynamically', e);
        return [];
    }
};

export const getAvatars = (): Avatar[] => AVATARS;
export const getFrames = (): FrameDef[] => FRAMES;
export const getBackgrounds = (): BackgroundDef[] => BACKGROUNDS;
export const getBadges = (): Badge[] => BADGES;
