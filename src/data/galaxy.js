// ═══════════════════════════════════════════════════════════════════
//  NEURAL GALLERY — CV CONTENT
//  Edit nodes[] for content. Edit snapPositions[] / cameraForEachNode[]
//  to move nodes in 3D space. Edit sceneConfig for global visual settings.
// ═══════════════════════════════════════════════════════════════════

export const sceneConfig = {
  background: '#050505',
  camera: { fov: 60, near: 0.1, far: 600 },
  bloom: { luminanceThreshold: 0.1, luminanceSmoothing: 0.85, intensity: 2.5 },
  dof: { focusDistance: 0.01, focalLength: 0.02, bokehScale: 0, resolutionScale: 0.5 },
  lighting: { ambientIntensity: 0.15 },
};

// World-space positions of each node visual
export const snapPositions = [
  [  0,   0,   0 ],
  [ -4,  -6,  -2 ],
  [  3, -12,   1 ],
  [ -2, -18,  -2 ],
  [  1, -24,   0 ],
];

// Camera position + lookAt for each node
export const cameraForEachNode = [
  { position: [  0,  1.5,  7 ], lookAt: [  0,   0,   0 ] },
  { position: [ -4, -4.5,  5 ], lookAt: [ -4,  -6,  -2 ] },
  { position: [  3, -10.5, 8 ], lookAt: [  3, -12,   1 ] },
  { position: [ -2, -16.5, 5 ], lookAt: [ -2, -18,  -2 ] },
  { position: [  1, -22.5, 7 ], lookAt: [  1, -24,   0 ] },
];

export const nodes = [
  {
    id: 1,
    title: 'Node_01: Systems Before Theory',
    year: '2019 – 2022',
    color: '#00ffff',
    description: 'Systems Before Theory',
    bullets: [
      'BSc Computer Information Systems — curiosity finally had a language',
      'Built TOLA Scooters — geofencing tech, logistics infrastructure, real initiative',
      'Covid stopped everything. The pause became a meditation on what actually matters',
      'Emerged with better questions than answers. That was the point.',
    ],
  },
  {
    id: 2,
    title: 'Node_02: Translation as Intelligence',
    year: '2020 – 2024',
    color: '#00ff88',
    description: 'Translation as Intelligence',
    bullets: [
      'Silk Innovations — fell in love with tech, Core Wallet System changed the frame',
      'Founded and lost Onviro Tech — the hardest lesson, the most valuable one',
      'OpenAI dropped LLMs. The direction became undeniable',
      'JYRA Soft Technologies — shipped YarsaRooms and YBC ERP, engineered at scale',
    ],
  },
  {
    id: 3,
    title: 'Node_03: When Machines Try to See',
    year: '2024 – 2025',
    color: '#aa44ff',
    description: 'When Machines Try to See',
    bullets: [
      'Moved to London — MSc AI at University of Surrey, CVSSP',
      'Research: diffusion models, Vehicle Re-ID, fair AI systems, ELSA datasets',
      'Working on AGI, responsible AI, geometric intelligence for world models',
      'One conviction: AI should be accessible to all — not a luxury for the few',
    ],
  },
  {
    id: 4,
    title: 'Node_04: The Geometry of Understanding',
    year: '2025',
    color: '#ff4488',
    description: 'The Geometry of Understanding',
    bullets: [
      'I-JEPA vs CLIP on geometric reasoning — not a benchmark, a question',
      'Do language-anchored representations generalise to spatial intelligence?',
      'Supervised by Prof. Miroslav Bober, CVSSP, University of Surrey',
      'The answer has implications for embodied AI and genuine world models',
    ],
  },
  {
    id: 5,
    title: 'Node_05: What I\'m Reaching For',
    year: 'Now',
    color: '#ffaa00',
    description: 'What I\'m Reaching For',
    bullets: [
      'The next frontier: models that build genuine world models, not just scale',
      'Working at the boundary of geometric intelligence, embodied reasoning, responsible AI',
      'Brings real-world systems instinct to fundamental research questions',
      'Not here to replicate existing work — here to find what machines need to truly understand space',
    ],
  },
];
