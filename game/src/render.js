// Lantern Garden — Spot the Difference: canvas rendering.
// Draws the two pictures, the rings around found differences, the hint
// pulse, the keyboard crosshair, and the title / win / time-up overlays.
// Pure drawing: it reads GameState and never changes it.

import { PANEL_W, PANEL_H, LEVELS } from './levels.js';
import { PHASES } from './state.js';
import { drawScene } from './scenes.js';

export const PANEL_A = { x: 10, y: 25 };
export const PANEL_B = { x: 610, y: 25 };
const CANVAS_W = 1180;
const CANVAS_H = 470;

function panelFrame(ctx, origin) {
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(origin.x - 4, origin.y - 4, PANEL_W + 8, PANEL_H + 8);
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 3;
  ctx.strokeRect(origin.x - 4, origin.y - 4, PANEL_W + 8, PANEL_H + 8);
}

function drawFoundRing(ctx, origin, diff) {
  ctx.strokeStyle = '#e53935';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(origin.x + diff.x, origin.y + diff.y, diff.r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#e53935';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const cx = origin.x + diff.x;
  const cy = origin.y + diff.y;
  ctx.beginPath();
  ctx.moveTo(cx - 7, cy);
  ctx.lineTo(cx - 2, cy + 6);
  ctx.lineTo(cx + 9, cy - 7);
  ctx.stroke();
}

function drawMiss(ctx, origin, miss) {
  const age = Date.now() - miss.at;
  if (age > 600) return;
  const alpha = 1 - age / 600;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#b3261e';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const x = origin.x + miss.x;
  const y = origin.y + miss.y;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10);
  ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10);
  ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, origin, hint) {
  const age = Date.now() - hint.at;
  if (age > 2500) return;
  const pulse = 1 + 0.15 * Math.sin(age / 130);
  ctx.save();
  ctx.globalAlpha = age > 2000 ? (2500 - age) / 500 : 1;
  ctx.strokeStyle = '#fdd835';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(origin.x + hint.x, origin.y + hint.y, (hint.r + 8) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function overlay(ctx, title, lines, action) {
  ctx.save();
  ctx.fillStyle = 'rgba(28, 20, 64, 0.72)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const w = 640;
  const h = 150 + lines.length * 30;
  const x = (CANVAS_W - w) / 2;
  const y = (CANVAS_H - h) / 2;
  ctx.fillStyle = '#fffaf0';
  ctx.strokeStyle = '#f2c14e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#c2571b';
  ctx.font = 'bold 34px Trebuchet MS, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(title, CANVAS_W / 2, y + 22);
  ctx.fillStyle = '#2b2118';
  ctx.font = '17px Trebuchet MS, sans-serif';
  lines.forEach((line, i) => {
    ctx.fillText(line, CANVAS_W / 2, y + 78 + i * 30);
  });
  ctx.fillStyle = '#3f7a4e';
  ctx.font = 'bold 18px Trebuchet MS, sans-serif';
  ctx.fillText(action, CANVAS_W / 2, y + h - 38);
  ctx.restore();
}

export function render(ctx, state, ui) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#fdf6e9';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  panelFrame(ctx, PANEL_A);
  panelFrame(ctx, PANEL_B);

  // Left picture (variant 0) and right picture (variant 1).
  ctx.save();
  ctx.translate(PANEL_A.x, PANEL_A.y);
  drawScene(ctx, state.level.scene, 0);
  ctx.restore();
  ctx.save();
  ctx.translate(PANEL_B.x, PANEL_B.y);
  drawScene(ctx, state.level.scene, 1);
  ctx.restore();

  // Rings on every found difference, on both pictures.
  for (const diff of state.level.differences) {
    if (!state.found.has(diff.id)) continue;
    drawFoundRing(ctx, PANEL_A, diff);
    drawFoundRing(ctx, PANEL_B, diff);
  }

  // Hint pulse and miss flash, on both pictures where they apply.
  if (state.hintSpot) {
    drawHintPulse(ctx, PANEL_A, state.hintSpot);
    drawHintPulse(ctx, PANEL_B, state.hintSpot);
  }
  if (state.lastMiss) {
    const panel = state.lastMiss.panel === 1 ? PANEL_B : PANEL_A;
    drawMiss(ctx, panel, state.lastMiss);
  }

  // Keyboard crosshair.
  if (ui.crosshair.visible && state.phase === PHASES.PLAYING) {
    const { x, y } = ui.crosshair;
    ctx.save();
    ctx.strokeStyle = '#c2571b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 24, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 24, y);
    ctx.moveTo(x, y - 24);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 24);
    ctx.stroke();
    ctx.restore();
  }

  // Footer strip: level name and the count, readable in screenshots.
  ctx.fillStyle = '#5d4526';
  ctx.font = 'bold 15px Trebuchet MS, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `Level ${state.levelIndex + 1} of ${LEVELS.length} · ${state.level.name} · ` +
      `${state.found.size} found · ${state.remaining} differences remain`,
    CANVAS_W / 2,
    CANVAS_H - 12,
  );

  // Overlays for the phases that stop play.
  if (state.phase === PHASES.TITLE) {
    overlay(
      ctx,
      'Lantern Garden',
      [
        'Two pictures, seven differences. Can you spot them all?',
        'Click a difference — or move the crosshair with the arrow keys',
        'and press Enter. Three scenes, 180 seconds each. Good hunting!',
      ],
      'Click or press Enter to start',
    );
  } else if (state.phase === PHASES.LEVEL_DONE) {
    overlay(
      ctx,
      `${state.level.name} complete!`,
      [
        `All 7 differences found. Score ${state.score}.`,
        `Next up: ${LEVELS[state.levelIndex + 1].name}.`,
      ],
      'Press Enter for the next scene',
    );
  } else if (state.phase === PHASES.GAME_DONE) {
    overlay(
      ctx,
      'You found them all!',
      [
        `Every difference in all ${LEVELS.length} scenes — ${state.totalFound} finds.`,
        `Final score ${state.score}. Thanks for playing!`,
      ],
      'Press Enter to play again',
    );
  } else if (state.phase === PHASES.TIME_UP) {
    overlay(
      ctx,
      "Time's up!",
      [
        `You found ${state.found.size} of 7 differences in ${state.level.name}.`,
        'The remaining differences stay hidden — try again!',
      ],
      'Press R to try this scene again',
    );
  }
}
