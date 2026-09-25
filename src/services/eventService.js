import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc 
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from './firebase';

const EVENTS_STORAGE_KEY = 'edu_events_data';
const LEADERBOARD_STORAGE_KEY = 'edu_leaderboard_data';

// Helper: Generate exactly 4 random numeric digits (e.g. "4821")
export const generate4DigitCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Helper for local mock storage
const getLocalEvents = () => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalEvents = (events) => {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
};

const getLocalLeaderboards = () => {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalLeaderboards = (board) => {
  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(board));
};

// Helper sorting for Leaderboard:
// 1. Level Tertinggi (DESC)
// 2. Bintang Tertinggi (DESC)
// 3. Skor Tertinggi (DESC)
// 4. Durasi Pengerjaan Tercepat (ASC - semakin sedikit detik, semakin unggul)
export const sortLeaderboardList = (list = []) => {
  return [...list].sort((a, b) => {
    // 1. Level tertinggi
    const levelDiff = (b.levelsCompleted || 0) - (a.levelsCompleted || 0);
    if (levelDiff !== 0) return levelDiff;

    // 2. Bintang tertinggi
    const starDiff = (b.totalStars || 0) - (a.totalStars || 0);
    if (starDiff !== 0) return starDiff;

    // 3. Skor tertinggi
    const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
    if (scoreDiff !== 0) return scoreDiff;

    // 4. Durasi tercepat (waktu lebih kecil lebih baik)
    const durA = a.totalDurationSeconds || 999999;
    const durB = b.totalDurationSeconds || 999999;
    return durA - durB;
  });
};

// 1. Create a new competition event (with 4-digit numeric code)
export const createEvent = async (adminUser, { title, description, code }) => {
  // If code is not provided or not 4 digits, automatically generate 4 digits
  let finalCode = (code || '').trim();
  if (!finalCode || !/^\d{4}$/.test(finalCode)) {
    finalCode = generate4DigitCode();
  }

  const eventId = 'evt_' + Date.now();

  const newEvent = {
    id: eventId,
    adminId: adminUser.uid,
    adminName: adminUser.displayName || 'Penyelenggara Lomba',
    title: title.trim(),
    description: (description || '').trim(),
    code: finalCode,
    status: 'draft', // 'draft' -> 'open' -> 'closed'
    createdAt: new Date().toISOString(),
    levels: [
      {
        id: 1,
        name: 'Babak 1: Pemanasan MTK',
        theme: 'Dasar Berhitung',
        questions: []
      }
    ]
  };

  try {
    if (isLiveFirebaseConfigured() && db) {
      await setDoc(doc(db, 'events', eventId), newEvent);
    }
  } catch (err) {
    console.warn("Firestore save fallback to local:", err.message);
  }

  const events = getLocalEvents();
  events.unshift(newEvent);
  saveLocalEvents(events);

  return newEvent;
};

// 2. Get events created by an admin
export const getEventsByAdmin = async (adminId) => {
  try {
    if (isLiveFirebaseConfigured() && db) {
      const q = query(collection(db, 'events'), where('adminId', '==', adminId));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => list.push(doc.data()));
      if (list.length > 0) return list;
    }
  } catch (err) {
    console.warn(err);
  }

  const events = getLocalEvents();
  return events.filter((e) => e.adminId === adminId);
};

// 3. Get all published / open events for users to join
export const getOpenEvents = async () => {
  try {
    if (isLiveFirebaseConfigured() && db) {
      const q = query(collection(db, 'events'), where('status', '==', 'open'));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => list.push(doc.data()));
      if (list.length > 0) return list;
    }
  } catch (err) {
    console.warn(err);
  }

  const events = getLocalEvents();
  return events.filter((e) => e.status === 'open');
};

// 4. Find event by 4-digit code
export const getEventByCode = async (code) => {
  const cleanCode = (code || '').trim();

  try {
    if (isLiveFirebaseConfigured() && db) {
      const q = query(collection(db, 'events'), where('code', '==', cleanCode));
      const querySnapshot = await getDocs(q);
      let found = null;
      querySnapshot.forEach((doc) => {
        found = doc.data();
      });
      if (found) return found;
    }
  } catch (err) {
    console.warn(err);
  }

  const events = getLocalEvents();
  return events.find((e) => e.code === cleanCode) || null;
};

// 5. Get event by ID
export const getEventById = async (eventId) => {
  try {
    if (isLiveFirebaseConfigured() && db) {
      const docSnap = await getDoc(doc(db, 'events', eventId));
      if (docSnap.exists()) return docSnap.data();
    }
  } catch (err) {
    console.warn(err);
  }

  const events = getLocalEvents();
  return events.find((e) => e.id === eventId) || null;
};

