/**
 * progression.js — XP / Level system for Mind Chess
 *
 * XP sources:
 *   Solve a tactics puzzle  → +10 XP
 *   Complete a lesson        → +25 XP (defined per-lesson in learningPath.js)
 *
 * Levels follow a gentle curve: early levels come fast (encouragement),
 * later levels require more grind (retention).
 *
 * Each level carries:
 *   xpRequired  — total cumulative XP needed to reach this level
 *   title       — display name shown in Profile / Dashboard
 *   unlocks     — string tags used by content gates (checked with canAccess())
 */

export const LEVELS = [
  { level: 1,  xpRequired: 0,    title: 'Pawn',            unlocks: [] },
  { level: 2,  xpRequired: 50,   title: 'Squire',          unlocks: ['tactics_medium'] },
  { level: 3,  xpRequired: 150,  title: 'Knight Errant',   unlocks: ['openings_basic'] },
  { level: 4,  xpRequired: 300,  title: 'Club Player',     unlocks: ['tactics_hard', 'endgames_basic'] },
  { level: 5,  xpRequired: 500,  title: 'Tournament Ready',unlocks: ['ai_intermediate'] },
  { level: 6,  xpRequired: 750,  title: 'Tactician',       unlocks: ['library_full'] },
  { level: 7,  xpRequired: 1050, title: 'Strategist',      unlocks: ['ai_advanced'] },
  { level: 8,  xpRequired: 1400, title: 'Expert',          unlocks: ['tactics_elite'] },
  { level: 9,  xpRequired: 1800, title: 'Candidate Master',unlocks: ['ai_master'] },
  { level: 10, xpRequired: 2250, title: 'Mind Chess Master',unlocks: ['prestige'] },
];

/**
 * Returns the level entry the player is currently ON for a given XP total.
 * Also returns progress within the current level (0–1 float) and XP to next.
 *
 * @param {number} xp
 * @returns {{ level, title, unlocks, xpIntoLevel, xpNeeded, progress, isMax }}
 */
export function getLevelForXP(xp) {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      break;
    }
  }

  const isMax = current.level === LEVELS[LEVELS.length - 1].level;
  const next = isMax ? null : LEVELS[current.level]; // LEVELS is 0-indexed but level starts at 1

  const xpIntoLevel = xp - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 0;
  const progress = isMax ? 1 : xpNeeded > 0 ? Math.min(1, xpIntoLevel / xpNeeded) : 1;

  return {
    ...current,
    xpIntoLevel,
    xpNeeded,
    progress,
    isMax,
  };
}

/**
 * Returns all unlocked tags for a given XP total.
 * Tags accumulate — higher levels include all lower-level unlocks.
 *
 * @param {number} xp
 * @returns {Set<string>}
 */
export function getUnlocks(xp) {
  const { level } = getLevelForXP(xp);
  const tags = new Set();
  for (const l of LEVELS) {
    if (l.level <= level) l.unlocks.forEach(t => tags.add(t));
  }
  return tags;
}

/**
 * Quick gate check — returns true if the player has unlocked the given tag.
 *
 * @param {number} xp
 * @param {string} tag
 * @returns {boolean}
 */
export function canAccess(xp, tag) {
  return getUnlocks(xp).has(tag);
}

/**
 * XP awarded for game actions.
 */
export const XP = {
  PUZZLE_SOLVED: 10,
  LESSON_COMPLETED: 25,
};
