import { useState, useEffect, useRef, useCallback } from 'react';

const COOLDOWN  = 1100;
const MIN_DELTA = 8; // ignore tiny inertia ticks, allow intentional swipes

export function useSnapScroll(count, disabled = false) {
  const [index, setIndex] = useState(0);
  const lock        = useRef(false);
  const disabledRef = useRef(disabled);
  const countRef    = useRef(count);

  disabledRef.current = disabled;
  countRef.current    = count;

  const goTo = useCallback((i) => {
    setIndex(Math.max(0, Math.min(countRef.current - 1, i)));
  }, []);

  useEffect(() => {
    function onWheel(e) {
      e.preventDefault();
      if (disabledRef.current) return;
      if (lock.current) return;
      if (Math.abs(e.deltaY) < MIN_DELTA) return;
      lock.current = true;
      setIndex(p =>
        e.deltaY > 0
          ? Math.min(p + 1, countRef.current - 1)
          : Math.max(p - 1, 0)
      );
      setTimeout(() => { lock.current = false; }, COOLDOWN);
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []); // registered once, never re-registered

  return { index, goTo };
}
