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
    const touchStartY = { current: null };
    const MIN_SWIPE = 40;

    function advance(forward) {
      if (lock.current) return;
      lock.current = true;
      if (forward) {
        setBeatIndex(p => Math.min(p + 1, maxBeats - 1));
      } else {
        setBeatIndex(p => {
          if (p === 0) { setDiving(false); return 0; }
          return p - 1;
        });
      }
      setTimeout(() => { lock.current = false; }, COOLDOWN);
    }

    function onWheel(e) {
      e.preventDefault();
      if (Math.abs(e.deltaY) < MIN_DELTA) return;
      advance(e.deltaY > 0);
    }

    function onTouchStart(e) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (touchStartY.current === null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(dy) < MIN_SWIPE) return;
      advance(dy > 0);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
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
