// Lantern Garden — Spot the Difference: scene art.
// Every picture is drawn with canvas code — no images, no network.
// Each scene draws the same base twice; `variant` 0 is the left picture
// and 1 is the right picture, which differs at exactly the seven spots
// listed for the level in levels.js (coordinates read from there so the
// art and the hit-zones can never drift apart).

import { LEVELS, PANEL_W, PANEL_H } from './levels.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function cloud(ctx, x, y, scale) {
  ctx.fillStyle = 'rgba(255, 244, 224, 0.92)';
  ctx.beginPath();
  ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
  ctx.arc(x + 20 * scale, y - 8 * scale, 22 * scale, 0, Math.PI * 2);
  ctx.arc(x + 42 * scale, y, 18 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function fullMoon(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.22, 0, Math.PI * 2);
  ctx.arc(x + r * 0.35, y + r * 0.3, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
}

function crescentMoon(ctx, x, y, r, colour, skyColour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  // Bite taken out of the moon, painted in the sky colour behind it.
  ctx.fillStyle = skyColour;
  ctx.beginPath();
  ctx.arc(x + r * 0.45, y - r * 0.15, r * 0.9, 0, Math.PI * 2);
  ctx.fill();
}

function butterfly(ctx, x, y) {
  ctx.fillStyle = '#7b5cff';
  ctx.beginPath();
  ctx.ellipse(x - 9, y - 6, 10, 7, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 9, y - 6, 10, 7, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - 8, y + 7, 8, 6, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 8, y + 7, 8, 6, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#3a2a66';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 10);
  ctx.stroke();
}

function flower(ctx, x, y, colour) {
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 18);
  ctx.stroke();
  ctx.fillStyle = colour;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------- garden
function drawGarden(ctx, variant) {
  const diffs = LEVELS[0].differences;
  const at = (id) => diffs.find((d) => d.id === id);

  sky(ctx, '#ff9d5c', '#7a4a8f');
  // Sun low over the hills.
  ctx.fillStyle = '#ffd54f';
  ctx.beginPath();
  ctx.arc(90, 300, 34, 0, Math.PI * 2);
  ctx.fill();
  // Moon: full on the left, crescent on the right.
  if (variant === 0) fullMoon(ctx, at('moon').x, at('moon').y, 22, '#fff6d8');
  else crescentMoon(ctx, at('moon').x, at('moon').y, 22, '#fff6d8', '#e98a68');
  // Clouds: three on the left, two on the right.
  cloud(ctx, 180, 60, 1);
  cloud(ctx, 300, 44, 0.8);
  if (variant === 0) cloud(ctx, at('cloud').x, at('cloud').y, 0.9);

  // Hills and grass.
  ctx.fillStyle = '#5d8a4a';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(180, 290, 360, 330);
  ctx.quadraticCurveTo(470, 355, 560, 325);
  ctx.lineTo(560, 420);
  ctx.lineTo(0, 420);
  ctx.fill();
  ctx.fillStyle = '#6fa055';
  ctx.fillRect(0, 380, 560, 40);

  // Pond with lily pads, bottom right.
  ctx.fillStyle = '#4a90c2';
  ctx.beginPath();
  ctx.ellipse(452, 362, 78, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3f7a4e';
  ctx.beginPath();
  ctx.ellipse(420, 352, 22, 9, 0.3, 0, Math.PI * 2);
  ctx.ellipse(478, 372, 20, 8, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Frog sits on a pad on the left only.
  if (variant === 0) {
    ctx.fillStyle = '#57a773';
    ctx.beginPath();
    ctx.arc(at('frog').x, at('frog').y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(at('frog').x - 7, at('frog').y - 10, 5, 0, Math.PI * 2);
    ctx.arc(at('frog').x + 7, at('frog').y - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1b1b1b';
    ctx.beginPath();
    ctx.arc(at('frog').x - 7, at('frog').y - 10, 2, 0, Math.PI * 2);
    ctx.arc(at('frog').x + 7, at('frog').y - 10, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Big tree on the left, with hanging lanterns.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(52, 180, 26, 150);
  ctx.fillStyle = '#3f7a4e';
  ctx.beginPath();
  ctx.arc(65, 150, 78, 0, Math.PI * 2);
  ctx.arc(120, 185, 52, 0, Math.PI * 2);
  ctx.arc(20, 195, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7cb342';
  ctx.beginPath();
  ctx.arc(65, 130, 48, 0, Math.PI * 2);
  ctx.fill();
  // Lanterns: three on the left, two on the right.
  const lanternSpots = [[150, 152], [200, 168], [at('lantern').x, at('lantern').y]];
  lanternSpots.forEach(([lx, ly], i) => {
    if (i === 2 && variant === 1) return;
    ctx.strokeStyle = '#4e342e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, ly - 26);
    ctx.lineTo(lx, ly - 12);
    ctx.stroke();
    ctx.fillStyle = '#ff7043';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.ellipse(lx, ly, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Butterfly: left only.
  if (variant === 0) butterfly(ctx, at('butterfly').x, at('butterfly').y);

  // Fence with the cat.
  ctx.fillStyle = '#8d6e63';
  for (let i = 0; i < 6; i++) ctx.fillRect(300 + i * 44, 300, 10, 60);
  ctx.fillRect(296, 306, 264, 8);
  ctx.fillRect(296, 330, 264, 8);
  // Cat sitting on the fence rail.
  const cx = 420, cy = 300;
  ctx.fillStyle = '#37474f';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 6, 22, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 14, cy - 22, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - 30);
  ctx.lineTo(cx + 9, cy - 40);
  ctx.lineTo(cx + 13, cy - 30);
  ctx.moveTo(cx + 16, cy - 31);
  ctx.lineTo(cx + 20, cy - 40);
  ctx.lineTo(cx + 23, cy - 30);
  ctx.fill();
  // Tail: up on the left, drooping on the right.
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy + 2);
  if (variant === 0) ctx.quadraticCurveTo(cx - 34, cy - 6, cx - 30, cy - 26);
  else ctx.quadraticCurveTo(cx - 32, cy + 8, cx - 26, cy + 22);
  ctx.stroke();

  // Flowers along the bottom.
  flower(ctx, 120, 372, '#ef5350');
  flower(ctx, at('flower').x, at('flower').y, variant === 0 ? '#ef5350' : '#ffd54f');
  flower(ctx, 240, 384, '#ab47bc');
  flower(ctx, 330, 372, '#ef5350');
  flower(ctx, 500, 392, '#ab47bc');
  flower(ctx, 60, 392, '#ffd54f');
}

// ---------------------------------------------------------------- harbour
function drawHarbour(ctx, variant) {
  const diffs = LEVELS[1].differences;
  const at = (id) => diffs.find((d) => d.id === id);

  sky(ctx, '#bfe3f2', '#e8f4f8');
  ctx.fillStyle = '#fff59d';
  ctx.beginPath();
  ctx.arc(480, 70, 30, 0, Math.PI * 2);
  ctx.fill();
  // Gulls: three on the left, two on the right.
  ctx.strokeStyle = '#37474f';
  ctx.lineWidth = 2.5;
  const gulls = [[150, 60], [230, 90], [at('gull').x, at('gull').y]];
  gulls.forEach(([gx, gy], i) => {
    if (i === 2 && variant === 1) return;
    ctx.beginPath();
    ctx.moveTo(gx - 12, gy);
    ctx.quadraticCurveTo(gx - 5, gy - 9, gx, gy);
    ctx.quadraticCurveTo(gx + 5, gy - 9, gx + 12, gy);
    ctx.stroke();
  });

  // Sea.
  ctx.fillStyle = '#2e7fa8';
  ctx.fillRect(0, 250, 560, 170);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 110, 285 + (i % 2) * 26);
    ctx.quadraticCurveTo(60 + i * 110, 278 + (i % 2) * 26, 100 + i * 110, 285 + (i % 2) * 26);
    ctx.stroke();
  }

  // Lighthouse on the left.
  ctx.fillStyle = '#eceff1';
  ctx.beginPath();
  ctx.moveTo(52, 250);
  ctx.lineTo(60, 110);
  ctx.lineTo(84, 110);
  ctx.lineTo(92, 250);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e53935';
  ctx.fillRect(56, 170, 32, 22);
  ctx.fillRect(58, 220, 28, 20);
  // Lamp room: glowing on the left, dark on the right.
  ctx.fillStyle = '#37474f';
  ctx.fillRect(56, 84, 32, 28);
  ctx.fillStyle = variant === 0 ? '#ffeb3b' : '#546e7a';
  ctx.fillRect(61, 89, 22, 18);
  if (variant === 0) {
    ctx.fillStyle = 'rgba(255, 235, 59, 0.25)';
    ctx.beginPath();
    ctx.moveTo(56, 98);
    ctx.lineTo(10, 78);
    ctx.lineTo(10, 118);
    ctx.closePath();
    ctx.fill();
  }
  // Flag: present on the left only.
  if (variant === 0) {
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(72, 84);
    ctx.lineTo(72, 46);
    ctx.stroke();
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.moveTo(72, 46);
    ctx.lineTo(96, 52);
    ctx.lineTo(72, 60);
    ctx.closePath();
    ctx.fill();
  }

  // Sailboat mid-water. Sail: white on the left, red-striped on the right.
  const bx = 280, by = 250;
  ctx.fillStyle = '#6d4c41';
  ctx.beginPath();
  ctx.moveTo(bx - 42, by);
  ctx.lineTo(bx + 42, by);
  ctx.lineTo(bx + 30, by + 16);
  ctx.lineTo(bx - 30, by + 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(bx, by - 62);
  ctx.stroke();
  ctx.fillStyle = variant === 0 ? '#fafafa' : '#e53935';
  ctx.beginPath();
  ctx.moveTo(bx, by - 60);
  ctx.lineTo(bx + 34, by - 6);
  ctx.lineTo(bx, by - 6);
  ctx.closePath();
  ctx.fill();
  if (variant === 1) {
    ctx.strokeStyle = '#fafafa';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(bx + 12, by - 44);
    ctx.lineTo(bx + 24, by - 20);
    ctx.stroke();
  }

  // Buoy: red on the left, yellow on the right.
  ctx.fillStyle = variant === 0 ? '#e53935' : '#fdd835';
  ctx.beginPath();
  ctx.arc(at('buoy').x, at('buoy').y, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#37474f';
  ctx.fillRect(at('buoy').x - 2, at('buoy').y - 20, 4, 10);

  // Pier on the right, with crates and the fisherman.
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(380, 330, 180, 14);
  ctx.fillRect(396, 344, 12, 50);
  ctx.fillRect(520, 344, 12, 50);
  // Crates: three on the left, two on the right.
  ctx.fillStyle = '#a1887f';
  ctx.fillRect(452, 302, 28, 28);
  ctx.fillRect(482, 302, 28, 28);
  if (variant === 0) ctx.fillRect(467, 274, 28, 28);
  ctx.strokeStyle = '#5d4037';
  ctx.lineWidth = 2;
  ctx.strokeRect(452, 302, 28, 28);
  ctx.strokeRect(482, 302, 28, 28);
  if (variant === 0) ctx.strokeRect(467, 274, 28, 28);
  // Fisherman with a rod and a net.
  ctx.strokeStyle = '#4e342e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(200, 300);
  ctx.lineTo(200, 330);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(200, 302);
  ctx.quadraticCurveTo(160, 270, 130, 250);
  ctx.stroke();
  ctx.fillStyle = '#1565c0';
  ctx.beginPath();
  ctx.arc(200, 288, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0d47a1';
  ctx.fillRect(196, 296, 8, 14);
  ctx.beginPath();
  ctx.moveTo(196, 296);
  ctx.lineTo(204, 296);
  ctx.lineTo(208, 310);
  ctx.lineTo(192, 310);
  ctx.closePath();
  ctx.fill();
  // Fish in the net: left only.
  if (variant === 0) {
    ctx.fillStyle = '#ffca28';
    ctx.beginPath();
    ctx.ellipse(at('fish').x, at('fish').y, 12, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(at('fish').x + 11, at('fish').y);
    ctx.lineTo(at('fish').x + 18, at('fish').y - 5);
    ctx.lineTo(at('fish').x + 18, at('fish').y + 5);
    ctx.closePath();
    ctx.fill();
  }
}

// ---------------------------------------------------------------- market
function drawMarket(ctx, variant) {
  const diffs = LEVELS[2].differences;
  const at = (id) => diffs.find((d) => d.id === id);

  // Night sky.
  sky(ctx, '#1c1440', '#4a2a6e');
  ctx.fillStyle = '#fff';
  [[40, 30], [160, 44], [260, 24], [350, 40], [470, 30], [520, 90], [60, 110]].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  // Moon: full on the left, crescent on the right.
  if (variant === 0) fullMoon(ctx, at('moon').x, at('moon').y, 20, '#fff6d8');
  else crescentMoon(ctx, at('moon').x, at('moon').y, 20, '#fff6d8', '#241a4d');

  // String lights across the top.
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(280, 90, 560, 30);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const lx = t * 560;
    const ly = 30 + Math.sin(t * Math.PI) * 42;
    const bulbOut = variant === 1 && i === 4;
    ctx.fillStyle = bulbOut ? '#5d4037' : ['#ff5252', '#ffd54f', '#69f0ae'][i % 3];
    ctx.beginPath();
    ctx.arc(lx, ly + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    if (!bulbOut) {
      ctx.fillStyle = 'rgba(255, 213, 79, 0.25)';
      ctx.beginPath();
      ctx.arc(lx, ly + 8, 12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Ground.
  ctx.fillStyle = '#6d4c41';
  ctx.fillRect(0, 360, 560, 60);

  // Three stalls.
  const stalls = [
    { x: 40, colour: '#e53935', sign: 'TEA' },
    { x: 210, colour: '#1e88e5', sign: 'TOYS' },
    { x: 380, colour: '#43a047', sign: 'FRUIT' },
  ];
  stalls.forEach((stall, i) => {
    // Awning: the middle stall loses a stripe on the right.
    ctx.fillStyle = stall.colour;
    ctx.fillRect(stall.x, 150, 140, 26);
    ctx.fillStyle = '#fff';
    for (let s = 0; s < 4; s++) {
      if (i === 1 && variant === 1 && s === 2) continue;
      ctx.fillRect(stall.x + 8 + s * 35, 150, 17, 26);
    }
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(stall.x + 6, 176, 128, 90);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(stall.x + 6, 176, 128, 10);
    // Sign board.
    ctx.fillStyle = '#fff8e1';
    ctx.fillRect(stall.x + 30, 190, 80, 30);
    ctx.fillStyle = '#3e2723';
    ctx.font = 'bold 16px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let text = stall.sign;
    if (i === 0 && variant === 1) text = 'TEA ★';
    if (i === 0 && variant === 0) text = 'TEA ♥';
    ctx.fillText(text, stall.x + 70, 206);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  });

  // Vendor behind the middle stall.
  ctx.fillStyle = '#ffccbc';
  ctx.beginPath();
  ctx.arc(280, 250, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5e35b1';
  ctx.beginPath();
  ctx.arc(280, 246, 16, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#5e35b1';
  ctx.fillRect(262, 264, 36, 30);

  // Fruit basket in front of the right stall.
  ctx.fillStyle = '#8d6e63';
  ctx.beginPath();
  ctx.ellipse(430, 330, 46, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e53935';
  [[402, 322], [422, 316], [442, 322], [458, 326]].forEach(([ax, ay]) => {
    ctx.beginPath();
    ctx.arc(ax, ay, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  // Fifth apple: left only.
  if (variant === 0) {
    ctx.beginPath();
    ctx.arc(at('apple').x, at('apple').y, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Balloons tied to the right stall: red on the left, blue on the right.
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(472, 150);
  ctx.lineTo(472, 176);
  ctx.stroke();
  ctx.fillStyle = variant === 0 ? '#e53935' : '#1e88e5';
  ctx.beginPath();
  ctx.ellipse(at('balloon').x, at('balloon').y, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(472, 142);
  ctx.lineTo(466, 150);
  ctx.lineTo(478, 150);
  ctx.closePath();
  ctx.fill();

  // Market cat sitting on a crate by the fruit stall: left only.
  if (variant === 0) {
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(at('cat').x - 24, at('cat').y + 8, 48, 32);
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.ellipse(at('cat').x, at('cat').y, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(at('cat').x + 12, at('cat').y - 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(at('cat').x + 5, at('cat').y - 19);
    ctx.lineTo(at('cat').x + 8, at('cat').y - 27);
    ctx.lineTo(at('cat').x + 11, at('cat').y - 19);
    ctx.moveTo(at('cat').x + 14, at('cat').y - 20);
    ctx.lineTo(at('cat').x + 18, at('cat').y - 27);
    ctx.lineTo(at('cat').x + 21, at('cat').y - 19);
    ctx.fill();
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(at('cat').x - 18, at('cat').y + 2);
    ctx.quadraticCurveTo(at('cat').x - 30, at('cat').y - 4, at('cat').x - 28, at('cat').y - 16);
    ctx.stroke();
  }
}

export const SCENES = { garden: drawGarden, harbour: drawHarbour, market: drawMarket };

export function drawScene(ctx, scene, variant) {
  const fn = SCENES[scene];
  if (!fn) throw new Error(`unknown scene: ${scene}`);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_W, PANEL_H);
  ctx.clip();
  fn(ctx, variant);
  ctx.restore();
}
