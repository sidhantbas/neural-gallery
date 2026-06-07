import { useState, useEffect, useRef, useCallback } from 'react';

const COOLDOWN    = 1100;
const MIN_DELTA   = 8;
const MIN_SWIPE   = 40; // px threshold for touch swipe

export function useSnapScroll(count, disabled = false) {
  const [index, setIndex] = useState(0);
  const lock        = useRef(false);
  const disabledRef = useRef(disabled);
  const countRef    = useRef(count);
  const touchStartY = useRef(null);

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

    function onTouchStart(e) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (touchStartY.current === null) return;
      if (disabledRef.current) return;
      if (lock.current) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(dy) < MIN_SWIPE) return;
      lock.current = true;
      setIndex(p =>
        dy > 0
          ? Math.min(p + 1, countRef.current - 1)
          : Math.max(p - 1, 0)
      );
      setTimeout(() => { lock.current = false; }, COOLDOWN);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return { index, goTo };
}
