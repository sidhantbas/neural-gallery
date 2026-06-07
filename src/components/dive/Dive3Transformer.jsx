// Phase 3 Dive: Transformer Self-Attention
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const TOKENS  = ['CLIENT','QUERY','KEY','VALUE','OUTPUT','NORM','FFN','RESIDUAL'];
const TOKEN_R = 1.4;
const COLOR   = '#aa44ff';
const N       = TOKENS.length;

const TOKEN_DETAIL = {
  'QUERY':    'How do machines actually perceive the world?',
  'KEY':      'CVSSP, University of Surrey — the rigorous framework holding the answers.',
  'VALUE':    'Diffusion models, Vehicle Re-ID, ELSA dataset — concrete research substance.',
  'FFN':      'Deep processing: evolving AI from statistical mimicry to genuine intelligence.',
  'NORM':     'Fair, accountable AI — ensuring power does not override ethics.',
  'RESIDUAL': 'Unwavering conviction: AGI is rapidly approaching.',
  'OUTPUT':   'Trustworthy, responsible AGI built on geometric intelligence.',
  'CLIENT':   'Humanity — ensuring AI remains accessible to all, never a luxury for the few.',
};

function tokenPos(i) {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return [Math.cos(a) * TOKEN_R, Math.sin(a) * TOKEN_R, 0];
}

const PAIR_POS = (() => {
  const arr = [];
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++)
      arr.push({ i, j, pts: new Float32Array([...tokenPos(i), ...tokenPos(j)]) });
  return arr;
})();

function pairsAtBeat(beat) {
  const s = new Set();
  PAIR_POS.forEach(({ i, j }, idx) => {
    if (Math.abs(i - j) <= beat + 1) s.add(idx);
  });
  return s;
}

const SPHERE_GEO = new THREE.SphereGeometry(0.12, 12, 8);
const INACTIVE_C = new THREE.Color('#1a0a2a');
const ACTIVE_C   = new THREE.Color(COLOR);

export function Dive3Transformer({ position, color, beatIndex, storyline }) {
  const ringRef    = useRef();
  const matRefs    = useRef([]);
  const lineRefs   = useRef([]);
  const activePairs = useMemo(() => pairsAtBeat(beatIndex), [beatIndex]);
  const beat        = storyline?.[beatIndex];

  // Active token for detail panel
  const activeToken = TOKENS.find((_, i) =>
    [...activePairs].some(idx => PAIR_POS[idx].i === i || PAIR_POS[idx].j === i)
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    matRefs.current.forEach((mat, i) => {
      if (!mat) return;
      const on = [...activePairs].some(idx => PAIR_POS[idx].i === i || PAIR_POS[idx].j === i);
      mat.emissiveIntensity += ((on ? 4 + Math.sin(t * 1.8 + i) * 1.5 : 0.3) - mat.emissiveIntensity) * 0.07;
      mat.color.lerp(on ? ACTIVE_C : INACTIVE_C, 0.07);
      mat.emissive.lerp(on ? ACTIVE_C : INACTIVE_C, 0.07);
    });

    lineRefs.current.forEach((mat, idx) => {
      if (!mat) return;
      const on = activePairs.has(idx);
      mat.opacity += ((on ? 0.28 : 0.03) - mat.opacity) * 0.1;
      mat.color.set(on ? COLOR : '#1a0a2a');
    });
  });

  return (
    <group position={position}>

      {/* ── Ring (static, no rotation) ── */}
      <group ref={ringRef}>
        {PAIR_POS.map(({ pts }, idx) => (
          <lineSegments key={idx}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[pts, 3]} />
            </bufferGeometry>
            <lineBasicMaterial ref={el => lineRefs.current[idx] = el}
              color="#1a0a2a" transparent opacity={0.03} />
          </lineSegments>
        ))}

        {TOKENS.map((token, i) => {
          const [tx, ty] = tokenPos(i);
          const below = ty < -0.1;
          return (
            <group key={i} position={[tx, ty, 0]}>
              <mesh geometry={SPHERE_GEO}>
                <meshStandardMaterial ref={el => matRefs.current[i] = el}
                  color="#1a0a2a" emissive="#1a0a2a" emissiveIntensity={0.3}
                  roughness={0.1} metalness={0.9} />
              </mesh>
              <Text
                position={[0, below ? -0.2 : 0.2, 0]}
                fontSize={0.07}
                color={COLOR}
                anchorX="center"
                anchorY={below ? 'top' : 'bottom'}
                letterSpacing={0.06}
                fillOpacity={0.8}
              >
                {token}
              </Text>
            </group>
          );
        })}
      </group>

      {/* ── Centre labels ── */}
      {[['Q', -0.38, 0.22], ['K', 0, 0.22], ['V', 0.38, 0.22]].map(([l, x, y]) => (
        <Text key={l} position={[x, y, 0]} fontSize={0.16} color={COLOR}
          anchorX="center" letterSpacing={0.1} fillOpacity={0.65}>{l}</Text>
      ))}
      <Text position={[0, -0.05, 0]} fontSize={0.065} color={color}
        anchorX="center" letterSpacing={0.1} fillOpacity={0.4}>
        SELF-ATTENTION
      </Text>

      {/* ── Beat panel — bottom left ── */}
      {beat && (
        <group position={[1.8, -2.2, 0]}>
          <Text position={[0, 0.32, 0]} fontSize={0.08} color={color}
            anchorX="left" letterSpacing={0.18} fillOpacity={0.7}>
            {beat.date}
          </Text>
          <Text position={[0, 0.08, 0]} fontSize={0.13} color="#ffffff"
            anchorX="left" maxWidth={3.0} letterSpacing={0.03} fillOpacity={0.95}>
            {beat.headline}
          </Text>
          <Text position={[0, -0.22, 0]} fontSize={0.075} color="#888899"
            anchorX="left" maxWidth={3.0} letterSpacing={0.02} fillOpacity={0.7}>
            {beat.detail}
          </Text>
        </group>
      )}

      {/* ── Token detail panel — bottom right ── */}
      {activeToken && (
        <group position={[-3.6, -2.2, 0]}>
          <Text position={[0, 0.32, 0]} fontSize={0.08} color={COLOR}
            anchorX="left" letterSpacing={0.12} fillOpacity={0.9}>
            {activeToken}
          </Text>
          <Text position={[0, 0.08, 0]} fontSize={0.075} color="#ccccdd"
            anchorX="left" maxWidth={2.8} letterSpacing={0.02} fillOpacity={0.75}>
            {TOKEN_DETAIL[activeToken]}
          </Text>
        </group>
      )}

    </group>
  );
}
