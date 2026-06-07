import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

export function EnterLabel({ position, color, onClick }) {
  const groupRef = useRef();
  const [opacity, setOpacity] = useState(0.55);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] - 2.4 + Math.sin(t * 1.4) * 0.08;
    }
    setOpacity(0.5 + Math.sin(t * 2) * 0.2);
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] - 2.4, position[2]]}
      onClick={onClick}
      onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Text
        fontSize={0.14}
        color={color}
        anchorX="center"
        letterSpacing={0.2}
        fillOpacity={opacity}
      >
        {'[ E ] ENTER NODE'}
      </Text>
    </group>
  );
}
