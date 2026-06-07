import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const G1 = new THREE.IcosahedronGeometry(1.4, 0);
const G2 = new THREE.IcosahedronGeometry(0.9, 1);
const G3 = new THREE.IcosahedronGeometry(0.45, 0);
const G4 = new THREE.IcosahedronGeometry(2.0, 0);

const LABELS = [
  { text: 'INPUT',        sub: 'x₀',       pos: [ 0.0,  2.2, 0], anchor: 'center' },
  { text: 'HIDDEN_1',     sub: 'σ(Wx+b)',   pos: [-2.2,  0.3, 0], anchor: 'right'  },
  { text: 'HIDDEN_2',     sub: 'h²',        pos: [ 2.2,  0.3, 0], anchor: 'left'   },
  { text: 'OUTPUT',       sub: 'ŷ',         pos: [ 0.0, -2.2, 0], anchor: 'center' },
  { text: 'W',            sub: null,        pos: [-1.6,  1.5, 0], anchor: 'right'  },
  { text: 'b',            sub: null,        pos: [ 1.6,  1.5, 0], anchor: 'left'   },
];

export function Node1Crystal({ position, color }) {
  const r1 = useRef(), r2 = useRef(), r3 = useRef(), r4 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) { r1.current.rotation.x = t * 0.28; r1.current.rotation.y = t * 0.44; }
    if (r2.current) { r2.current.rotation.x = -t * 0.35; r2.current.rotation.z = t * 0.22; }
    if (r3.current) { r3.current.rotation.y = t * 0.6; r3.current.rotation.z = -t * 0.3; }
    if (r4.current) { r4.current.rotation.x = t * 0.07; r4.current.rotation.y = -t * 0.1; }
  });
  return (
    <group position={position}>
      <mesh ref={r4} geometry={G4}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.03} />
      </mesh>
      <mesh ref={r1} geometry={G1}>
        <meshBasicMaterial color={color} wireframe transparent opacity={0.7} />
      </mesh>
      <mesh ref={r2} geometry={G2}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.18} roughness={0.1} metalness={0.9} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={r3} geometry={G3}>
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={9} roughness={0} metalness={1} />
      </mesh>

      {/* Forward pass floating labels */}
      <Text position={[0, 0, 0]} fontSize={0.09} color={color}
        anchorX="center" letterSpacing={0.15} fillOpacity={0.35}>
        FORWARD PASS
      </Text>

      {LABELS.map(({ text, sub, pos, anchor }) => (
        <group key={text} position={pos}>
          <Text fontSize={0.12} color="#444455" anchorX={anchor} letterSpacing={0.1} fillOpacity={0.55}>
            {text}
          </Text>
          {sub && (
            <Text position={[0, -0.18, 0]} fontSize={0.09} color={color} anchorX={anchor} letterSpacing={0.05} fillOpacity={0.35}>
              {sub}
            </Text>
          )}
        </group>
      ))}
    </group>
  );
}
