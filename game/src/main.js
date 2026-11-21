// Lantern Garden — Spot the Difference: entry point.
// Wires the DOM, the state, the renderer and the input together, runs the
// clock and the animation loop, and keeps the HUD in step with the game.
// Screenshot mode: ?level=0&found=0,2,4&t=137 starts a level at once with
// those differences already found and the timer set — the same code path
// a player takes by clicking, so the screenshots are honest renders.

import { LEVELS } from './levels.js';
import { GameState, PHASES } from './state.js';
import { SoundBank } from './audio.js';
import { InputHandler } from './input.js';
import { render } from './render.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const foundCountEl = document.getElementById('foundCount');
const remainCountEl = document.getElementById('remainCount');
const timeLeftEl = document.getElementById('timeLeft');
const scoreEl = document.getElementById('scoreValue');
const levelNameEl = document.getElementById('levelName');
const foundListEl = document.getElementById('foundList');
const foundEmptyEl = document.getElementById('foundEmpty');
const hintButton = document.getElementById('hintButton');
const restartButton = document.getElementById('restartButton');
const muteButton = document.getElementById('muteButton');

const state = new GameState();
const sounds = new SoundBank();
let lastTickSecond = -1;
let lastTime = performance.now();

function syncHud() {
  foundCountEl.textContent = `${state.found.size} / ${state.level.differences.length}`;
  remainCountEl.textContent = String(state.remaining);
  timeLeftEl.textContent = state.formatTime();
  timeLeftEl.classList.toggle('low', state.timeLeft <= 30 && state.phase === PHASES.PLAYING);
  scoreEl.textContent = String(state.score);
  levelNameEl.textContent = state.level.name;
  hintButton.disabled = state.hintsLeft <= 0 || state.phase !== PHASES.PLAYING;
  hintButton.textContent = `Hint (H) · ${state.hintsLeft} left`;
  document.querySelectorAll('.level-dot').forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.level) === state.levelIndex);
  });
  const found = state.level.differences.filter((d) => state.found.has(d.id));
  foundListEl.innerHTML = '';
  found.forEach((diff) => {
    const item = document.createElement('li');
    item.textContent = diff.label;
    foundListEl.appendChild(item);
  });
  foundEmptyEl.style.display = found.length === 0 ? '' : 'none';
  if (state.announcement) statusEl.textContent = state.announcement;
}

const input = new InputHandler(canvas, {
  onMark(panel, x, y) {
    if (state.phase === PHASES.TITLE) {
      state.startGame();
      syncHud();
      return;
    }
    if (state.phase !== PHASES.PLAYING) return;
    sounds.ensure();
    const found = state.markAt(x, y);
    if (found) {
      sounds.playFind();
      if (state.phase === PHASES.LEVEL_DONE || state.phase === PHASES.GAME_DONE) {
        sounds.playWin();
      }
    } else {
      sounds.playMiss();
      state.lastMiss = { ...state.lastMiss, panel };
    }
    syncHud();
  },
  onConfirm() {
    if (state.phase === PHASES.TITLE) {
      state.startGame();
    } else if (state.phase === PHASES.LEVEL_DONE) {
      state.nextLevel();
    } else if (state.phase === PHASES.GAME_DONE) {
      state.startGame();
    } else if (state.phase === PHASES.TIME_UP) {
      state.restartLevel();
    }
    syncHud();
  },
  onHint() {
    if (state.useHint()) {
      sounds.playHint();
      syncHud();
    }
  },
  onRestart() {
    state.restartLevel();
    syncHud();
  },
  onMute() {
    const muted = sounds.toggleMute();
    muteButton.textContent = muted ? 'Sound: Off' : 'Sound: On';
  },
  onLevel(index) {
    if (index >= 0 && index < LEVELS.length) {
      state.startLevel(index);
      sounds.playStart();
      syncHud();
    }
  },
});

hintButton.addEventListener('click', () => {
  if (state.useHint()) {
    sounds.playHint();
    syncHud();
  }
});
restartButton.addEventListener('click', () => {
  state.restartLevel();
  syncHud();
});
muteButton.addEventListener('click', () => {
  const muted = sounds.toggleMute();
  muteButton.textContent = muted ? 'Sound: Off' : 'Sound: On';
});
document.querySelectorAll('.level-dot').forEach((button) => {
  button.addEventListener('click', () => {
    state.startLevel(Number(button.dataset.level));
    sounds.playStart();
    syncHud();
  });
});

// Screenshot / replay mode from the URL: ?level=1&found=0,2,4&t=120
function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('level')) return;
  const level = Math.min(Math.max(Number(params.get('level')) || 0, 0), LEVELS.length - 1);
  state.startLevel(level);
  if (params.has('found')) {
    const indices = params
      .get('found')
      .split(',')
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n));
    state.preMark(indices);
  }
  if (params.has('t')) {
    const t = Number(params.get('t'));
    if (Number.isFinite(t) && t > 0) state.timeLeft = Math.min(t, state.level.timeLimit);
  }
  syncHud();
}

function frame(now) {
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  const ranOut = state.tick(dt);
  if (ranOut) sounds.playMiss();
  const second = Math.ceil(state.timeLeft);
  if (state.phase === PHASES.PLAYING && second <= 10 && second !== lastTickSecond) {
    lastTickSecond = second;
    sounds.playTick();
  }
  render(ctx, state, input);
  syncHud();
  requestAnimationFrame(frame);
}

// A small handle for play-testing and debugging (used by the screenshot
// driver, and handy in the browser console). Read-only from the page's
// point of view: it exposes the same objects the HUD already shows.
window.__lanternGarden = { state, input, sounds };

applyQueryState();
syncHud();
requestAnimationFrame(frame);
