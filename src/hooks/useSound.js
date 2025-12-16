import { useRef, useCallback } from 'react';

const SOUND_FILES = {
  ding: '/sounds/ding.mp3',
  buzzer: '/sounds/buzzer.mp3',
  applause: '/sounds/applause.mp3',
};

export function useSound() {
  const audioRefs = useRef({});

  const play = useCallback((sound) => {
    try {
      const soundFile = SOUND_FILES[sound];
      
      // Create or get cached audio element
      if (!audioRefs.current[sound]) {
        audioRefs.current[sound] = new Audio(soundFile);
      }
      
      const audio = audioRefs.current[sound];
      
      // Reset to start if already playing
      audio.currentTime = 0;
      
      // Play with error handling
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          void error;
        });
      }
    } catch (error) {
      void error;
    }
  }, []);

  return { play };
}

