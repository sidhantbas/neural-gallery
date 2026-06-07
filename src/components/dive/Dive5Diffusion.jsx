// Phase 5 Dive: Diffusion / Denoising
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const N = 1200;

function buildTargets() {
  const targets = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 6;
    const r = 0.3 + (i / N) * 2.2;
    targets[i*3]   = Math.cos(t) * r;
    targets[i*3+1] = Math.sin(t) * r;
    targets[i*3+2] = (i / N - 0.5) * 3;
  }
  return targets;
}

function buildNoise() {
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 7;
    pos[i*3+1] = (Math.random() - 0.5) * 7;
    pos[i*3+2] = (Math.random() - 0.5) * 7;
  }
  return pos;
}

const TARGETS  = buildTargets();
const NOISE_POS = buildNoise();
const MAX_BEATS = 5;

// Labels per beat — left column (bullets), right column (title + subtitle)
const STEPS = [
  {
    title:    'The Unstructured Noise',
    subtitle: 'Loud, expensive, relying purely on massive scale rather than true understanding.',
    bullets:  ['Brute-Force Computation', 'Massive Parameter Bloat', 'Blind Pattern-Matching', 'Ungrounded Semantics', 'Superficial Statistical Mimicry', 'The Hype Cycle', 'Data Voids and Hallucinations'],
  },
  {
    title:    'The Real-World Friction',
    subtitle: 'Where noise hits reality — failures when models lack actual grasp of consequences.',
    bullets:  ['Black-Box Unpredictability', 'Production Bottlenecks', 'The Limits of Scaling Laws', 'High-Risk Deployment', 'Latency and Inefficiency', 'Lack of Trust and Accountability'],
  },
  {
    title:    'The Algorithmic Realignment',
    subtitle: 'Shifting away from feeding models more text — toward how the physical world works.',
    bullets:  ['Latent Space Organization', 'Spatial Awareness', 'Causal Grounding', 'Embodied Reasoning', 'Predictive Physics', 'Beyond-Language Representations'],
  },
  {
    title:    'The Clear Final Signal',
    subtitle: 'Grounded, efficient, reliable. Chaotic points snapped into a deliberate trajectory.',
    bullets:  ['Structural Intelligence', 'AI Safety', 'Less Computational Power', 'Genuine World Models', 'Accessible and Responsible AI'],
  },
];

export function Dive5Diffusion({ position, color, beatIndex, storyline }) {
  const ptRef   = useRef();
  const noise3D = useMemo(() => createNoise3D(), []);

  const tTarget   = Math.min(beatIndex, MAX_BEATS - 1) / (MAX_BEATS - 1);
  const positions = useMemo(() => new Float32Array(NOISE_POS), []);
  const tRef      = useRef(0);

  const beat = storyline?.[beatIndex];
  const step = STEPS[Math.min(beatIndex, STEPS.length - 1)];

  const noiseCol  = new THREE.Color('#ff44aa');
  const structCol = new THREE.Color(color);
  const blendCol  = noiseCol.clone().lerp(structCol, beatIndex / Math.max(MAX_BEATS - 1, 1));

  useFrame(({ clock }) => {
    if (!ptRef.current) return;
    tRef.current += (tTarget - tRef.current) * 0.025;
    const t  = clock.getElapsedTime();
    const t2 = tRef.current;
    const arr = ptRef.current.geometry.attributes.position.array;

    for (let i = 0; i < N; i++) {
      const nx = NOISE_POS[i*3],   ny = NOISE_POS[i*3+1], nz = NOISE_POS[i*3+2];
      const sx = TARGETS[i*3],     sy = TARGETS[i*3+1],   sz = TARGETS[i*3+2];
      const residual = (1 - t2) * 0.3;
      const motion   = noise3D(nx * 0.4 + t * 0.1, ny * 0.4, nz * 0.4) * residual;
      arr[i*3]   = nx + (sx - nx) * t2 + motion;
      arr[i*3+1] = ny + (sy - ny) * t2 + motion;
      arr[i*3+2] = nz + (sz - nz) * t2 + motion * 0.5;
    }
    ptRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={ptRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]}
            usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial color={`#${blendCol.getHexString()}`}
          size={0.028} sizeAttenuation transparent opacity={0.75} />
      </points>

      {/* ── Beat panel — top left ── */}
      {beat && (
        <group position={[-4.2, 2.2, 0]}>
          <Text position={[0, 0.28, 0]} fontSize={0.075} color={color}
            anchorX="left" letterSpacing={0.15} fillOpacity={0.7}>
            {beat.date}
          </Text>
          <Text position={[0, 0.06, 0]} fontSize={0.13} color="#ffffff"
            anchorX="left" maxWidth={2.4} letterSpacing={0.02} fillOpacity={0.95}>
            {beat.headline}
          </Text>
          <Text position={[0, -0.28, 0]} fontSize={0.07} color="#888899"
            anchorX="left" maxWidth={2.4} letterSpacing={0.01} fillOpacity={0.75}>
            {beat.detail}
          </Text>
        </group>
      )}

      {/* ── Step title + subtitle — top right ── */}
      {step && (
        <group position={[1.8, 2.2, 0]}>
          <Text position={[0, 0.28, 0]} fontSize={0.09} color={color}
            anchorX="left" letterSpacing={0.1} fillOpacity={0.95} maxWidth={2.8}>
            {`STEP 0${Math.min(beatIndex + 1, 4)}: ${step.title.toUpperCase()}`}
          </Text>
          <Text position={[0, 0.0, 0]} fontSize={0.07} color="#aaaacc"
            anchorX="left" maxWidth={2.8} letterSpacing={0.01} fillOpacity={0.75}>
            {step.subtitle}
          </Text>
        </group>
      )}

      {/* ── Bullet labels — positioned in left black space ── */}
      {step?.bullets.map((label, i) => (
        <Text key={i}
          position={[-4.2, 1.2 - i * 0.38, 0]}
          fontSize={0.075} color="#ccccdd"
          anchorX="left" letterSpacing={0.04} fillOpacity={0.6}>
          {`— ${label}`}
        </Text>
      ))}

      {/* ── Noise / Signal indicators — bottom ── */}
      <Text position={[-1.2, -3.2, 0]} fontSize={0.09} color="#ff44aa"
        anchorX="left" letterSpacing={0.08} fillOpacity={0.6}>
        {`NOISE  ${((1 - tTarget) * 100).toFixed(0)}%`}
      </Text>
      <Text position={[0.8, -3.2, 0]} fontSize={0.09} color={color}
        anchorX="left" letterSpacing={0.08} fillOpacity={0.6}>
        {`SIGNAL  ${(tTarget * 100).toFixed(0)}%`}
      </Text>
      <Text position={[0, -3.6, 0]} fontSize={0.08} color="#555566"
        anchorX="center" letterSpacing={0.12} fillOpacity={0.5}>
        {`t = ${(1 - tTarget).toFixed(2)}  →  REVERSE DIFFUSION`}
      </Text>
    </group>
  );
}
