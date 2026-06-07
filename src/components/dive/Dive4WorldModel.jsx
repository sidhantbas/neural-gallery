// Phase 4 Dive: World Model / Latent Space — I-JEPA vs CLIP
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// CLIP clusters — language-anchored, labelled
const CLIP_CLUSTERS = [
  { label: 'CLIP: Semantic',     color: '#ff4488', cx:  0.3, cy:  1.0, count: 50 },
  { label: 'CLIP: Contrastive',  color: '#ff6688', cx:  2.6, cy:  0.8, count: 45 },
];

// I-JEPA clusters — structural, unlabelled geometry
const IJEPA_CLUSTERS = [
  { color: '#cc44ff', cx:  0.9, cy: -0.8, count: 50 },
  { color: '#aa44ff', cx:  2.3, cy: -0.6, count: 45 },
];

// Geometric probe nodes — the dissertation tasks
const PROBES = [
  { cx:  1.2, cy:  0.2 },
  { cx:  2.0, cy:  0.5 },
  { cx:  1.5, cy: -0.3 },
];

function buildCloud() {
  const allPos = [], allColors = [];
  [...CLIP_CLUSTERS, ...IJEPA_CLUSTERS].forEach(({ cx, cy, count, color }) => {
    const c = new THREE.Color(color);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.85;
      allPos.push(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, (Math.random() - 0.5) * 1.0);
      allColors.push(c.r, c.g, c.b);
    }
  });
  return { positions: new Float32Array(allPos), colors: new Float32Array(allColors) };
}

const CLOUD = buildCloud();

// Probe geometry — glowing nodes
const PROBE_GEO = new THREE.SphereGeometry(0.06, 10, 8);

// Embodied intelligence trajectory arc
function buildTrajectory(beatIndex) {
  const pts = [];
  const steps = Math.min(beatIndex + 1, 5) * 10;
  for (let i = 0; i <= steps; i++) {
    const f = i / 50;
    pts.push(
      -2.8 + f * 5.6,
      Math.sin(f * Math.PI) * 1.2 - 1.0,
      Math.sin(f * Math.PI * 2) * 0.4
    );
  }
  return new Float32Array(pts);
}

const DETAIL = {
  latent:     'The multi-dimensional space where models organize reality. The question: do they arrange by meaning (language) or by structure (geometry)?',
  clip:       'CLIP organizes representations contrastively using language. It groups by human semantics — what things are called, not how they are built.',
  ijepa:      'I-JEPA ignores text entirely. It predicts underlying structure, grouping points by physical and spatial truth.',
  probes:     'Geometric Reasoning Tasks — probes injected into the space to reveal which foundation actually understands physical relationships.',
  trajectory: 'The path toward AI that doesn\'t just categorize data — but can act and navigate in physical space.',
};

export function Dive4WorldModel({ position, color, beatIndex, storyline }) {
  const groupRef  = useRef();
  const probeRefs = useRef([]);
  const arcPos    = useMemo(() => buildTrajectory(beatIndex), [beatIndex]);
  const beat      = storyline?.[beatIndex];

  // Which detail to show per beat
  const detailKeys = ['latent', 'clip', 'ijepa', 'probes', 'trajectory'];
  const activeDetail = DETAIL[detailKeys[Math.min(beatIndex, detailKeys.length - 1)]];
  const activeLabel  = ['THE LATENT SPACE', 'CLIP', 'I-JEPA', 'GEOMETRIC PROBES', 'EMBODIED INTELLIGENCE'][Math.min(beatIndex, 4)];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.08;
    }
    probeRefs.current.forEach((mat, i) => {
      if (!mat) return;
      mat.emissiveIntensity = 2.5 + Math.sin(t * 2.2 + i * 1.3) * 1.0;
    });
  });

  return (
    <group position={position}>

      {/* ── Rotating point cloud only ── */}
      <group ref={groupRef}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[CLOUD.positions, 3]} />
            <bufferAttribute attach="attributes-color"    args={[CLOUD.colors, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.05} sizeAttenuation vertexColors transparent opacity={0.7} />
        </points>
      </group>

      {/* ── Static overlays — never rotate ── */}

      {/* CLIP cluster labels */}
      {CLIP_CLUSTERS.map((cl, i) => (
        <Text key={i} position={[cl.cx, cl.cy + 0.95, 0]}
          fontSize={0.09} color={cl.color} anchorX="center"
          letterSpacing={0.08} fillOpacity={beatIndex >= 1 ? 0.9 : 0.2}>
          {cl.label}
        </Text>
      ))}

      {/* I-JEPA structural label */}
      <Text position={[1.6, -1.3, 0]} fontSize={0.09} color="#cc44ff"
        anchorX="center" letterSpacing={0.06} fillOpacity={beatIndex >= 2 ? 0.9 : 0.15}>
        I-JEPA: Structural
      </Text>

      {/* Geometric probe nodes */}
      {PROBES.map((p, i) => (
        <mesh key={i} geometry={PROBE_GEO} position={[p.cx, p.cy, 0.2]}>
          <meshStandardMaterial ref={el => probeRefs.current[i] = el}
            color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5}
            roughness={0} metalness={1}
            transparent opacity={beatIndex >= 3 ? 0.9 : 0.1} />
        </mesh>
      ))}

      {/* Embodied intelligence trajectory */}
      {arcPos.length > 3 && (
        <line>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[arcPos, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={beatIndex >= 4 ? 0.6 : 0.15} />
        </line>
      )}

      {/* ── Beat panel — left ── */}
      {beat && (
        <group position={[-4.5, 0.4, 0]}>
          <Text position={[0, 0.32, 0]} fontSize={0.075} color={color}
            anchorX="left" letterSpacing={0.15} fillOpacity={0.7}>
            {beat.date}
          </Text>
          <Text position={[0, 0.08, 0]} fontSize={0.12} color="#ffffff"
            anchorX="left" maxWidth={2.2} letterSpacing={0.02} fillOpacity={0.95}>
            {beat.headline}
          </Text>
          <Text position={[0, -0.26, 0]} fontSize={0.07} color="#888899"
            anchorX="left" maxWidth={2.2} letterSpacing={0.01} fillOpacity={0.75}>
            {beat.detail}
          </Text>
        </group>
      )}

      {/* ── Concept detail panel — right ── */}
      <group position={[3.8, 0.4, 0]}>
        <Text position={[0, 0.32, 0]} fontSize={0.075} color={color}
          anchorX="right" letterSpacing={0.1} fillOpacity={0.9}>
          {activeLabel}
        </Text>
        <Text position={[0, 0.08, 0]} fontSize={0.07} color="#ccccdd"
          anchorX="right" maxWidth={2.2} letterSpacing={0.01} fillOpacity={0.75}>
          {activeDetail}
        </Text>
      </group>

    </group>
  );
}
