import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 280, D2 = 1.1 * 1.1;
function buildBuffers() {
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const r = 0.5 + Math.random() * 1.5;
    pos[i*3] = r*Math.sin(ph)*Math.cos(th);
    pos[i*3+1] = r*Math.sin(ph)*Math.sin(th);
    pos[i*3+2] = r*Math.cos(ph);
  }
  const lines = [];
  for (let i = 0; i < COUNT; i++) {
    for (let j = i+1; j < COUNT; j++) {
      const dx=pos[i*3]-pos[j*3], dy=pos[i*3+1]-pos[j*3+1], dz=pos[i*3+2]-pos[j*3+2];
      if (dx*dx+dy*dy+dz*dz < D2) {
        lines.push(pos[i*3],pos[i*3+1],pos[i*3+2],pos[j*3],pos[j*3+1],pos[j*3+2]);
      }
    }
  }
  return { pos, lines: new Float32Array(lines) };
}
const BUFS = buildBuffers();

export function Node2Particles({ position, color }) {
  const g = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15;
    if (g.current) { g.current.rotation.y = t; g.current.rotation.x = t * 0.35; }
  });
  return (
    <group position={position} ref={g}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[BUFS.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.048} sizeAttenuation transparent opacity={0.9} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[BUFS.lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.2} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={10} />
      </mesh>
    </group>
  );
}
