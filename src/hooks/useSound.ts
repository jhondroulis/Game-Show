import { useRef, useCallback } from 'react';

type SoundType = 'ding' | 'buzzer' | 'applause';

const SOUND_FILES: Record<SoundType, string> = {
  ding: '/sounds/ding.mp3',
  buzzer: '/sounds/buzzer.mp3',
  applause: '/sounds/applause.mp3',
};

export function useSound() {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const play = useCallback((sound: SoundType) => {
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
