import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise4D } from 'simplex-noise';

const N = 1600;

export function Node5LatentCloud({ position, color }) {
  const ptRef = useRef();
  const noise4D = useMemo(() => createNoise4D(), []);
  const base = useMemo(() => {
    const b = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u1 = Math.random() + 1e-9, u2 = Math.random();
      const mag = Math.sqrt(-2 * Math.log(u1));
      b[i*3]   = mag * Math.cos(2*Math.PI*u2) * 1.9;
      b[i*3+1] = mag * Math.sin(2*Math.PI*u2) * 1.9;
      b[i*3+2] = (Math.random() - 0.5) * 3.8;
    }
    return b;
  }, []);
  const positions = useMemo(() => new Float32Array(base), [base]);

  useFrame(({ clock }) => {
    if (!ptRef.current) return;
    const t = clock.getElapsedTime() * 0.2;
    const arr = ptRef.current.geometry.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const bx=base[i*3], by=base[i*3+1], bz=base[i*3+2];
      arr[i*3]   = bx + noise4D(bx*0.38, by*0.38, bz*0.38, t) * 0.55;
      arr[i*3+1] = by + noise4D(bx*0.38+99, by*0.38, bz*0.38, t) * 0.55;
      arr[i*3+2] = bz + noise4D(bx*0.38, by*0.38+99, bz*0.38, t) * 0.35;
    }
    ptRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group position={position}>
      <points ref={ptRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} usage={THREE.DynamicDrawUsage} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.032} sizeAttenuation transparent opacity={0.7} />
      </points>
      <mesh>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={12} />
      </mesh>
    </group>
  );
}
