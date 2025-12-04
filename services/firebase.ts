import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateEmail,
    User
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs,
    onSnapshot,
    updateDoc,
    arrayUnion
} from 'firebase/firestore';

import { 
    getUserProfile, 
    getUserStats, 
    getAppSettings, 
    getLastUpdatedTimestamp, 
    updateLastUpdatedTimestamp, 
    getTheme, 
    clearLocalUserData,
    saveUserProfile,
    saveUserStats,
    saveAppSettings
} from './userService';
import { Challenge, QuizDifficulty } from '../types';

// REPLACE WITH YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDDEtzB8IomjCr1tHZlJ_hOEzmUtyX0bj8",
  authDomain: "kelim-app.firebaseapp.com",
  projectId: "kelim-app",
  storageBucket: "kelim-app.firebasestorage.app",
  messagingSenderId: "507793596268",
  appId: "1:507793596268:web:80649d37e1376de755dd49",
  measurementId: "G-E4MXNWFQTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth instance for listeners
export const getAuthInstance = () => auth;

export interface LeaderboardEntry {
    uid: string;
    name: string;
    grade: string;
    xp: number;
    level: number;
    streak: number;
    avatar: string;
    frame: string;
    background: string;
    theme: string;
    value: number; 
    quizWrong?: number;
    duelWins?: number;
    duelPoints?: number;
}

// --- AUTHENTICATION ---

export const loginUser = async (loginInput: string, pass: string, remember: boolean) => {
    let email = loginInput;

    // Check if input is username (doesn't have @)
    if (!loginInput.includes('@')) {
        // Query Firestore to find email associated with username
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("profile.name", "==", loginInput), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
             const userData = querySnapshot.docs[0].data();
             if (userData.email) {
                 email = userData.email;
             } else {
                 throw new Error("Kullanıcı adı bulundu ancak e-posta adresi kayıtlı değil. Lütfen e-posta adresinizle giriş yapın.");
             }
        } else {
             // Fallback: Try to check leaderboard data just in case structure varies
             const q2 = query(usersRef, where("leaderboardData.name", "==", loginInput), limit(1));
             const snap2 = await getDocs(q2);
             if (!snap2.empty) {
                 const userData = snap2.docs[0].data();
                 if (userData.email) email = userData.email;
                 else throw new Error("Bu kullanıcı adı ile kayıtlı bir hesap bulunamadı.");
             } else {
                 throw new Error("Bu kullanıcı adı ile kayıtlı bir hesap bulunamadı.");
             }
        }
    }

    await signInWithEmailAndPassword(auth, email, pass);
};

export const registerUser = async (name: string, email: string, pass: string, grade: string) => {
    // 1. Check if username taken
    const exists = await checkUsernameExists(name);
    if (exists) {
        throw new Error("Bu kullanıcı adı zaten alınmış.");
    }

    // 2. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCredential.user.uid;
    const user = userCredential.user;

    // 3. Update Profile Display Name
    await updateProfile(user, { displayName: name });
    
    // 4. Send Verification Email
    await sendEmailVerification(user);

    // 5. Prepare Data (Merge with existing guest data if any)
    const currentProfile = getUserProfile();
    
    const profile = {
        ...currentProfile, 
        name: name, 
        grade: grade,
        isGuest: false,
        lastUsernameChange: Date.now() // Set initial change time
    };

    // Ensure friendCode exists
    if (!profile.friendCode) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        profile.friendCode = result;
    }
    
    saveUserProfile(profile); 
    const stats = getUserStats(); 
    const settings = getAppSettings();
    const currentTheme = getTheme();
    
    const userData = {
        uid: uid,
        email: email, // Store email to allow username login lookup
        profile: profile,
        stats: stats,
        settings: settings,
        friends: [], // Initialize friends array
        lastUpdated: new Date().toISOString(),
        lastDataUpdate: Date.now(),
        isGuest: false, // Explicitly mark as not guest for queries
        leaderboardData: {
            name: name,
            grade: grade,
            xp: stats.xp,
            level: stats.level,
            streak: stats.streak,
            avatar: profile.avatar,
            frame: profile.frame,
            background: profile.background,
            theme: currentTheme,
            weekId: stats.weekly.weekId,
            quizCorrect: stats.weekly.quizCorrect,
            quizWrong: stats.weekly.quizWrong,
            cardsViewed: stats.weekly.cardsViewed,
            matchingBestTime: stats.weekly.matchingBestTime,
            mazeHighScore: stats.weekly.mazeHighScore,
            wordSearchHighScore: stats.weekly.wordSearchHighScore,
            duelWins: stats.duelWins || 0,
            duelPoints: stats.duelPoints || 0
        }
    };

    // 6. Write to Firestore
    await setDoc(doc(db, "users", uid), userData, { merge: true });
};

