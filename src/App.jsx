import React, { useEffect, useRef, useState } from 'react';
import { GameProvider } from './context/GameProvider';
import { useGame } from './context/useGame';
import { Board } from './components/Board/Board';
import { GameOver } from './components/GameOver/GameOver';
import { HostControls } from './components/HostControls/HostControls';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { useSound } from './hooks/useSound';
import './App.css';

function GameContent() {
  const { state } = useGame();
  const { play } = useSound();

  // Sound effects based on phase changes
  useEffect(() => {
    if (state.phase === 'roundResult') {
      play('applause');
    }
  }, [state.phase, play]);

  // Sound effect for strikes
  useEffect(() => {
    if (state.roundStrikes > 0 && state.phase === 'playing') {
      play('buzzer');
    }
  }, [state.roundStrikes, state.phase, play]);

  // Sound effect for reveals
  useEffect(() => {
    const revealCount = state.revealedAnswerIds.size;
    if (revealCount > 0 && state.phase !== 'roundResult') {
      play('ding');
    }
  }, [state.revealedAnswerIds.size, state.phase, play]);

  if (state.phase === 'gameOver') {
    return (
      <React.Fragment>
        <GameOver />
        <HostControls />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Board />
      <HostControls />
    </React.Fragment>
  );
}

function App() {
  const [stage, setStage] = useState('splash');
  const [appVisible, setAppVisible] = useState(false);
  const transitionTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setStage('app');
      setAppVisible(true);
      return;
    }

    setStage('transition');
    setAppVisible(false);

    window.requestAnimationFrame(() => setAppVisible(true));

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      setStage('app');
    }, 900);
  };

  return (
    <div className="app-stage">
      {stage !== 'splash' ? (
        <div className={appVisible ? 'app-stage__app app-stage__app--visible' : 'app-stage__app'}>
          <GameProvider>
            <GameContent />
          </GameProvider>
        </div>
      ) : null}

      {stage !== 'app' ? <SplashScreen leaving={stage === 'transition'} onStart={handleStart} /> : null}
    </div>
  );
}

export default App;

