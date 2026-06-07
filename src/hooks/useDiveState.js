import { useState, useEffect, useRef, useCallback } from 'react';

// diving state is owned by App and passed in so useSnapScroll can be disabled
export function useDiveState(phases, orbitIndex, diving, setDiving) {
  const [beatIndex, setBeatIndex] = useState(0);
  const lock = useRef(false);
  const COOLDOWN  = 1000;
  const MIN_DELTA = 8;

  const enter = useCallback(() => {
    setDiving(true);
    setBeatIndex(0);
  }, [setDiving]);

  const exit = useCallback(() => {
    setDiving(false);
    setBeatIndex(0);
  }, [setDiving]);

  const maxBeats = phases[orbitIndex]?.storyline?.length ?? 0;

  useEffect(() => {
    if (!diving) return;
    function onWheel(e) {
      e.preventDefault();
      if (lock.current) return;
      if (Math.abs(e.deltaY) < MIN_DELTA) return;
      lock.current = true;
      if (e.deltaY > 0) {
        setBeatIndex(p => Math.min(p + 1, maxBeats - 1));
      } else {
        setBeatIndex(p => {
          if (p === 0) { setDiving(false); return 0; }
          return p - 1;
        });
      }
      setTimeout(() => { lock.current = false; }, COOLDOWN);
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [diving, maxBeats, setDiving]);

  useEffect(() => {
    function onKey(e) {
      if ((e.key === 'e' || e.key === 'E') && !diving) enter();
      if (e.key === 'Escape' && diving) exit();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [diving, enter, exit]);

  return { beatIndex, enter, exit };
}
