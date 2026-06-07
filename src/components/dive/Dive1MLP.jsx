// Phase 1 Dive: Multilayer Perceptron — Forward Pass
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Labels keyed by absolute neuron ID (assigned after buildNetwork runs).
// IDs are sequential: layer 0 → 0,1,2 | layer 1 → 3..7 | layer 2 → 8..12 | layer 3 → 13..16 | layer 4 → 17,18
const NEURON_LABEL_MAP = {
  // Input layer — IDs 0,1,2
  0:  'Curiosity',
  1:  'Education',
  2:  'Ambition',
  // Hidden layer 1 — IDs 3-7
  4:  'Curiosity',
  5:  'Education',
  6:  'Ambition',
  // Hidden layer 2 — IDs 8-12
  9:  'Execution',
  10: 'Disruption',
  11: 'Reflection',
  // Hidden layer 3 — IDs 13-16
  14: 'Questions',
  15: 'Understanding',
  // Output layer — IDs 17,18
  17: 'Questions',
  18: 'Understanding',
};

const LAYERS     = [3, 5, 5, 4, 2];
const LAYER_GAP  = 2.2;
const NEURON_GAP = 1.1;

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

// Pre-compute each neuron's index within its own layer
NET.neurons.forEach(n => {
  n.layerIndex = NET.neurons.filter(m => m.layer === n.layer && m.id < n.id).length;
});

function activeAtBeat(beat) {
  const s = new Set();
  for (let l = 0; l <= beat && l < LAYERS.length; l++)
    NET.neurons.filter(n => n.layer === l).forEach(n => s.add(n.id));
  return s;
}

// Pre-build edge position buffer (static positions, colors updated per frame)
const EDGE_POS = (() => {
  const arr = new Float32Array(NET.edges.length * 6);
  NET.edges.forEach((e, i) => {
    const f = NET.neurons[e.from], t = NET.neurons[e.to];
    arr[i*6]   = f.x; arr[i*6+1] = f.y; arr[i*6+2] = 0;
    arr[i*6+3] = t.x; arr[i*6+4] = t.y; arr[i*6+5] = 0;
  });
  return arr;
})();

const EDGE_COLORS = new Float32Array(NET.edges.length * 6); // rgb per vertex
const SPHERE_GEO  = new THREE.SphereGeometry(0.11, 16, 12);
const INACTIVE    = new THREE.Color('#0a2020');

export function Dive1MLP({ position, color, beatIndex, storyline }) {
  const matRefs    = useRef([]);
  const labelRefs  = useRef([]);
  const edgeGeoRef = useRef();
  const active     = useMemo(() => activeAtBeat(beatIndex), [beatIndex]);
  const litColor   = useMemo(() => new THREE.Color(color), [color]);
  const beat       = storyline?.[beatIndex];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    NET.neurons.forEach((n, i) => {
      const mat = matRefs.current[i];
      if (!mat) return;
      const on = active.has(n.id);
      const ei = on ? (n.layer === LAYERS.length - 1 ? 6 : 4 + Math.sin(t*2+i)*1.5) : 0.1;
      mat.emissiveIntensity += (ei - mat.emissiveIntensity) * 0.08;
      mat.color.lerp(on ? litColor : INACTIVE, 0.08);
      mat.emissive.lerp(on ? litColor : INACTIVE, 0.08);

      // _prepareForRender reads this.fillOpacity every frame before draw — no sync() needed
      const ltxt = labelRefs.current[i];
      if (ltxt) ltxt.fillOpacity += ((on ? 0.8 : 0.12) - ltxt.fillOpacity) * 0.08;
    });

    if (edgeGeoRef.current) {
      NET.edges.forEach((e, i) => {
        const lit = active.has(e.from) && active.has(e.to);
        const c = lit ? litColor : INACTIVE;
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
      <lineSegments>
        <bufferGeometry ref={edgeGeoRef}>
          <bufferAttribute attach="attributes-position" args={[EDGE_POS, 3]} />
          <bufferAttribute attach="attributes-color"    args={[EDGE_COLORS, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.45} />
      </lineSegments>

      {NET.neurons.map((n, i) => {
        const label = NEURON_LABEL_MAP[n.id];
        return (
          <group key={i} position={[n.x, n.y, 0]}>
            <mesh geometry={SPHERE_GEO}>
              <meshStandardMaterial ref={el => matRefs.current[i] = el}
                color="#0a2020" emissive="#0a2020" emissiveIntensity={0.1}
                roughness={0.1} metalness={0.9} />
            </mesh>
            {label && (
              <Text
                ref={el => {
                  labelRefs.current[i] = el;
                  if (el) el.fillOpacity = 0.12;
                }}
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

      {['INPUT','HIDDEN','HIDDEN','HIDDEN','OUTPUT'].map((lbl, li) => (
        <Text key={li} position={[(li-(LAYERS.length-1)/2)*LAYER_GAP, -3.2, 0]}
          fontSize={0.11} color={color} anchorX="center" letterSpacing={0.15} fillOpacity={0.3}>
          {lbl}
        </Text>
      ))}

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
