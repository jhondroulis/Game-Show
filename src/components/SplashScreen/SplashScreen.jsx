import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './SplashScreen.css';

export function SplashScreen({ leaving, onStart }) {
  const videoRef = useRef(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const className = useMemo(() => {
    return leaving ? 'splash splash--leaving' : 'splash';
  }, [leaving]);

  const toggleAudio = async () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !muted;
    video.muted = nextMuted;
    if (!nextMuted) video.volume = 1;
    setMuted(nextMuted);
  };

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await video.play();
      setIsPlaying(true);
      setHasEnded(false);
    } catch (err) {
      // If playback fails, leave the splash idle; host can try again.
    }
  };

  return (
    <div className={className} aria-label="Intro">
      <video
        ref={videoRef}
        className="splash__video"
        src="/videos/intro-video.mp4"
        playsInline
        muted={muted}
        preload="auto"
        onEnded={() => {
          setHasEnded(true);
          setIsPlaying(false);
        }}
        onError={() => setHasEnded(true)}
      />
      <div className="splash__scrim" aria-hidden="true" />
      <div className="splash__topRight">
        <button className="splash__audio" type="button" onClick={toggleAudio}>
          {muted ? 'Sound on' : 'Sound off'}
        </button>
      </div>
      <div className="splash__controls">
        <button
          className="splash__playPause"
          type="button"
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause intro' : hasEnded ? 'Replay intro' : 'Play intro'}
        </button>
        {hasEnded ? (
          <button className="splash__start" type="button" onClick={onStart}>
            Let&apos;s play!
          </button>
        ) : null}
      </div>
    </div>
  );
}

SplashScreen.propTypes = {
  leaving: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
};



