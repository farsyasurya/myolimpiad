import { initialLevels } from '../data/levels.js';
import { questionsData } from '../data/questions.js';

const STORAGE_KEY = 'gameProgress';

/**
 * Service to manage game data and user progress.
 * Currently uses localStorage for persistence, but follows an asynchronous
 * clean interface design so migrating to Firebase Firestore / Cloud Functions
 * in the future only requires changing this service file!
 */

// Initialize default progress state
const getDefaultProgress = () => {
  const progress = {};
  initialLevels.forEach((level) => {
    progress[level.id] = {
      unlocked: level.id === 1, // Level 1 is always unlocked
      completed: false,
      stars: 0,
      bestScore: 0,
      attempts: 0
    };
  });
  return progress;
};

// Read progress from localStorage or initialize
export const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultState = getDefaultProgress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
      return defaultState;
    }
    const parsed = JSON.parse(raw);
    // Ensure level 1 is always unlocked
    if (parsed && parsed[1]) {
      parsed[1].unlocked = true;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load progress from localStorage:', error);
    return getDefaultProgress();
  }
};

// Save progress to localStorage
export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress to localStorage:', error);
  }
};

// Combine level definitions with user progress
export const getAllLevels = () => {
  const progress = loadProgress();
  return initialLevels.map((lvl) => {
    const userLvl = progress[lvl.id] || {
      unlocked: lvl.id === 1,
      completed: false,
      stars: 0,
      bestScore: 0
    };

    return {
      ...lvl,
      unlocked: userLvl.unlocked,
      completed: userLvl.completed,
      stars: userLvl.stars,
      bestScore: userLvl.bestScore
    };
  });
};

// Get a single level detail
export const getLevelById = (levelId) => {
  const id = Number(levelId);
  const levels = getAllLevels();
  return levels.find((l) => l.id === id) || null;
};

// Fetch questions for a level
export const getQuestionsForLevel = (levelId) => {
  const id = Number(levelId);
  return questionsData[id] || [];
};

/**
 * Save quiz results and handle level unlock progression
 * @param {number} levelId
 * @param {number} score (0-100)
 * @param {number} stars (0-3)
 * @param {number} correctCount
 * @param {number} wrongCount
 */
export const recordLevelCompletion = (levelId, score, stars, correctCount, wrongCount) => {
  const id = Number(levelId);
  const progress = loadProgress();

  const currentLevelProgress = progress[id] || {
    unlocked: true,
    completed: false,
    stars: 0,
    bestScore: 0,
    attempts: 0
  };

  // Update current level stats (retain highest stars and best score)
  const isPassed = stars >= 1 || score >= 50; // At least 50% to pass and unlock next
  const updatedStars = Math.max(currentLevelProgress.stars, stars);
  const updatedBestScore = Math.max(currentLevelProgress.bestScore, score);

  progress[id] = {
    ...currentLevelProgress,
    unlocked: true,
    completed: currentLevelProgress.completed || isPassed,
    stars: updatedStars,
    bestScore: updatedBestScore,
    attempts: (currentLevelProgress.attempts || 0) + 1,
    lastPlayed: new Date().toISOString()
  };

  // If passed, unlock the next level (up to max level 10)
  const nextLevelId = id + 1;
  if (isPassed && nextLevelId <= initialLevels.length) {
    if (!progress[nextLevelId]) {
      progress[nextLevelId] = {
        unlocked: true,
        completed: false,
        stars: 0,
        bestScore: 0,
        attempts: 0
      };
    } else {
      progress[nextLevelId].unlocked = true;
    }
  }

  saveProgress(progress);
  return {
    progress,
    unlockedNext: isPassed && nextLevelId <= initialLevels.length ? nextLevelId : null,
    levels: getAllLevels()
  };
};

// Calculate summary stats (stars, completed count, overall score)
export const getGameStats = () => {
  const levels = getAllLevels();
  const totalStars = levels.reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const maxStars = levels.length * 3;
  const completedCount = levels.filter((l) => l.completed).length;
  const totalScore = levels.reduce((acc, curr) => acc + (curr.bestScore || 0), 0);
  const unlockedCount = levels.filter((l) => l.unlocked).length;

  return {
    totalStars,
    maxStars,
    completedCount,
    totalLevels: levels.length,
    totalScore,
    unlockedCount
  };
};

// Reset all game progress
export const resetGameProgress = () => {
  const defaultState = getDefaultProgress();
  saveProgress(defaultState);
  return getAllLevels();
};
