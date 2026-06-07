import { Node1Crystal }     from './nodes/Node1Crystal';
import { Node2Particles }   from './nodes/Node2Particles';
import { Node3Grid }        from './nodes/Node3Grid';
import { Node4Globe }       from './nodes/Node4Globe';
import { Node5LatentCloud } from './nodes/Node5LatentCloud';
import { PhaseText }        from './PhaseText';
import { EnterLabel }       from './EnterLabel';

export const VISUAL_MAP = {
  crystal:     Node1Crystal,
  particles:   Node2Particles,
  grid:        Node3Grid,
  globe:       Node4Globe,
  latentcloud: Node5LatentCloud,
};

export const VISUAL_LABELS = {
  crystal:     'Crystal (Icosahedron)',
  particles:   'Particles (Graph)',
  grid:        'Grid (Planes)',
  globe:       'Globe (Dot Sphere)',
  latentcloud: 'Latent Cloud (Noise)',
};

export function SceneContent({ phaseIndex, phases, nodePositions, onEnter }) {
  return (
    <>
      {phases.map((phase, i) => {
        const Visual   = VISUAL_MAP[phase.nodeType] ?? Node1Crystal;
        const isActive = phaseIndex === i;
        return (
          <group key={phase.id}>
            <Visual position={nodePositions[i]} color={phase.color} />
            <PhaseText phase={phase} active={isActive} position={nodePositions[i]} />
            {isActive && (
              <EnterLabel
                position={nodePositions[i]}
                color={phase.color}
                onClick={onEnter}
              />
            )}
          </group>
        );
      })}
    </>
  );
}
