// Phase 2 Dive: Backpropagation — gradient flows BACKWARDS
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const LAYERS     = [2, 4, 5, 4, 3];
const LAYER_GAP  = 1.6;
const NEURON_GAP = 0.85;

// IDs: L0→0,1 | L1→2,3,4,5 | L2→6,7,8,9,10 | L3→11,12,13,14 | L4→15,16,17
const NEURON_LABEL_MAP = {
  // Step 01 — Loss Calculation (Layer 3, 4 nodes)
  11: 'Conviction',
  12: 'Failure',
  13: 'Consequence',
  14: 'Revelation',
  // Step 02 — Backward Pass (Layer 2, middle 3 of 5)
  7:  'Frame-Shift',
  8:  'Edge-Discovery',
  9:  'Undeniable-Direction',
  // Step 03 — Weight Update (Layer 1, 4 nodes)
  2:  'Execution',
  3:  'Uptime',
  4:  'Scale',
  5:  'Intelligence',
};
const GRAD_COLOR = '#00ff88';
const LOSS_COLOR = '#ff4488';

function buildNetwork() {
  const neurons = [];
  const edges   = [];
  LAYERS.forEach((count, li) => {
    const x = (li - (LAYERS.length - 1) / 2) * LAYER_GAP;
    for (let ni = 0; ni < count; ni++) {
      const y = (ni - (count - 1) / 2) * NEURON_GAP;
      neurons.push({ layer: li, x, y, id: neurons.length });
    }
  });
  neurons.forEach(n => {
    if (n.layer === LAYERS.length - 1) return;
    neurons.filter(m => m.layer === n.layer + 1).forEach(m =>
      edges.push({ from: n.id, to: m.id }));
  });
  return { neurons, edges };
}
const NET = buildNetwork();

// Backprop: right→left
function activeAtBeat(beat) {
  const s = new Set();
  const max = LAYERS.length - 1;
  for (let l = max; l >= max - beat && l >= 0; l--)
    NET.neurons.filter(n => n.layer === l).forEach(n => s.add(n.id));
  return s;
}

const EDGE_POS = (() => {
  const arr = new Float32Array(NET.edges.length * 6);
  NET.edges.forEach((e, i) => {
    const f = NET.neurons[e.from], t = NET.neurons[e.to];
    arr[i*6]=f.x; arr[i*6+1]=f.y; arr[i*6+2]=0;
    arr[i*6+3]=t.x; arr[i*6+4]=t.y; arr[i*6+5]=0;
  });
  return arr;
})();

const EDGE_COLORS = new Float32Array(NET.edges.length * 6);
const SPHERE_GEO  = new THREE.SphereGeometry(0.11, 16, 12);
const INACTIVE_C  = new THREE.Color('#0a1a10');

export function Dive2Backprop({ position, color, beatIndex, storyline }) {
  const matRefs    = useRef([]);
  const labelRefs  = useRef([]);
  const edgeGeoRef = useRef();
  const active     = useMemo(() => activeAtBeat(beatIndex), [beatIndex]);
  const gradC      = useMemo(() => new THREE.Color(GRAD_COLOR), []);
  const lossC      = useMemo(() => new THREE.Color(LOSS_COLOR), []);
  const beat       = storyline?.[beatIndex];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    NET.neurons.forEach((n, i) => {
      const mat = matRefs.current[i];
      if (!mat) return;
      const on  = active.has(n.id);
      const col = on ? (n.layer === LAYERS.length-1 ? lossC : gradC) : INACTIVE_C;
      mat.color.lerp(col, 0.07);
      mat.emissive.lerp(col, 0.07);
      mat.emissiveIntensity += ((on ? 3.5 + Math.sin(t*2.5+i)*1.2 : 0.1) - mat.emissiveIntensity) * 0.07;

      const ltxt = labelRefs.current[i];
      if (ltxt) ltxt.fillOpacity += ((on ? 0.8 : 0.12) - ltxt.fillOpacity) * 0.08;
    });

    if (edgeGeoRef.current) {
      NET.edges.forEach((e, i) => {
        const lit = active.has(e.from) && active.has(e.to);
        const c   = lit ? gradC : INACTIVE_C;
        for (let v = 0; v < 2; v++) {
          EDGE_COLORS[(i*2+v)*3]   = c.r;
          EDGE_COLORS[(i*2+v)*3+1] = c.g;
          EDGE_COLORS[(i*2+v)*3+2] = c.b;
        }
      });
      edgeGeoRef.current.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* ∂L/∂W label */}
      <Text position={[(LAYERS.length-1-(LAYERS.length-1)/2)*LAYER_GAP+0.3, 0.8, 0]}
        fontSize={0.14} color={LOSS_COLOR} anchorX="left" letterSpacing={0.05}>
        ∂L/∂W
      </Text>

      <lineSegments>
        <bufferGeometry ref={edgeGeoRef}>
          <bufferAttribute attach="attributes-position" args={[EDGE_POS, 3]} />
          <bufferAttribute attach="attributes-color"    args={[EDGE_COLORS, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.5} />
      </lineSegments>

      {NET.neurons.map((n, i) => {
        const label = NEURON_LABEL_MAP[n.id];
        return (
          <group key={i} position={[n.x, n.y, 0]}>
            <mesh geometry={SPHERE_GEO}>
              <meshStandardMaterial ref={el => matRefs.current[i] = el}
                color="#0a1a10" emissive="#050a05" emissiveIntensity={0.1}
                roughness={0.1} metalness={0.9} />
            </mesh>
            {label && (
              <Text
                ref={el => { labelRefs.current[i] = el; if (el) el.fillOpacity = 0.12; }}
                position={[0, -0.2, 0]}
                fontSize={0.065}
                color={color}
                anchorX="center"
                anchorY="top"
                letterSpacing={0.02}
                maxWidth={1.1}
              >
                {label}
              </Text>
            )}
          </group>
        );
      })}

      <Text position={[0, -3.2, 0]} fontSize={0.13} color={GRAD_COLOR}
        anchorX="center" letterSpacing={0.12} fillOpacity={0.55}>
        ← GRADIENT FLOW ←
      </Text>

      {beat && (
        <group position={[0, 3.4, 0]}>
          <Text position={[-4.5, 0.3, 0]} fontSize={0.11} color={color} anchorX="left" letterSpacing={0.2}>{beat.date}</Text>
          <Text position={[-4.5, 0, 0]} fontSize={0.22} color="#ffffff" anchorX="left" maxWidth={9} letterSpacing={0.04}>{beat.headline}</Text>
          <Text position={[-4.5, -0.4, 0]} fontSize={0.14} color="#888899" anchorX="left" maxWidth={8.5} letterSpacing={0.02}>{beat.detail}</Text>
        </group>
      )}
    </group>
  );
}
