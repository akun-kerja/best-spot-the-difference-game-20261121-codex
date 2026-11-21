// Lantern Garden — Spot the Difference: mouse, touch and keyboard input.
// Converts a click anywhere on the canvas into a panel and a point inside
// it, and turns arrow keys into a crosshair that can mark a difference.
// It knows nothing about scoring — it only reports what the player did.

import { PANEL_W, PANEL_H } from './levels.js';
import { PANEL_A, PANEL_B } from './render.js';

const CROSSHAIR_STEP = 24;

export class InputHandler {
  constructor(canvas, callbacks) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.crosshair = {
      x: PANEL_A.x + PANEL_W / 2,
      y: PANEL_A.y + PANEL_H / 2,
      visible: false,
    };
    canvas.addEventListener('pointerdown', (event) => this.onPointer(event));
    window.addEventListener('keydown', (event) => this.onKey(event));
  }

  // Canvas pixel coordinates for a pointer event, correcting for CSS scaling.
  canvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  // Which panel (0 left, 1 right) holds the point, and where inside it.
  panelPoint(point) {
    for (const [index, origin] of [PANEL_A, PANEL_B].entries()) {
      if (
        point.x >= origin.x &&
        point.x <= origin.x + PANEL_W &&
        point.y >= origin.y &&
        point.y <= origin.y + PANEL_H
      ) {
        return { panel: index, x: point.x - origin.x, y: point.y - origin.y };
      }
    }
    return null;
  }

  onPointer(event) {
    event.preventDefault();
    const point = this.canvasPoint(event);
    this.crosshair.x = point.x;
    this.crosshair.y = point.y;
    this.crosshair.visible = true;
    const hit = this.panelPoint(point);
    if (hit) this.callbacks.onMark(hit.panel, hit.x, hit.y);
    else this.callbacks.onConfirm();
  }

  onKey(event) {
    const key = event.key;
    if (key.startsWith('Arrow')) {
      event.preventDefault();
      this.crosshair.visible = true;
      if (key === 'ArrowLeft') this.crosshair.x = Math.max(0, this.crosshair.x - CROSSHAIR_STEP);
      if (key === 'ArrowRight') this.crosshair.x = Math.min(this.canvas.width, this.crosshair.x + CROSSHAIR_STEP);
      if (key === 'ArrowUp') this.crosshair.y = Math.max(0, this.crosshair.y - CROSSHAIR_STEP);
      if (key === 'ArrowDown') this.crosshair.y = Math.min(this.canvas.height, this.crosshair.y + CROSSHAIR_STEP);
      return;
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      const hit = this.panelPoint(this.crosshair);
      if (hit) this.callbacks.onMark(hit.panel, hit.x, hit.y);
      else this.callbacks.onConfirm();
      return;
    }
    if (key === 'h' || key === 'H') {
      this.callbacks.onHint();
      return;
    }
    if (key === 'r' || key === 'R') {
      this.callbacks.onRestart();
      return;
    }
    if (key === 'm' || key === 'M') {
      this.callbacks.onMute();
      return;
    }
    if (key === '1' || key === '2' || key === '3') {
      this.callbacks.onLevel(Number(key) - 1);
      return;
    }
    // Home / End jump the crosshair to the centre of a picture.
    if (key === 'Home') {
      event.preventDefault();
      this.crosshair.x = PANEL_A.x + PANEL_W / 2;
      this.crosshair.y = PANEL_A.y + PANEL_H / 2;
      this.crosshair.visible = true;
      return;
    }
    if (key === 'End') {
      event.preventDefault();
      this.crosshair.x = PANEL_B.x + PANEL_W / 2;
      this.crosshair.y = PANEL_B.y + PANEL_H / 2;
      this.crosshair.visible = true;
    }
  }
}