export const resetUserPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
};

export const updateUserEmail = async (newEmail: string) => {
    if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        await sendEmailVerification(auth.currentUser);
        // Update Firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { email: newEmail });
    }
};

export const logoutUser = async () => {
    await signOut(auth);
    clearLocalUserData();
    window.location.reload();
};

export const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("profile.name", "==", username), limit(1)); 
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (e) {
        console.error("Username check error", e);
        return false;
    }
};

export const updateCloudUsername = async (uid: string, newName: string) => {
    const userRef = doc(db, "users", uid);
    // Store in multiple places for consistency
    await setDoc(userRef, { 
        profile: { name: newName, lastUsernameChange: Date.now() }, 
        leaderboardData: { name: newName } 
    }, { merge: true });
    
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newName });
    }
};

export const deleteAccount = async () => {
    if (auth.currentUser) {
         const uid = auth.currentUser.uid;
         // Delete Firestore data first (optional but clean)
         // await deleteDoc(doc(db, "users", uid));
         await auth.currentUser.delete();
    }
    clearLocalUserData();
    window.location.reload();
};

// --- DATA SYNC ---

export const syncLocalToCloud = async (userId?: string) => {
    const uid = userId || auth?.currentUser?.uid;
    if (!uid) return;

    const userEmail = auth?.currentUser?.email;

    const profile = getUserProfile();
    const stats = getUserStats();
    const settings = getAppSettings();
    const memorized = localStorage.getItem('lgs_memorized') || '[]';
    const bookmarks = localStorage.getItem('lgs_bookmarks') || '[]';
    const srs = localStorage.getItem('lgs_srs_data') || '{}';
    const lastUpdate = getLastUpdatedTimestamp();
    const currentTheme = getTheme();

    try {
        const dataToSave: any = {
            uid: uid,
            profile: profile,
            stats: stats, 
            settings: settings,
            memorized: memorized, 
            bookmarks: bookmarks, 
            srs: srs,
            lastUpdated: new Date().toISOString(),
            lastDataUpdate: lastUpdate,
            isGuest: profile.isGuest,
            
            leaderboardData: {
                name: profile.name || 'İsimsiz', 
                grade: profile.grade || 'General',
                xp: stats.xp,
                level: stats.level,
                streak: stats.streak, 
                avatar: profile.avatar,
                frame: profile.frame,
                background: profile.background,
                theme: currentTheme,
                
                weekId: stats.weekly.weekId,
                quizCorrect: stats.weekly.quizCorrect,
                quizWrong: stats.weekly.quizWrong || 0, 
                cardsViewed: stats.weekly.cardsViewed,
                matchingBestTime: stats.weekly.matchingBestTime,
                mazeHighScore: stats.weekly.mazeHighScore || 0,
                wordSearchHighScore: stats.weekly.wordSearchHighScore || 0,
                duelWins: stats.duelWins || 0,
                duelPoints: stats.duelPoints || 0
            }
        };

        // Explicitly save email if available to ensure username login works
        if (userEmail) {
            dataToSave.email = userEmail;
        }

        await setDoc(doc(db, "users", uid), dataToSave, { merge: true });
    } catch (e) {
        console.error("Cloud save error:", e);
    }
};

// Manual fetch function to inspect cloud data
export const getUserData = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (e) {
        console.error("Get user data error:", e);
        return null;
    }
}

// Simplified auto-sync logic
export const syncData = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
           // Do nothing, AuthModal handles conflict
        } else {
            // New user on cloud (rare if registered), push local data
            await syncLocalToCloud(uid);
        }
    } catch (e) {
        console.error("Sync error:", e);
    }
};

export const subscribeToUserChanges = (uid: string, callback: () => void) => {
    return onSnapshot(doc(db, "users", uid), (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        if (source === "Server") {
             // callback();
        }
    });
};

// --- PUBLIC PROFILE FETCHING ---

export const getPublicUserProfile = async (uid: string) => {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data.leaderboardData,
                badges: data.stats?.badges || [], 
                totalTimeSpent: data.stats?.totalTimeSpent || 0
            };
        }
        return null;
    } catch (e) {
        console.error("Error fetching public profile:", e);
        return null;
    }
};

// --- FRIEND SYSTEM ---

