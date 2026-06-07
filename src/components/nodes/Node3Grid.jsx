import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PLANES = [
  { pos:[-1.9, 0.9,-1.3], rot:[0.1, 0.3, 0],     sz:[2.6,1.5] },
  { pos:[ 1.6,-0.2, 0.6], rot:[-0.1,-0.22,0],    sz:[1.9,1.1] },
  { pos:[ 0.3, 1.6,-0.9], rot:[0.2, 0.1, 0.1],   sz:[1.3,0.75]},
  { pos:[-0.4,-1.5, 0.3], rot:[-0.15,0.18,0],     sz:[2.2,0.55]},
  { pos:[ 1.0, 0.5,-2.0], rot:[0.05,0.45,0.05],   sz:[1.0,1.8] },
];

export function Node3Grid({ position, color }) {
  const rootRef = useRef();
  const planeRefs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rootRef.current) rootRef.current.rotation.y = Math.sin(t * 0.18) * 0.18;
    planeRefs.current.forEach((r, i) => {
      if (r) r.position.y = PLANES[i].pos[1] + Math.sin(t * 0.55 + i * 1.3) * 0.09;
    });
  });
  return (
    <group position={position} ref={rootRef}>
      {PLANES.map((p, i) => (
        <group key={i} ref={el => planeRefs.current[i] = el} position={p.pos} rotation={p.rot}>
          <mesh>
            <planeGeometry args={p.sz} />
            <meshBasicMaterial color={color} wireframe transparent opacity={0.75} />
          </mesh>
          <mesh>
            <planeGeometry args={p.sz} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      ))}
      <mesh>
        <cylinderGeometry args={[0.008, 0.008, 6, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={8} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
