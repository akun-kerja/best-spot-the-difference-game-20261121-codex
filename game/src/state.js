// Lantern Garden — Spot the Difference: game state.
// One object owns the whole game: which level, which differences are found,
// the timer, the score, hints left, and the phase of play. Rendering and
// input read this; they never keep their own copy of it.

import { LEVELS } from './levels.js';

export const PHASES = {
  TITLE: 'title',
  PLAYING: 'playing',
  LEVEL_DONE: 'levelDone',
  GAME_DONE: 'gameDone',
  TIME_UP: 'timeUp',
};

const FIND_POINTS = 100;
const WRONG_CLICK_POINTS = 10;
const HINT_POINTS = 15;
const HINTS_PER_LEVEL = 3;
const TIME_BONUS_PER_SECOND = 5;

export class GameState {
  constructor() {
    this.levelIndex = 0;
    this.phase = PHASES.TITLE;
    this.found = new Set();
    this.score = 0;
    this.timeLeft = LEVELS[0].timeLimit;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.levelsCleared = 0;
    this.totalFound = 0;
    this.misses = 0;
    this.lastFind = null;
    this.lastMiss = null;
    this.hintSpot = null;
    this.announcement = '';
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get remaining() {
    return this.level.differences.length - this.found.size;
  }

  get levelComplete() {
    return this.remaining === 0;
  }

  startLevel(index) {
    this.levelIndex = index;
    this.phase = PHASES.PLAYING;
    this.found = new Set();
    this.timeLeft = this.level.timeLimit;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.lastFind = null;
    this.lastMiss = null;
    this.hintSpot = null;
    this.announcement = `${this.level.name} — find all ${this.level.differences.length} differences!`;
  }

  restartLevel() {
    this.startLevel(this.levelIndex);
  }

  startGame() {
    this.score = 0;
    this.levelsCleared = 0;
    this.totalFound = 0;
    this.misses = 0;
    this.startLevel(0);
  }

  // Advance the clock by dt seconds. Returns true when time just ran out.
  tick(dt) {
    if (this.phase !== PHASES.PLAYING) return false;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this.phase = PHASES.TIME_UP;
      this.announcement = `Time's up on ${this.level.name}! Press R to try again.`;
      return true;
    }
    return false;
  }

  // Try to mark a difference near (x, y) in panel coordinates.
  // Returns the found difference, or null when the click missed.
  markAt(x, y) {
    if (this.phase !== PHASES.PLAYING) return null;
    const diff = this.level.differences.find(
      (d) => !this.found.has(d.id) && Math.hypot(d.x - x, d.y - y) <= d.r,
    );
    if (diff) {
      this.found.add(diff.id);
      this.totalFound += 1;
      this.score += FIND_POINTS;
      this.lastFind = diff;
      this.lastMiss = null;
      this.hintSpot = null;
      this.announcement = `Found: ${diff.label}! ${this.remaining} to go.`;
      if (this.levelComplete) this.completeLevel();
      return diff;
    }
    this.misses += 1;
    this.score = Math.max(0, this.score - WRONG_CLICK_POINTS);
    this.lastMiss = { x, y, at: Date.now() };
    this.announcement = 'Not a difference — 10 points lost.';
    return null;
  }

  // The time bonus a cleared scene pays, in points.
  timeBonus() {
    return Math.ceil(this.timeLeft) * TIME_BONUS_PER_SECOND;
  }

  completeLevel() {
    const bonus = this.timeBonus();
    this.score += bonus;
    this.levelsCleared += 1;
    if (this.levelIndex + 1 >= LEVELS.length) {
      this.phase = PHASES.GAME_DONE;
      this.announcement =
        `You found every difference in all ${LEVELS.length} scenes! ` +
        `Time bonus ${bonus} points. Final score ${this.score}.`;
    } else {
      this.phase = PHASES.LEVEL_DONE;
      this.announcement =
        `${this.level.name} complete! Time bonus ${bonus} points. ` +
        `Press Enter for the next scene.`;
    }
  }

  nextLevel() {
    if (this.phase === PHASES.LEVEL_DONE) this.startLevel(this.levelIndex + 1);
  }

  // Reveal one unfound difference for a moment. Costs points, limited use.
  useHint() {
    if (this.phase !== PHASES.PLAYING || this.hintsLeft <= 0) return null;
    const open = this.level.differences.filter((d) => !this.found.has(d.id));
    if (open.length === 0) return null;
    const pick = open[Math.floor(Math.random() * open.length)];
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_POINTS);
    this.hintSpot = { ...pick, at: Date.now() };
    this.announcement = `Hint: look near the ${pick.label.toLowerCase().replace(/^the /, '')}.`;
    return pick;
  }

  // Pre-mark differences, for screenshots and shared replays (?found=0,2,4).
  preMark(indices) {
    indices.forEach((i) => {
      const diff = this.level.differences[i];
      if (diff) {
        this.found.add(diff.id);
        this.totalFound += 1;
        this.score += FIND_POINTS;
      }
    });
    if (this.levelComplete) this.completeLevel();
    else this.announcement = `${this.found.size} differences already found — ${this.remaining} remain.`;
  }

  formatTime() {
    const s = Math.ceil(this.timeLeft);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
}