export const addFriend = async (currentUid: string, friendCode: string) => {
    // friendCode is now the 6-char string, not UID
    if (!friendCode) throw new Error("Kod boş olamaz.");

    // Query for user with this friendCode
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("profile.friendCode", "==", friendCode), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        throw new Error("Kullanıcı bulunamadı.");
    }

    const friendDoc = querySnapshot.docs[0];
    const friendUid = friendDoc.id;
    const friendData = friendDoc.data();

    if (currentUid === friendUid) throw new Error("Kendini arkadaş olarak ekleyemezsin.");
    
    // Add to current user's friend list
    const userRef = doc(db, "users", currentUid);
    await updateDoc(userRef, {
        friends: arrayUnion(friendUid)
    });
    
    // Add mutual friendship
    const friendRef = doc(db, "users", friendUid);
    await updateDoc(friendRef, {
        friends: arrayUnion(currentUid)
    });
    
    return friendData.leaderboardData.name; // Return friend's name
};

export const getFriends = async (uid: string): Promise<LeaderboardEntry[]> => {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) return [];
        
        const friendIds = userSnap.data().friends || [];
        if (friendIds.length === 0) return [];
        
        // Fetch details for each friend
        const friendsData: LeaderboardEntry[] = [];
        for (const fid of friendIds) {
            const fSnap = await getDoc(doc(db, "users", fid));
            if (fSnap.exists()) {
                const d = fSnap.data();
                friendsData.push({
                     uid: d.uid,
                     name: d.leaderboardData.name,
                     grade: d.leaderboardData.grade,
                     xp: d.leaderboardData.xp,
                     level: d.leaderboardData.level,
                     streak: d.leaderboardData.streak,
                     avatar: d.leaderboardData.avatar,
                     frame: d.leaderboardData.frame,
                     background: d.leaderboardData.background,
                     theme: d.leaderboardData.theme,
                     value: d.leaderboardData.xp, 
                     duelWins: d.leaderboardData.duelWins || 0,
                     duelPoints: d.leaderboardData.duelPoints || 0
                 });
            }
        }
        return friendsData;
    } catch (e) {
        console.error("Error fetching friends", e);
        return [];
    }
};

// --- CHALLENGE SYSTEM ---

export const createChallenge = async (
    creatorName: string, 
    creatorScore: number, 
    wordIndices: number[], 
    unitId: string, 
    difficulty: QuizDifficulty, 
    wordCount: number,
    type: 'public' | 'private' | 'friend' = 'private',
    targetFriendId?: string
): Promise<string> => {
    if (!auth.currentUser) throw new Error("User not logged in");
    
    const challengeId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const challengeData: Challenge = {
        id: challengeId,
        type,
        creatorId: auth.currentUser.uid,
        creatorName: creatorName,
        creatorScore: creatorScore,
        wordIndices: wordIndices,
        unitId: unitId,
        difficulty: difficulty,
        wordCount: wordCount,
        status: 'waiting',
        createdAt: Date.now()
    };

    if (targetFriendId) {
        challengeData.targetFriendId = targetFriendId;
    }
    
    await setDoc(doc(db, "challenges", challengeId), challengeData);
    return challengeId;
};

export const getChallenge = async (challengeId: string): Promise<Challenge | null> => {
    const docRef = doc(db, "challenges", challengeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const data = docSnap.data() as Challenge;
        // Check expiration (24 hours)
        const now = Date.now();
        const expiration = 24 * 60 * 60 * 1000; // 24 hours
        if (now - data.createdAt > expiration) {
            return null; // Expired
        }
        return data;
    }
    return null;
};

export const getOpenChallenges = async (currentUid: string): Promise<Challenge[]> => {
    const challengesRef = collection(db, "challenges");
    const now = Date.now();
    const expiration = 24 * 60 * 60 * 1000; // 24 hours
    const validTime = now - expiration;

    // FIX: Simplified Query to avoid "Composite Index" error.
    // Instead of filtering by type and time in the query (which requires an index),
    // we fetch all 'waiting' games and filter in memory.
    // Ideally, this should use an index for performance in a large app,
    // but this ensures it works without manual console setup.
    const q = query(
        challengesRef, 
        where("status", "==", "waiting")
    );

    const snapshot = await getDocs(q);
    const challenges: Challenge[] = [];
    
    snapshot.forEach(doc => {
        const data = doc.data() as Challenge;
        
        // Client-side Filtering
        const isExpired = data.createdAt <= validTime;
        const isMyOwn = data.creatorId === currentUid;
        
        if (!isExpired && !isMyOwn) {
            // Add Public challenges
            if (data.type === 'public') {
                challenges.push(data);
            } 
            // Add Friend challenges specifically for me
            else if (data.type === 'friend' && data.targetFriendId === currentUid) {
                challenges.push(data);
            }
        }
    });
    
    // Sort by newest first
    return challenges.sort((a,b) => b.createdAt - a.createdAt);
};

