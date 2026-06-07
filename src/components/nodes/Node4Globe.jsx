import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const N = 1800, R = 1.8, ARCS = 14, SEGS = 60;
function buildGlobe() {
  const pos = new Float32Array(N * 3);
  const gold = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N-1)) * 2;
    const r = Math.sqrt(1 - y*y) * R;
    const th = gold * i;
    pos[i*3] = Math.cos(th)*r; pos[i*3+1] = y*R; pos[i*3+2] = Math.sin(th)*r;
  }
  const arcs = [];
  for (let a = 0; a < ARCS; a++) {
    const p1 = new THREE.Vector3(
      Math.sin(Math.random()*Math.PI)*Math.cos(Math.random()*Math.PI*2),
      Math.cos(Math.random()*Math.PI),
      Math.sin(Math.random()*Math.PI)*Math.sin(Math.random()*Math.PI*2)
    ).multiplyScalar(R*1.02);
    const p2 = new THREE.Vector3(
      Math.sin(Math.random()*Math.PI)*Math.cos(Math.random()*Math.PI*2),
      Math.cos(Math.random()*Math.PI),
      Math.sin(Math.random()*Math.PI)*Math.sin(Math.random()*Math.PI*2)
    ).multiplyScalar(R*1.02);
    for (let s = 0; s <= SEGS; s++) {
      const pt = new THREE.Vector3().lerpVectors(p1, p2, s/SEGS).normalize().multiplyScalar(R*1.02);
      arcs.push(pt.x, pt.y, pt.z);
    }
  }
  return { pos, arcs: new Float32Array(arcs) };
}
const GLOBE = buildGlobe();

export function Node4Globe({ position, color }) {
  const g = useRef(), a = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.1;
    if (g.current) g.current.rotation.y = t;
    if (a.current) a.current.rotation.y = t;
  });
  return (
    <group position={position}>
      <points ref={g}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[GLOBE.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.022} sizeAttenuation transparent opacity={0.8} />
      </points>
      <lineSegments ref={a}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[GLOBE.arcs, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.4} />
      </lineSegments>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[R, 0.01, 4, 128]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={7} />
      </mesh>
    </group>
  );
}
