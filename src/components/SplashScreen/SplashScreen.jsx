import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './SplashScreen.css';

export function SplashScreen({ leaving, onStart }) {
  const videoRef = useRef(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [muted, setMuted] = useState(false);

  const className = useMemo(() => {
    return leaving ? 'splash splash--leaving' : 'splash';
  }, [leaving]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const start = async () => {
      video.muted = false;
      video.volume = 1;
      try {
        await video.play();
        if (!cancelled) setMuted(false);
      } catch (err) {
        video.muted = true;
        try {
          await video.play();
        } catch (innerErr) {
          // If playback fails entirely, the "Let's play!" fallback still works.
        }
        if (!cancelled) setMuted(true);
      }
    };

    start();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleAudio = async () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !muted;
    video.muted = nextMuted;
    if (!nextMuted) video.volume = 1;
    setMuted(nextMuted);

    try {
      await video.play();
    } catch (err) {
      // Ignore; some browsers still require additional gestures.
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
        onEnded={() => setHasEnded(true)}
        onError={() => setHasEnded(true)}
      />
      <div className="splash__scrim" aria-hidden="true" />
      <div className="splash__topRight">
        <button className="splash__audio" type="button" onClick={toggleAudio}>
          {muted ? 'Sound on' : 'Sound off'}
        </button>
      </div>
      <div className="splash__controls">
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

