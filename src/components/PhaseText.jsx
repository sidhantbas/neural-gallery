import { useEffect, useState, useRef } from 'react';
import { Text } from '@react-three/drei';
import gsap from 'gsap';

export function PhaseText({ phase, active, position, isMobile }) {
  const { label, period, title, lines, color } = phase;
  const allStrings = [label, title, ...lines];
  const s = isMobile ? 0.72 : 1; // uniform scale factor for mobile
  const [counts, setCounts] = useState(() => allStrings.map(() => 0));
  const tlRef = useRef(null);

  useEffect(() => {
    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }

    if (!active) {
      setCounts(allStrings.map(() => 0));
      return;
    }

    const cur = allStrings.map(() => 0);
    const tl = gsap.timeline();
    tlRef.current = tl;

    allStrings.forEach((str, i) => {
      const obj = { v: 0 };
      tl.to(obj, {
        v: str.length,
        duration: Math.max(str.length / 38, 0.3),
        ease: 'none',
        onUpdate() {
          cur[i] = Math.round(obj.v);
          setCounts([...cur]);
        },
      }, i * 0.2);
    });

    return () => { tl.kill(); };
  }, [active, phase.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [px, py, pz] = position;

  const xOff  = isMobile ? -2.8 : 2.4;
  const yTop  = isMobile ? 2.2  : 1.6;

  return (
    <group position={[px, py, pz]}>
      {/* Phase label */}
      <Text
        position={[xOff, yTop, 0]}
        fontSize={0.12 * s}
        color={color}
        anchorX="left"
        letterSpacing={0.2}
      >
        {allStrings[0].slice(0, counts[0])}
      </Text>

      {/* Title */}
      <Text
        position={[xOff, yTop - 0.32 * s, 0]}
        fontSize={0.2 * s}
        color="#ffffff"
        anchorX="left"
        letterSpacing={0.05}
        maxWidth={isMobile ? 5.5 : 7}
      >
        {allStrings[1].slice(0, counts[1])}
      </Text>

      {/* Divider line */}
      <mesh position={[xOff + 3.0 * s, yTop - 0.56 * s, 0]}>
        <boxGeometry args={[6.0 * s, 0.006, 0.01]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>

      {/* Bullet lines */}
      {lines.map((line, i) => (
        <Text
          key={i}
          position={[xOff, yTop - 0.88 * s - i * 0.4 * s, 0]}
          fontSize={0.145 * s}
          color="#9999aa"
          anchorX="left"
          letterSpacing={0.02}
          maxWidth={isMobile ? 5.5 : 6.5}
        >
          {'› ' + allStrings[i + 2].slice(0, counts[i + 2])}
        </Text>
      ))}
    </group>
  );
}
