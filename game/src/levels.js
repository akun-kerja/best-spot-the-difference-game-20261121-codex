// Lantern Garden — Spot the Difference: level data.
// One entry per scene. Each difference is a spot in panel coordinates
// (panels are 560 x 420), a hit radius, and the label shown once found.
// scenes.js draws the art so that the right picture differs from the left
// exactly at these spots, and nowhere else.

export const PANEL_W = 560;
export const PANEL_H = 420;

export const LEVELS = [
  {
    name: 'Dusk Garden',
    blurb: 'Fireflies, lanterns and one very smug cat.',
    timeLimit: 180,
    scene: 'garden',
    differences: [
      { id: 'moon', label: 'The moon changed shape', x: 92, y: 72, r: 30 },
      { id: 'butterfly', label: 'A butterfly vanished', x: 305, y: 118, r: 26 },
      { id: 'flower', label: 'A flower changed colour', x: 178, y: 378, r: 24 },
      { id: 'tail', label: "The cat's tail dropped", x: 392, y: 290, r: 28 },
      { id: 'lantern', label: 'A lantern went out', x: 252, y: 152, r: 24 },
      { id: 'frog', label: 'A frog hopped away', x: 452, y: 352, r: 26 },
      { id: 'cloud', label: 'A cloud drifted off', x: 425, y: 62, r: 30 },
    ],
  },
  {
    name: 'Harbour Morning',
    blurb: 'Gulls, boats and a lighthouse that cannot decide.',
    timeLimit: 180,
    scene: 'harbour',
    differences: [
      { id: 'lamp', label: 'The lighthouse lamp went dark', x: 72, y: 92, r: 28 },
      { id: 'gull', label: 'A gull flew away', x: 382, y: 68, r: 26 },
      { id: 'sail', label: 'A sail changed colour', x: 296, y: 224, r: 30 },
      { id: 'crate', label: 'A crate went missing', x: 481, y: 288, r: 26 },
      { id: 'fish', label: 'A fish slipped out of the net', x: 202, y: 332, r: 24 },
      { id: 'buoy', label: 'The buoy changed colour', x: 432, y: 302, r: 24 },
      { id: 'flag', label: 'The lighthouse flag is gone', x: 80, y: 52, r: 24 },
    ],
  },
  {
    name: 'Night Market',
    blurb: 'Lanterns, stalls and a cat guarding the fruit.',
    timeLimit: 180,
    scene: 'market',
    differences: [
      { id: 'moon', label: 'The moon changed shape', x: 92, y: 62, r: 30 },
      { id: 'balloon', label: 'A balloon changed colour', x: 472, y: 122, r: 26 },
      { id: 'bulb', label: 'A string-light bulb went out', x: 280, y: 80, r: 22 },
      { id: 'awning', label: 'An awning lost a stripe', x: 296, y: 163, r: 28 },
      { id: 'cat', label: 'The market cat wandered off', x: 340, y: 372, r: 26 },
      { id: 'sign', label: 'The stall sign changed', x: 110, y: 205, r: 26 },
      { id: 'apple', label: 'An apple rolled away', x: 432, y: 306, r: 24 },
    ],
  },
];

export function totalDifferences() {
  return LEVELS.reduce((sum, level) => sum + level.differences.length, 0);
}
