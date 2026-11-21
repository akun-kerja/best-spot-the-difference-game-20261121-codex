[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/akun-kerja/best-spot-the-difference-game-20261121-codex/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/akun-kerja/best-spot-the-difference-game-20261121-codex/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

# Lantern Garden — Spot the Difference

A complete, original spot-the-difference game that runs offline in a desktop
browser from static files. Two near-identical hand-drawn pictures sit side
by side; find all 7 differences in each of three scenes before the timer
runs out.

Entry for the make.fun bounty
[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

## How to play

- **Click or tap** a difference in either picture to circle it in red.
- **Arrow keys** move the crosshair, **Enter** marks a spot.
- **H** spends a hint (3 per scene, costs 15 points) and pulses a ring
  around one difference you have not found yet.
- **R** restarts the scene. **M** toggles sound. **1 / 2 / 3** jump
  between scenes.
- Find all 7 differences before the 3-minute timer runs out. A wrong
  click costs 10 points; each find is worth 100, plus a time bonus when
  you clear a scene.

## The three scenes

1. **Dusk Garden** — fireflies, lanterns and one very smug cat on a fence.
   The moon, a butterfly, a flower, the cat's tail, a lantern, a frog and
   a cloud all hide a change.
2. **Harbour Morning** — gulls, a sailboat and a lighthouse that cannot
   decide whether its lamp is on. Watch the sail, the crates, the net,
   the buoy and the flag.
3. **Night Market** — lanterns, stalls and a cat guarding the fruit.
   The moon, a balloon, a string-light bulb, an awning stripe, the stall
   sign and an apple are all suspects.

Clear one scene to unlock the next; clear all three to win. Your score
carries across scenes.

## Play it

Serve `game/` with any static server and open `index.html`:

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests, no libraries: the pictures are drawn
with canvas code, the sounds are synthesised with the Web Audio API, and
every file the page loads lives under `game/`.

## Screenshots

Four real renders of the game running in a desktop browser:

1. `1-cover.jpg` — Dusk Garden mid-hunt: 3 of 7 found, 4 remain.
2. `2-harbour.jpg` — Harbour Morning: 2 of 7 found, 5 remain.
3. `3-market.jpg` — Night Market: 4 of 7 found, 3 remain.
4. `4-win.jpg` — Dusk Garden cleared: all 7 found, level-complete screen.

## Layout

- `game/index.html` — page shell, HUD, canvas
- `game/styles.css` — warm dusk styling
- `game/src/main.js` — wiring: DOM, clock, animation loop, HUD sync
- `game/src/levels.js` — the three scenes and their 7 differences each
- `game/src/scenes.js` — all the art, drawn with canvas code
- `game/src/state.js` — game state: phases, timer, score, hints
- `game/src/render.js` — panels, found rings, hint pulse, overlays
- `game/src/input.js` — mouse, touch and keyboard input
- `game/src/audio.js` — synthesised sound effects (Web Audio)
- `main.ts` — the entry program: copies `game/` and `screenshots/` to
  `/output` and writes `dossier.json` with the vendored make.fun library
- `screenshots/` — real renders of the game running in a browser

## License

MIT — see [LICENSE](LICENSE).
