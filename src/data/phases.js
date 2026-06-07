// ═══════════════════════════════════════════════════════════════════
//  NEURAL GALLERY — LIVE CMS DATA
//  Edit via the CMS panel (⬡ CMS top-left) or directly here.
//
//  Phase fields:
//    id, label, period, title, color, nodeType
//    lines[]     → orbit view bullets
//    storyline[] → dive view beats
//
//  Storyline beat fields:
//    date      → e.g. '2021.03'
//    headline  → large moment title
//    detail    → supporting narrative
//    nodeIndex → which AI-viz element this beat highlights (0-based)
// ═══════════════════════════════════════════════════════════════════

const X_OFFSETS = [0, -3, 3, -2, 1, -3.5, 2.5];
const Y_STEP    = -4;
const Z_BASE    = 8;

export function deriveLayout(phases) {
  const nodePositions = phases.map((_, i) => [
    X_OFFSETS[i % X_OFFSETS.length],
    i * Y_STEP,
    0,
  ]);
  const cameraConfigs = phases.map((_, i) => {
    const [x, y] = nodePositions[i];
    return {
      position: [x, y + 0.5, Z_BASE + (i % 2 === 0 ? 0 : 1)],
      lookAt:   [x, y, 0],
    };
  });
  return { nodePositions, cameraConfigs };
}

export function createDefaultPhase(existing) {
  return {
    id:        Date.now(),
    label:     `PHASE_0${existing.length + 1}`,
    period:    'YEAR – YEAR',
    title:     'NEW PHASE TITLE',
    color:     '#00ffff',
    nodeType:  'crystal',
    lines:     ['Add your first bullet point here'],
    storyline: [
      { date: '2020.01', headline: 'First Milestone', detail: 'Describe what happened here.', nodeIndex: 0 },
    ],
  };
}

