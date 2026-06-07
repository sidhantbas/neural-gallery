// Renders the correct AI visualization for the current phase inside dive mode
import { Dive1MLP }         from './dive/Dive1MLP';
import { Dive2Backprop }    from './dive/Dive2Backprop';
import { Dive3Transformer } from './dive/Dive3Transformer';
import { Dive4WorldModel }  from './dive/Dive4WorldModel';
import { Dive5Diffusion }   from './dive/Dive5Diffusion';

const DIVE_COMPS = [Dive1MLP, Dive2Backprop, Dive3Transformer, Dive4WorldModel, Dive5Diffusion];

export function DiveScene({ phaseIndex, phases, nodePositions, beatIndex }) {
  const phase = phases[phaseIndex];
  if (!phase) return null;
  const Comp = DIVE_COMPS[phaseIndex] ?? DIVE_COMPS[0];
  const pos  = nodePositions[phaseIndex];

  return (
    <Comp
      position={pos}
      color={phase.color}
      beatIndex={beatIndex}
      storyline={phase.storyline}
    />
  );
}
