import { useState, useEffect } from 'react';

export function useViewport() {
  const [vp, setVp] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
  });
  useEffect(() => {
    const fn = () => setVp({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < 768,
    });
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return vp;
}