export const PHASES = [
  {
    id: 1,
    label: 'PHASE_01',
    period: '2019 – 2022',
    title: 'SYSTEMS BEFORE THEORY',
    color: '#00ffff',
    nodeType: 'crystal',
    lines: [
      'BSc Computer Information Systems — curiosity finally had a language',
      'Built TOLA Scooters — geofencing tech, logistics infrastructure, real initiative',
      'Covid stopped everything. The pause became a meditation on what actually matters',
      'Emerged with better questions than answers. That was the point.',
    ],
    storyline: [
      { date: '2019.09', headline: 'Input Layer', detail: 'BSc Computer Information Systems — curiosity finally had a language. Algorithms, data structures, systems design. No priors, no loss signal yet.', nodeIndex: 0 },
      { date: '2020.03', headline: 'First Deployment', detail: 'Built TOLA Scooters — geofencing tech, logistics infrastructure, real initiative. The weights had values but hadn\'t been tested against reality.', nodeIndex: 1 },
      { date: '2020.06', headline: 'Sudden Disruption', detail: 'Covid stopped everything. The pause became a meditation on what actually matters. The system was forced to reset.', nodeIndex: 2 },
      { date: '2021.01', headline: 'Hidden Layer Activated', detail: 'Emerged from the pause with sharper instincts. The disruption had done what no curriculum could — forced a genuine recalibration.', nodeIndex: 3 },
      { date: '2022.08', headline: 'Output Computed', detail: 'Emerged with better questions than answers. That was the point. The degree finished. The real education had already begun.', nodeIndex: 4 },
    ],
  },
  {
    id: 2,
    label: 'PHASE_02',
    period: '2020 – 2024',
    title: 'TRANSLATION AS INTELLIGENCE',
    color: '#00ff88',
    nodeType: 'particles',
    lines: [
      'Silk Innovations — fell in love with tech, Core Wallet System changed the frame',
      'Founded and lost Onviro Tech — the hardest lesson, the most valuable one',
      'OpenAI dropped LLMs. The direction became undeniable',
      'JYRA Soft Technologies — shipped YarsaRooms and YBC ERP, engineered at scale',
    ],
    storyline: [
      { date: '2020.06', headline: 'Loss Signal Detected', detail: 'Silk Innovations — fell in love with tech. The Core Wallet System changed the frame. Real infrastructure, real consequences, real users.', nodeIndex: 0 },
      { date: '2021.04', headline: 'Gradient Computed', detail: 'Founded Onviro Tech. Built it. Lost it. The hardest lesson, and the most valuable one. Failure as a training signal.', nodeIndex: 1 },
      { date: '2022.11', headline: 'Weights Updated', detail: 'OpenAI dropped LLMs into the world. The direction became undeniable. The question shifted from "what to build" to "what is actually happening here."', nodeIndex: 2 },
      { date: '2023.03', headline: 'Deep Network Active', detail: 'JYRA Soft Technologies — shipped YarsaRooms and YBC ERP. Engineered at scale. The architecture was getting serious.', nodeIndex: 3 },
      { date: '2024.06', headline: 'Projection Complete', detail: 'Moved to Surrey. Everything before this was preparation. The question became: what do machines actually need to understand the world?', nodeIndex: 4 },
    ],
  },
  {
    id: 3,
    label: 'PHASE_03',
    period: '2024 – 2025',
    title: 'WHEN MACHINES TRY TO SEE',
    color: '#aa44ff',
    nodeType: 'grid',
    lines: [
      'Moved to London — MSc AI at University of Surrey, CVSSP',
      'Research: diffusion models, Vehicle Re-ID, fair AI systems, ELSA datasets',
      'Working on AGI, responsible AI, geometric intelligence for world models',
      'One conviction: AI should be accessible to all — not a luxury for the few',
    ],
    storyline: [
      { date: '2024.09', headline: 'Query Formed', detail: 'Moved to London. MSc AI at University of Surrey, CVSSP. The question crystallised: what does it mean to see something versus merely detect it?', nodeIndex: 0 },
      { date: '2024.11', headline: 'Keys Indexed', detail: 'Vehicle Re-ID on VeRi dataset. Diffusion models. Fair AI systems. ELSA datasets. The research substance started to accumulate.', nodeIndex: 1 },
      { date: '2025.01', headline: 'Attention Head Fires', detail: 'Working on AGI, responsible AI, geometric intelligence for world models. The systems instinct found a new domain.', nodeIndex: 2 },
      { date: '2025.03', headline: 'Value Retrieved', detail: 'DDPM/DDIM on CelebA-HQ, FID 59.89. Generative models are world models in disguise — they have learned a prior over appearance.', nodeIndex: 3 },
      { date: '2025.05', headline: 'Residual Connection', detail: 'One conviction solidified: AI should be accessible to all — not a luxury for the few. That is not idealism. It is a design constraint.', nodeIndex: 4 },
    ],
  },
  {
    id: 4,
    label: 'PHASE_04',
    period: '2025',
    title: 'THE GEOMETRY OF UNDERSTANDING',
    color: '#ff4488',
    nodeType: 'globe',
    lines: [
      'Dissertation: I-JEPA vs CLIP on geometric reasoning — not a benchmark, a question',
      'Do language-anchored representations generalise to spatial intelligence?',
      'Supervised by Prof. Miroslav Bober, CVSSP, University of Surrey',
      'The answer has implications for embodied AI and genuine world models',
    ],
    storyline: [
      { date: '2025.06', headline: 'Hypothesis Stated', detail: 'Dissertation begins: I-JEPA vs CLIP on geometric reasoning. Not benchmarking two models — asking what kind of representation enables spatial thought.', nodeIndex: 0 },
      { date: '2025.07', headline: 'Loss Surface Mapped', detail: 'I-JEPA: self-supervised, predicts in latent space, no language anchor. CLIP: contrastive, language-grounded, optimised for alignment not structure.', nodeIndex: 1 },
      { date: '2025.08', headline: 'Saddle Point Found', detail: 'Do language-anchored representations generalise to spatial intelligence? Early results suggest the answer is more complicated than the benchmarks imply.', nodeIndex: 2 },
      { date: '2025.09', headline: 'Basin Located', detail: 'Supervised by Prof. Miroslav Bober, CVSSP. The answer has implications for embodied AI and genuine world models — not just this dissertation.', nodeIndex: 3 },
      { date: '2025.10', headline: 'Gradient Descent Continues', detail: 'The dissertation isn\'t finished. Neither is the question. The most interesting research never announces its own conclusion.', nodeIndex: 4 },
    ],
  },
  {
    id: 5,
    label: 'PHASE_05',
    period: 'NOW',
    title: 'WHAT I\'M REACHING FOR',
    color: '#ffaa00',
    nodeType: 'latentcloud',
    lines: [
      'The next frontier: models that build genuine world models, not just scale',
      'Working at the boundary of geometric intelligence, embodied reasoning, responsible AI',
      'Brings real-world systems instinct to fundamental research questions',
      'Not here to replicate existing work — here to find what machines need to truly understand space',
    ],
    storyline: [
      { date: '2025.now', headline: 'Noise Sampled', detail: 'The field is loud — foundation models, scaling laws, emergent capabilities. I have learned to be comfortable in that noise.', nodeIndex: 0 },
      { date: '——', headline: 'First Denoising Step', detail: 'The next frontier: models that build genuine world models, not just scale. That is the bet. That is where the work points.', nodeIndex: 1 },
      { date: '——', headline: 'Score Function Learned', detail: 'Working at the boundary of geometric intelligence, embodied reasoning, and responsible AI. Not any one of these — the joints between them.', nodeIndex: 2 },
      { date: '——', headline: 'Structure Emerges', detail: 'Brings real-world systems instinct to fundamental research questions. I know what understanding looks like when it fails in the world — not just on a benchmark.', nodeIndex: 3 },
      { date: '——', headline: 'Sample Rendered', detail: 'Not here to replicate existing work. Here to find what machines need to truly understand space. That question is worth the next decade.', nodeIndex: 4 },
    ],
  },
];
