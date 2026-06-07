import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { ChromaticAberrationEffect } from 'postprocessing';
import { useSnapScroll }  from './hooks/useSnapScroll';
import { useDiveState }   from './hooks/useDiveState';
import { useViewport }    from './hooks/useViewport';
import { CameraRig }      from './components/CameraRig';
import { SceneContent }   from './components/SceneContent';
import { DiveScene }      from './components/DiveScene';
import { PHASES, deriveLayout } from './data/phases';
import * as THREE from 'three';

// Singleton CA effect so we can hand a ref to CameraRig
const caEffect = new ChromaticAberrationEffect({
  offset: new THREE.Vector2(0, 0),
  radialModulation: false,
});

export default function App() {
  const phases                 = PHASES;
  const [diving, setDiving]   = useState(false);
  const { index, goTo }       = useSnapScroll(phases.length, diving);
  const dofRef                = useRef();
  const caRef                 = useRef(caEffect);
  const { isMobile, isSmallMobile } = useViewport();

  const { nodePositions, cameraConfigs } = deriveLayout(phases);

  const { beatIndex, enter, exit } = useDiveState(phases, index, diving, setDiving);

  const phase = phases[index];

  return (
    <div style={{ width:'100vw', height:'100vh', background:'#050505', overflow:'hidden', position:'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position:[0, 0.5, 8], fov:60, near:0.1, far:500 }}
        gl={{ antialias:true, powerPreference:'high-performance' }}
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.12} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

        <CameraRig
          phaseIndex={index}
          cameraConfigs={cameraConfigs}
          nodePositions={nodePositions}
          dofRef={dofRef}
          caRef={caRef}
          diving={diving}
          isMobile={isMobile}
        />

        {/* Orbit scene — hidden during dive */}
        {!diving && (
          <SceneContent
            phaseIndex={index}
            phases={phases}
            nodePositions={nodePositions}
            onEnter={enter}
            isMobile={isMobile}
          />
        )}

        {/* Dive scene — only active when diving */}
        {diving && (
          <DiveScene
            phaseIndex={index}
            phases={phases}
            nodePositions={nodePositions}
            beatIndex={beatIndex}
          />
        )}

        <EffectComposer>
          <DepthOfField
            ref={dofRef}
            focusDistance={0.01}
            focalLength={0.02}
            bokehScale={0}
            resolutionScale={0.5}
          />
          <primitive object={caEffect} />
          <Bloom
            luminanceThreshold={0.08}
            luminanceSmoothing={0.85}
            intensity={2.8}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>

      {/* Nav dots — hidden while diving or on mobile */}
      {!diving && !isMobile && (
        <div style={{ position:'fixed', right:24, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:12, zIndex:100 }}>
          {phases.map((p, i) => (
            <button key={p.id} onClick={() => goTo(i)} style={{
              width:8, height:8, borderRadius:'50%', border:'none', padding:0, cursor:'pointer',
              background: index === i ? p.color : 'rgba(255,255,255,0.15)',
              boxShadow: index === i ? `0 0 10px ${p.color}` : 'none',
              transition:'background 0.3s, box-shadow 0.3s',
            }} />
          ))}
        </div>
      )}

      {/* Tap to enter — mobile only, orbit mode */}
      {!diving && isMobile && (
        <button onClick={enter} style={{
          position:'fixed', bottom:32, left:'50%', transform:'translateX(-50%)',
          fontFamily:'"JetBrains Mono","Fira Code",monospace',
          fontSize:10, letterSpacing:'0.2em',
          background:'rgba(8,8,16,0.85)',
          border:`1px solid ${phase.color}44`,
          color: phase.color,
          padding:'10px 20px', cursor:'pointer', zIndex:200,
          WebkitTapHighlightColor:'transparent',
        }}>
          [ TAP ] ENTER NODE
        </button>
      )}

      {/* Dive HUD */}
      {diving && (
        <div style={{
          position:'fixed', bottom: isMobile ? 20 : 28, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:6,
          zIndex:100, pointerEvents:'none',
        }}>
          {/* Beat progress dots */}
          <div style={{ display:'flex', gap: isMobile ? 10 : 8 }}>
            {phase?.storyline?.map((_, i) => (
              <div key={i} style={{
                width: isMobile ? 7 : 5, height: isMobile ? 7 : 5, borderRadius:'50%',
                background: i <= beatIndex ? phase.color : 'rgba(255,255,255,0.12)',
                boxShadow: i === beatIndex ? `0 0 8px ${phase.color}` : 'none',
                transition:'all 0.3s',
              }} />
            ))}
          </div>
          <div style={{
            fontFamily:'"JetBrains Mono","Fira Code",monospace',
            fontSize: isSmallMobile ? 7 : isMobile ? 8 : 9,
            letterSpacing:'0.2em', color:'rgba(255,255,255,0.25)',
          }}>
            {isMobile ? 'SWIPE TO ADVANCE · TAP ✕ TO EXIT' : 'SCROLL TO ADVANCE · ESC TO EXIT'}
          </div>
        </div>
      )}

      {/* Exit button */}
      {diving && (
        <button onClick={exit} style={{
          position:'fixed', top: isMobile ? 12 : 16, right: isMobile ? 12 : 48,
          fontFamily:'"JetBrains Mono","Fira Code",monospace',
          fontSize: isMobile ? 11 : 10, letterSpacing:'0.15em',
          background:'rgba(8,8,16,0.88)',
          border:'1px solid rgba(255,255,255,0.12)',
          color:'rgba(255,255,255,0.35)',
          padding: isMobile ? '8px 16px' : '5px 12px',
          cursor:'pointer', zIndex:200,
          transition:'all 0.2s',
          WebkitTapHighlightColor:'transparent',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
        >
          {isMobile ? '✕ EXIT' : '[ ESC ] EXIT'}
        </button>
      )}
    </div>
  );
}
