import { useEffect, useRef, useState } from 'react';

// Looping background track. Tries to autoplay on load; if the browser
// blocks it, the first gesture (click/scroll/key/touch) starts playback.

const TRACK_URL = '/audio/acdc.mp3';
const VOLUME = 0.6;
const FADE_STEP = 0.02;
const STORAGE_KEY = 'ng-muted';

export function useMusic() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });
  const [playing, setPlaying] = useState(false);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const audio = new Audio(TRACK_URL);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0;
    audioRef.current = audio;

    let fadeTimer = null;
    const fadeIn = () => {
      clearInterval(fadeTimer);
      fadeTimer = setInterval(() => {
        if (audio.volume + FADE_STEP >= VOLUME) {
          audio.volume = VOLUME;
          clearInterval(fadeTimer);
        } else {
          audio.volume += FADE_STEP;
        }
      }, 50);
    };

    const tryPlay = () => {
      if (mutedRef.current || !audio.paused) return;
      audio.play().then(() => {
        setPlaying(true);
        fadeIn();
      }).catch(() => {}); // autoplay blocked — wait for a gesture
    };

    tryPlay();

    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
    const onGesture = () => {
      tryPlay();
      if (!audio.paused) events.forEach(e => window.removeEventListener(e, onGesture));
    };
    events.forEach(e => window.addEventListener(e, onGesture));

    return () => {
      clearInterval(fadeTimer);
      events.forEach(e => window.removeEventListener(e, onGesture));
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* ignore */ }
    const audio = audioRef.current;
    if (!audio) return;
    if (next) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = VOLUME;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return { muted, playing, toggleMute };
}