// 6. Toggle or Open Event status
export const setEventStatus = async (eventId, newStatus) => {
  try {
    if (isLiveFirebaseConfigured() && db) {
      await updateDoc(doc(db, 'events', eventId), { status: newStatus });
    }
  } catch (err) {
    console.warn(err);
  }

  const events = getLocalEvents();
  const target = events.find((e) => e.id === eventId);
  if (target) {
    target.status = newStatus;
    saveLocalEvents(events);
  }
  return target;
};

// 7. Add Level to Event
export const addLevelToEvent = async (eventId, { name, theme }) => {
  const events = getLocalEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error("Event tidak ditemukan.");

  const newLevelId = event.levels.length + 1;
  const newLevel = {
    id: newLevelId,
    name: name || `Babak ${newLevelId}`,
    theme: theme || 'Matematika Seru',
    questions: []
  };

  event.levels.push(newLevel);
  saveLocalEvents(events);

  try {
    if (isLiveFirebaseConfigured() && db) {
      await updateDoc(doc(db, 'events', eventId), { levels: event.levels });
    }
  } catch (err) {
    console.warn(err);
  }

  return newLevel;
};

// 8. Add Question to Level
export const addQuestionToLevel = async (eventId, levelId, { question, options, correctOption, explanation }) => {
  const events = getLocalEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error("Event tidak ditemukan.");

  const level = event.levels.find((l) => l.id === Number(levelId));
  if (!level) throw new Error("Level tidak ditemukan.");

  const optionIndexMap = { A: 0, B: 1, C: 2, D: 3 };
  const answerIdx = optionIndexMap[correctOption] ?? 0;
  const answer = options[answerIdx];

  const newQuestion = {
    id: Date.now(),
    question: question.trim(),
    options,
    answer,
    correctOption,
    explanation: explanation ? explanation.trim() : ''
  };

  level.questions.push(newQuestion);
  saveLocalEvents(events);

  try {
    if (isLiveFirebaseConfigured() && db) {
      await updateDoc(doc(db, 'events', eventId), { levels: event.levels });
    }
  } catch (err) {
    console.warn(err);
  }

  return newQuestion;
};

// 9. Save User Score & Duration -> Update Leaderboard
export const recordUserEventScore = async ({
  eventId,
  userId,
  userName,
  levelId,
  score,
  stars,
  durationSeconds = 0
}) => {
  const boards = getLocalLeaderboards();
  let userEntry = boards.find((b) => b.eventId === eventId && b.userId === userId);

  if (!userEntry) {
    userEntry = {
      id: `${eventId}_${userId}`,
      eventId,
      userId,
      userName: userName || 'Peserta',
      levelScores: {},
      totalScore: 0,
      totalStars: 0,
      levelsCompleted: 0,
      highestLevel: 0,
      totalDurationSeconds: 0,
      lastUpdated: new Date().toISOString()
    };
    boards.push(userEntry);
  }

  // Update level score and duration
  const existingLevel = userEntry.levelScores[levelId] || { score: 0, stars: 0, durationSeconds: 0 };
  userEntry.levelScores[levelId] = {
    score: Math.max(existingLevel.score, score),
    stars: Math.max(existingLevel.stars, stars),
    // Keep fastest duration or accumulate
    durationSeconds: existingLevel.durationSeconds > 0
      ? Math.min(existingLevel.durationSeconds, durationSeconds)
      : durationSeconds
  };

  // Recalculate totals
  let tScore = 0;
  let tStars = 0;
  let compCount = 0;
  let maxLevel = 0;
  let totalDur = 0;

  Object.entries(userEntry.levelScores).forEach(([lvlId, lvl]) => {
    tScore += lvl.score;
    tStars += lvl.stars;
    totalDur += lvl.durationSeconds || 0;
    if (lvl.stars >= 1 || lvl.score >= 50) {
      compCount += 1;
      maxLevel = Math.max(maxLevel, Number(lvlId));
    }
  });

  userEntry.totalScore = tScore;
  userEntry.totalStars = tStars;
  userEntry.levelsCompleted = compCount;
  userEntry.highestLevel = maxLevel;
  userEntry.totalDurationSeconds = totalDur;
  userEntry.lastUpdated = new Date().toISOString();

  saveLocalLeaderboards(boards);

  try {
    if (isLiveFirebaseConfigured() && db) {
      await setDoc(doc(db, 'leaderboards', userEntry.id), userEntry);
    }
  } catch (err) {
    console.warn(err);
  }

  return userEntry;
};

// 10. Get Leaderboard for an Event (sorted by level, stars, score, fastest duration)
export const getEventLeaderboard = async (eventId) => {
  try {
    if (isLiveFirebaseConfigured() && db) {
      const q = query(collection(db, 'leaderboards'), where('eventId', '==', eventId));
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => list.push(doc.data()));
      if (list.length > 0) {
        return sortLeaderboardList(list);
      }
    }
  } catch (err) {
    console.warn(err);
  }

  const boards = getLocalLeaderboards();
  const filtered = boards.filter((b) => b.eventId === eventId);
  return sortLeaderboardList(filtered);
};