export const getPastChallenges = async (currentUid: string): Promise<Challenge[]> => {
    const challengesRef = collection(db, "challenges");
    
    // We fetch all completed challenges where user was involved
    // Note: Firestore doesn't support OR queries easily across different fields without composite index.
    // We will fetch separately and merge.
    
    const qCreator = query(
        challengesRef,
        where("creatorId", "==", currentUid),
        where("status", "==", "completed"),
        limit(20)
    );

    const qOpponent = query(
        challengesRef,
        where("opponentId", "==", currentUid),
        where("status", "==", "completed"),
        limit(20)
    );

    const [snap1, snap2] = await Promise.all([getDocs(qCreator), getDocs(qOpponent)]);
    
    const challenges: Challenge[] = [];
    snap1.forEach(doc => challenges.push(doc.data() as Challenge));
    snap2.forEach(doc => challenges.push(doc.data() as Challenge));
    
    // Deduplicate and sort by date desc
    const uniqueChallenges = Array.from(new Map(challenges.map(item => [item.id, item])).values());
    return uniqueChallenges.sort((a, b) => b.createdAt - a.createdAt);
};


export const completeChallenge = async (challengeId: string, opponentName: string, opponentScore: number) => {
    const docRef = doc(db, "challenges", challengeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        const data = docSnap.data() as Challenge;
        let winnerId = 'tie';
        if (opponentScore > data.creatorScore) {
            winnerId = auth.currentUser?.uid || 'opponent';
        } else if (opponentScore < data.creatorScore) {
            winnerId = data.creatorId;
        }

        await updateDoc(docRef, {
            status: 'completed',
            opponentId: auth.currentUser?.uid,
            opponentName,
            opponentScore,
            winnerId
        });
    }
};

// --- FEEDBACK ---

export const sendFeedback = async (type: 'bug' | 'suggestion', message: string, contact: string) => {
    const feedbackRef = doc(collection(db, "feedback"));
    await setDoc(feedbackRef, {
        type,
        message,
        contact,
        uid: auth.currentUser?.uid || 'anonymous',
        timestamp: Date.now()
    });
};

// --- LEADERBOARD ---

export const getLeaderboard = async (grade: string, mode: 'xp' | 'quiz' | 'flashcard' | 'matching' | 'maze' | 'wordSearch' | 'duel'): Promise<LeaderboardEntry[]> => {
    const usersRef = collection(db, "users");
    let q;
    
    // Mapping mode to field in leaderboardData
    let field = 'leaderboardData.xp';
    if (mode === 'quiz') field = 'leaderboardData.quizCorrect'; 
    if (mode === 'flashcard') field = 'leaderboardData.cardsViewed';
    if (mode === 'matching') field = 'leaderboardData.matchingBestTime';
    if (mode === 'maze') field = 'leaderboardData.mazeHighScore';
    if (mode === 'wordSearch') field = 'leaderboardData.wordSearchHighScore';
    if (mode === 'duel') field = 'leaderboardData.duelPoints'; // Using POINTS for leaderboard sorting

    // Updated Query: Removed 'isGuest' filter to prevent composite index error.
    // Guest filtering will be done client-side.
    // Increased limit to 100 to ensure we get enough real users after filtering.
    q = query(
        usersRef, 
        orderBy(field, "desc"), 
        limit(100)
    );
    
    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];
    
    snapshot.forEach(doc => {
        const data = doc.data();
        // Client-side filtering for non-guests
        if (data.isGuest === false && data.leaderboardData) {
            let val = 0;
             if (mode === 'xp') val = data.leaderboardData.xp;
             else if (mode === 'quiz') val = data.leaderboardData.quizCorrect;
             else if (mode === 'flashcard') val = data.leaderboardData.cardsViewed;
             else if (mode === 'matching') val = data.leaderboardData.matchingBestTime;
             else if (mode === 'maze') val = data.leaderboardData.mazeHighScore;
             else if (mode === 'wordSearch') val = data.leaderboardData.wordSearchHighScore;
             else if (mode === 'duel') val = data.leaderboardData.duelPoints || 0;
             
             entries.push({
                 uid: data.uid,
                 name: data.leaderboardData.name,
                 grade: data.leaderboardData.grade,
                 xp: data.leaderboardData.xp,
                 level: data.leaderboardData.level,
                 streak: data.leaderboardData.streak,
                 avatar: data.leaderboardData.avatar,
                 frame: data.leaderboardData.frame,
                 background: data.leaderboardData.background,
                 theme: data.leaderboardData.theme,
                 value: val,
                 quizWrong: mode === 'quiz' ? data.leaderboardData.quizWrong : undefined,
                 duelWins: data.leaderboardData.duelWins || 0,
                 duelPoints: data.leaderboardData.duelPoints || 0
             });
        }
    });
    
    // Return top 50 from the filtered list
    return entries.slice(0, 50);
};