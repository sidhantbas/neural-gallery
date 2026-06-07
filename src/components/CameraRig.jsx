import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const _pos     = new THREE.Vector3();
const _look    = new THREE.Vector3();
const _curLook = new THREE.Vector3(0, 0, 0);

// Dive camera: plunges from orbit position into node centre
// then re-positions inside the AI visualization space
const DIVE_OFFSET = new THREE.Vector3(0, 0, 4.5); // inside the visualization

export function CameraRig({ phaseIndex, cameraConfigs, dofRef, caRef, diving, nodePositions }) {
  const { camera, mouse } = useThree();
  const prevDiving = useRef(false);
  const plungeProgress = useRef(0);

  useFrame((_, delta) => {
    const cfg = cameraConfigs?.[phaseIndex];
    if (!cfg) return;

    const nodePos = nodePositions?.[phaseIndex];

    // ── Detect dive entry → kick off plunge ──────────────────────
    if (diving && !prevDiving.current) {
      plungeProgress.current = 0;
    }
    prevDiving.current = diving;

    const a    = 1 - Math.exp(-2.2 * delta);  // slower, silky glide
    const aLook = 1 - Math.exp(-2.0 * delta); // look lags slightly behind position

    if (!diving) {
      // ── Orbit mode ───────────────────────────────────────────────
      _pos.set(...cfg.position);
      _look.set(...cfg.lookAt);

      camera.position.x += (cfg.position[0] + mouse.x * 0.3 - camera.position.x) * a;
      camera.position.y += (cfg.position[1] + mouse.y * 0.2 - camera.position.y) * a;
      camera.position.z += (cfg.position[2] - camera.position.z) * a;

      _curLook.lerp(_look, aLook);
      camera.lookAt(_curLook);

      // Chromatic aberration off at orbit idle
      if (caRef?.current) {
        caRef.current.offset.x += (0 - caRef.current.offset.x) * (1 - Math.exp(-6 * delta));
        caRef.current.offset.y += (0 - caRef.current.offset.y) * (1 - Math.exp(-6 * delta));
      }

    } else {
      // ── Dive / plunge mode ────────────────────────────────────────
      plungeProgress.current = Math.min(plungeProgress.current + delta * 1.2, 1);
      const t  = plungeProgress.current;
      const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; // cubic ease in-out

      if (nodePos) {
        // Target: inside the node
        const tx = nodePos[0];
        const ty = nodePos[1];
        const tz = nodePos[2] + DIVE_OFFSET.z;

        camera.position.x += (tx - camera.position.x) * (1 - Math.exp(-5 * delta));
        camera.position.y += (ty - camera.position.y) * (1 - Math.exp(-5 * delta));
        camera.position.z += (tz - camera.position.z) * (1 - Math.exp(-5 * delta));

        _look.set(nodePos[0], nodePos[1], nodePos[2] - 3);
        _curLook.lerp(_look, 1 - Math.exp(-5 * delta));
        camera.lookAt(_curLook);
      }

      // Chromatic aberration spikes at plunge peak, fades as settled
      if (caRef?.current) {
        const aberration = ease < 0.85
          ? ease * 0.012
          : (1 - ease) * 0.06;
        caRef.current.offset.x = aberration;
        caRef.current.offset.y = aberration * 0.4;
      }
    }

    // DoF: spike during transition, zero at settled states
    if (dofRef?.current) {
      const target = diving
        ? (plungeProgress.current < 0.9 ? 8 : 0)
        : (camera.position.distanceTo(_pos) > 0.12 ? 7 : 0);
      dofRef.current.bokehScale +=
        (target - dofRef.current.bokehScale) * (1 - Math.exp(-5 * delta));
    }
  });

  return null;
}
